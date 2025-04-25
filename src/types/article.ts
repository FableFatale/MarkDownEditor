// 文章分类相关的类型定义

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  categories: string[]; // 分类ID数组
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  charCount: number;
}

export interface ArticleMetadata {
  id: string;
  title: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  charCount: number;
}