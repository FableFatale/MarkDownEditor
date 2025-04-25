export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface Image {
  id: string;
  url: string;
  name: string;
  uploadTime: Date;
  size: number;
  originalSize?: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}