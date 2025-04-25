import { Image, ImageUploadResponse } from '../types/image';

import { backupService } from './backupService';

class ImageService {
  public readonly STORAGE_KEY = 'markdown_editor_images';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly DEFAULT_COMPRESS_OPTIONS: ImageCompressOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'webp'
  };

  constructor() {
    // 启动自动备份服务
    backupService.startAutoBackup();
  }

  // 获取所有已存储的图片
  getAllImages(): Image[] {
    const storedImages = localStorage.getItem(this.STORAGE_KEY);
    return storedImages ? JSON.parse(storedImages) : [];
  }

  // 保存图片信息到本地存储
  // 获取图片预览信息
  async getImagePreview(file: File, options?: ImageCompressOptions): Promise<{
    originalSize: number;
    compressedSize: number;
    width: number;
    height: number;
    format: string;
    previewUrl: string;
  }> {
    try {
      const compressedBlob = await this.compressImage(file, options);
      const previewUrl = URL.createObjectURL(compressedBlob);
      
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            width: img.width,
            height: img.height,
            format: compressedBlob.type.split('/')[1],
            previewUrl
          });
        };
        img.src = previewUrl;
      });
    } catch (error) {
      throw new Error('获取图片预览失败');
    }
  }

  validateImage(file: File): string | null {
    if (file.size > this.MAX_FILE_SIZE) {
      return '图片大小不能超过10MB';
    }
    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      return '不支持的图片格式';
    }
    return null;
  }

  private async compressImage(file: File, options: ImageCompressOptions = this.DEFAULT_COMPRESS_OPTIONS): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 计算缩放比例
        if (options.maxWidth && width > options.maxWidth) {
          height = (options.maxWidth / width) * height;
          width = options.maxWidth;
        }
        if (options.maxHeight && height > options.maxHeight) {
          width = (options.maxHeight / height) * width;
          height = options.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 转换格式和压缩
        const format = `image/${options.format || 'webp'}`;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          format,
          options.quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图片加载失败'));
      };

      img.src = url;
    });
  }

  async saveImage(file: File, compressOptions?: ImageCompressOptions): Promise<ImageUploadResponse> {
    const validationError = this.validateImage(file);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    try {
      // 压缩图片
      const compressedBlob = await this.compressImage(file, compressOptions);
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
        try {
          const img = new Image();
          img.src = e.target?.result as string;
          
          const newImage: Image = {
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            name: file.name,
            uploadTime: new Date(),
            size: compressedBlob.size,
            originalSize: file.size,
            width: img.width,
            height: img.height,
            format: compressedBlob.type.split('/')[1]
          };

          const images = this.getAllImages();
          // 限制存储图片数量，保留最新的100张
          if (images.length >= 100) {
            images.shift(); // 删除最旧的图片
          }
          images.push(newImage);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
          
          // 创建新的备份
          backupService.createBackup();

          resolve({
            success: true,
            imageUrl: newImage.url
          });
        } catch (error) {
          resolve({
            success: false,
            error: '图片保存失败'
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: '图片读取失败'
        });
      };

      reader.readAsDataURL(file);
    });
  }

  // 删除图片
  deleteImage(id: string): boolean {
    try {
      const images = this.getAllImages();
      const filteredImages = images.filter(img => img.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredImages));
      return true;
    } catch {
      return false;
    }
  }

  // 清理所有图片
  clearAllImages(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export const imageService = new ImageService();