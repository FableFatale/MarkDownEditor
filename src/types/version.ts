// 版本历史相关的类型定义

export interface Version {
  id: string;
  articleId: string;
  content: string;
  title: string;
  createdAt: Date;
  description?: string;
  wordCount: number;
  charCount: number;
}

export interface VersionMetadata {
  id: string;
  articleId: string;
  title: string;
  createdAt: Date;
  description?: string;
  wordCount: number;
  charCount: number;
}