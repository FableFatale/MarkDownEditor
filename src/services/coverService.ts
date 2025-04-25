import { v4 as uuidv4 } from 'uuid';

interface CoverImage {
  id: string;
  url: string;
  title: string;
  createdAt: Date;
}

class CoverService {
  private covers: CoverImage[] = [];

  constructor() {
    // 从本地存储加载封面图数据
    const storedCovers = localStorage.getItem('covers');
    if (storedCovers) {
      this.covers = JSON.parse(storedCovers);
    }
  }

  // 保存封面图
  async saveCover(coverUrl: string, title: string): Promise<CoverImage> {
    const newCover: CoverImage = {
      id: uuidv4(),
      url: coverUrl,
      title,
      createdAt: new Date()
    };

    this.covers.unshift(newCover);
    this.saveToLocalStorage();
    return newCover;
  }

  // 获取所有封面图
  getAllCovers(): CoverImage[] {
    return this.covers;
  }

  // 删除封面图
  deleteCover(coverId: string): boolean {
    const initialLength = this.covers.length;
    this.covers = this.covers.filter(cover => cover.id !== coverId);
    
    if (this.covers.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // 保存到本地存储
  private saveToLocalStorage(): void {
    localStorage.setItem('covers', JSON.stringify(this.covers));
  }
}

export const coverService = new CoverService();