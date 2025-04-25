// 数据同步相关的类型定义

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

export interface SyncMetadata {
  userId: string;
  deviceId: string;
  timestamp: Date;
  version: number;
}

export interface SyncableArticle {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  charCount: number;
  metadata: SyncMetadata;
}

export interface SyncableCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: SyncMetadata;
}

export interface SyncConflict {
  type: 'article' | 'category';
  localVersion: SyncableArticle | SyncableCategory;
  remoteVersion: SyncableArticle | SyncableCategory;
  resolved: boolean;
}

export interface SyncResult {
  success: boolean;
  syncedItems: number;
  conflicts: SyncConflict[];
  error?: string;
}

export interface SyncOptions {
  forceSync?: boolean;
  resolveStrategy?: 'local' | 'remote' | 'manual';
  deviceId?: string;
}