import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { Article, Category } from '../types/article';
import { SyncState, SyncMetadata, SyncableArticle, SyncableCategory, SyncConflict, SyncResult, SyncOptions } from '../types/sync';
import { authService } from './authService';

interface SyncDB extends DBSchema {
  sync_metadata: {
    key: string;
    value: {
      id: string;
      lastSyncTime: Date;
      deviceId: string;
    };
  };
}

class SyncService {
  private readonly API_URL = 'https://api.example.com'; // 替换为实际的API地址
  private readonly DEVICE_ID_KEY = 'device_id';
  private db: IDBPDatabase<SyncDB> | null = null;
  private syncState: SyncState = {
    isSyncing: false,
    lastSyncTime: null,
    error: null,
  };

  constructor() {
    this.initDB();
    this.initDeviceId();
  }

  private async initDB() {
    if (!this.db) {
      this.db = await openDB<SyncDB>('sync-db', 1, {
        upgrade(db) {
          db.createObjectStore('sync_metadata', { keyPath: 'id' });
        },
      });
    }
    return this.db;
  }

  private initDeviceId() {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  private getDeviceId(): string {
    return localStorage.getItem(this.DEVICE_ID_KEY) || this.initDeviceId();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('未登录');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Device-ID': this.getDeviceId(),
      ...options.headers,
    };

    const response = await fetch(`${this.API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '同步失败');
    }

    return response.json();
  }

  private createSyncMetadata(): SyncMetadata {
    return {
      userId: authService.getUser()?.id || '',
      deviceId: this.getDeviceId(),
      timestamp: new Date(),
      version: 1,
    };
  }

  private async detectConflicts(
    localItems: (Article | Category)[],
    remoteItems: (SyncableArticle | SyncableCategory)[]
  ): Promise<SyncConflict[]> {
    const conflicts: SyncConflict[] = [];

    for (const localItem of localItems) {
      const remoteItem = remoteItems.find(item => item.id === localItem.id);
      if (remoteItem && new Date(remoteItem.updatedAt) > new Date(localItem.updatedAt)) {
        conflicts.push({
          type: 'article' in localItem ? 'article' : 'category',
          localVersion: {
            ...localItem,
            metadata: this.createSyncMetadata(),
          } as SyncableArticle | SyncableCategory,
          remoteVersion: remoteItem,
          resolved: false,
        });
      }
    }

    return conflicts;
  }

  async syncArticles(articles: Article[], options: SyncOptions = {}): Promise<SyncResult> {
    try {
      this.syncState.isSyncing = true;
      this.syncState.error = null;

      // 获取远程文章
      const remoteArticles = await this.request<SyncableArticle[]>('/sync/articles');

      // 检测冲突
      const conflicts = await this.detectConflicts(articles, remoteArticles);

      if (conflicts.length > 0 && options.resolveStrategy !== 'remote') {
        return {
          success: false,
          syncedItems: 0,
          conflicts,
          error: '发现冲突',
        };
      }

      // 上传本地文章
      const syncableArticles: SyncableArticle[] = articles.map(article => ({
        ...article,
        metadata: this.createSyncMetadata(),
      }));

      await this.request('/sync/articles', {
        method: 'POST',
        body: JSON.stringify(syncableArticles),
      });

      this.syncState.lastSyncTime = new Date();
      return {
        success: true,
        syncedItems: articles.length,
        conflicts: [],
      };
    } catch (error) {
      this.syncState.error = error instanceof Error ? error.message : '同步失败';
      throw error;
    } finally {
      this.syncState.isSyncing = false;
    }
  }

  async syncCategories(categories: Category[], options: SyncOptions = {}): Promise<SyncResult> {
    try {
      this.syncState.isSyncing = true;
      this.syncState.error = null;

      // 获取远程分类
      const remoteCategories = await this.request<SyncableCategory[]>('/sync/categories');

      // 检测冲突
      const conflicts = await this.detectConflicts(categories, remoteCategories);

      if (conflicts.length > 0 && options.resolveStrategy !== 'remote') {
        return {
          success: false,
          syncedItems: 0,
          conflicts,
          error: '发现冲突',
        };
      }

      // 上传本地分类
      const syncableCategories: SyncableCategory[] = categories.map(category => ({
        ...category,
        metadata: this.createSyncMetadata(),
      }));

      await this.request('/sync/categories', {
        method: 'POST',
        body: JSON.stringify(syncableCategories),
      });

      this.syncState.lastSyncTime = new Date();
      return {
        success: true,
        syncedItems: categories.length,
        conflicts: [],
      };
    } catch (error) {
      this.syncState.error = error instanceof Error ? error.message : '同步失败';
      throw error;
    } finally {
      this.syncState.isSyncing = false;
    }
  }

  async resolveConflict(conflict: SyncConflict, useLocal: boolean): Promise<void> {
    const resolvedItem = useLocal ? conflict.localVersion : conflict.remoteVersion;
    const endpoint = conflict.type === 'article' ? '/sync/articles' : '/sync/categories';

    await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(resolvedItem),
    });
  }

  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  async getLastSyncTime(): Promise<Date | null> {
    const db = await this.initDB();
    const metadata = await db.get('sync_metadata', 'last_sync');
    return metadata?.lastSyncTime || null;
  }
}

export const syncService = new SyncService();