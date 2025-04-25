import { Image } from '../types/image';

class BackupService {
  private readonly BACKUP_KEY = 'markdown_editor_images_backup';
  private readonly MAX_BACKUPS = 5;
  private readonly BACKUP_INTERVAL = 1000 * 60 * 60; // 1小时
  private backupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startAutoBackup();
  }

  // 开始自动备份
  startAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }

    this.backupTimer = setInterval(() => {
      this.createBackup();
    }, this.BACKUP_INTERVAL);
  }

  // 停止自动备份
  stopAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  // 创建备份
  createBackup() {
    try {
      const currentImages = localStorage.getItem('markdown_editor_images');
      if (!currentImages) return;

      const backups = this.getAllBackups();
      const newBackup = {
        timestamp: new Date().getTime(),
        data: currentImages
      };

      backups.push(newBackup);
      
      // 保留最新的N个备份
      if (backups.length > this.MAX_BACKUPS) {
        backups.shift();
      }

      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
      return true;
    } catch (error) {
      console.error('创建备份失败:', error);
      return false;
    }
  }

  // 获取所有备份
  getAllBackups(): Array<{ timestamp: number; data: string }> {
    try {
      const backups = localStorage.getItem(this.BACKUP_KEY);
      return backups ? JSON.parse(backups) : [];
    } catch {
      return [];
    }
  }

  // 从备份恢复
  restoreFromBackup(timestamp: number): boolean {
    try {
      const backups = this.getAllBackups();
      const backup = backups.find(b => b.timestamp === timestamp);
      
      if (!backup) return false;

      localStorage.setItem('markdown_editor_images', backup.data);
      return true;
    } catch {
      return false;
    }
  }

  // 删除指定备份
  deleteBackup(timestamp: number): boolean {
    try {
      const backups = this.getAllBackups();
      const filteredBackups = backups.filter(b => b.timestamp !== timestamp);
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(filteredBackups));
      return true;
    } catch {
      return false;
    }
  }

  // 清理所有备份
  clearAllBackups(): boolean {
    try {
      localStorage.removeItem(this.BACKUP_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export const backupService = new BackupService();