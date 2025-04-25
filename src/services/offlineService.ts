import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Article, Category } from '../types/article';
import { Version } from '../types/version';

interface OfflineDB extends DBSchema {
  offline_articles: {
    key: string;
    value: Article & { lastModified: Date };
    indexes: { 'by-modified': Date };
  };
  offline_categories: {
    key: string;
    value: Category & { lastModified: Date };
    indexes: { 'by-modified': Date };
  };
  offline_versions: {
    key: string;
    value: Version & { lastModified: Date };
    indexes: { 'by-article': string; 'by-modified': Date };
  };
}

class OfflineService {
  private readonly DB_NAME = 'offline-editor-db';
  private readonly VERSION = 1;
  private db: IDBPDatabase<OfflineDB> | null = null;

  async initDB() {
    if (!this.db) {
      this.db = await openDB<OfflineDB>(this.DB_NAME, this.VERSION, {
        upgrade(db) {
          // 创建离线文章存储
          const articleStore = db.createObjectStore('offline_articles', { keyPath: 'id' });
          articleStore.createIndex('by-modified', 'lastModified');

          // 创建离线分类存储
          const categoryStore = db.createObjectStore('offline_categories', { keyPath: 'id' });
          categoryStore.createIndex('by-modified', 'lastModified');

          // 创建离线版本存储
          const versionStore = db.createObjectStore('offline_versions', { keyPath: 'id' });
          versionStore.createIndex('by-article', 'articleId');
          versionStore.createIndex('by-modified', 'lastModified');
        },
      });
    }
    return this.db;
  }

  // 文章相关操作
  async saveArticle(article: Article): Promise<void> {
    const db = await this.initDB();
    await db.put('offline_articles', {
      ...article,
      lastModified: new Date(),
    });
  }

  async getArticle(articleId: string): Promise<Article | undefined> {
    const db = await this.initDB();
    return await db.get('offline_articles', articleId);
  }

  async getAllArticles(): Promise<Article[]> {
    const db = await this.initDB();
    return await db.getAll('offline_articles');
  }

  async deleteArticle(articleId: string): Promise<void> {
    const db = await this.initDB();
    await db.delete('offline_articles', articleId);
  }

  // 分类相关操作
  async saveCategory(category: Category): Promise<void> {
    const db = await this.initDB();
    await db.put('offline_categories', {
      ...category,
      lastModified: new Date(),
    });
  }

  async getCategory(categoryId: string): Promise<Category | undefined> {
    const db = await this.initDB();
    return await db.get('offline_categories', categoryId);
  }

  async getAllCategories(): Promise<Category[]> {
    const db = await this.initDB();
    return await db.getAll('offline_categories');
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const db = await this.initDB();
    await db.delete('offline_categories', categoryId);
  }

  // 版本相关操作
  async saveVersion(version: Version): Promise<void> {
    const db = await this.initDB();
    await db.put('offline_versions', {
      ...version,
      lastModified: new Date(),
    });
  }

  async getVersion(versionId: string): Promise<Version | undefined> {
    const db = await this.initDB();
    return await db.get('offline_versions', versionId);
  }

  async getVersionsByArticle(articleId: string): Promise<Version[]> {
    const db = await this.initDB();
    return await db.getAllFromIndex('offline_versions', 'by-article', articleId);
  }

  async deleteVersion(versionId: string): Promise<void> {
    const db = await this.initDB();
    await db.delete('offline_versions', versionId);
  }

  // 同步相关操作
  async getModifiedArticles(since: Date): Promise<Article[]> {
    const db = await this.initDB();
    const articles = await db.getAllFromIndex('offline_articles', 'by-modified');
    return articles.filter(article => article.lastModified > since);
  }

  async getModifiedCategories(since: Date): Promise<Category[]> {
    const db = await this.initDB();
    const categories = await db.getAllFromIndex('offline_categories', 'by-modified');
    return categories.filter(category => category.lastModified > since);
  }

  async getModifiedVersions(since: Date): Promise<Version[]> {
    const db = await this.initDB();
    const versions = await db.getAllFromIndex('offline_versions', 'by-modified');
    return versions.filter(version => version.lastModified > since);
  }

  // 清理过期数据
  async cleanupOldData(olderThan: Date): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(['offline_articles', 'offline_categories', 'offline_versions'], 'readwrite');

    // 清理文章
    const articles = await tx.store.getAllFromIndex('by-modified');
    for (const article of articles) {
      if (article.lastModified < olderThan) {
        await tx.store.delete(article.id);
      }
    }

    // 清理分类
    const categories = await tx.objectStore('offline_categories').getAllFromIndex('by-modified');
    for (const category of categories) {
      if (category.lastModified < olderThan) {
        await tx.objectStore('offline_categories').delete(category.id);
      }
    }

    // 清理版本
    const versions = await tx.objectStore('offline_versions').getAllFromIndex('by-modified');
    for (const version of versions) {
      if (version.lastModified < olderThan) {
        await tx.objectStore('offline_versions').delete(version.id);
      }
    }

    await tx.done;
  }
}

export const offlineService = new OfflineService();