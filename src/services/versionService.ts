import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Version, VersionMetadata } from '../types/version';

interface MarkdownEditorDB extends DBSchema {
  versions: {
    key: string;
    value: Version;
    indexes: {
      'by-article': string;
      'by-date': Date;
    };
  };
}

const DB_NAME = 'markdown-editor-db';
const VERSION = 1;

class VersionService {
  private db: IDBPDatabase<MarkdownEditorDB> | null = null;

  async initDB() {
    if (!this.db) {
      this.db = await openDB<MarkdownEditorDB>(DB_NAME, VERSION, {
        upgrade(db) {
          const versionStore = db.createObjectStore('versions', { keyPath: 'id' });
          versionStore.createIndex('by-article', 'articleId');
          versionStore.createIndex('by-date', 'createdAt');
        },
      });
    }
    return this.db;
  }

  async createVersion(version: Version): Promise<void> {
    const db = await this.initDB();
    await db.add('versions', version);
  }

  async getVersionsByArticle(articleId: string): Promise<Version[]> {
    const db = await this.initDB();
    const versions = await db.getAllFromIndex('versions', 'by-article', articleId);
    return versions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getVersion(versionId: string): Promise<Version | undefined> {
    const db = await this.initDB();
    return await db.get('versions', versionId);
  }

  async deleteVersion(versionId: string): Promise<void> {
    const db = await this.initDB();
    await db.delete('versions', versionId);
  }

  async deleteVersionsByArticle(articleId: string): Promise<void> {
    const db = await this.initDB();
    const versions = await this.getVersionsByArticle(articleId);
    await Promise.all(versions.map(version => this.deleteVersion(version.id)));
  }
}

export const versionService = new VersionService();