import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AnimatedImageRendererProps {
  src: string;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

interface ImageInfo {
  isAnimated: boolean;
  format: 'webp' | 'apng' | 'gif' | 'static' | 'unknown';
  width?: number;
  height?: number;
  fileSize?: number;
}

const AnimatedImageRenderer: React.FC<AnimatedImageRendererProps> = ({
  src,
  alt = '',
  className = '',
  autoPlay = true,
  showControls = true,
  maxWidth = '100%',
  maxHeight = '500px',
}) => {
  const [imageInfo, setImageInfo] = useState<ImageInfo>({
    isAnimated: false,
    format: 'unknown',
  });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 检测图片格式和动画信息
  const detectImageInfo = async (url: string): Promise<ImageInfo> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');
      
      let format: ImageInfo['format'] = 'unknown';
      let isAnimated = false;

      if (contentType.includes('webp')) {
        format = 'webp';
        // WebP 可能是动画的，需要进一步检测
        isAnimated = await checkWebPAnimation(url);
      } else if (contentType.includes('png')) {
        format = 'apng';
        // APNG 检测
        isAnimated = await checkAPNGAnimation(url);
      } else if (contentType.includes('gif')) {
        format = 'gif';
        isAnimated = true; // GIF 通常是动画的
      } else {
        format = 'static';
        isAnimated = false;
      }

      return {
        isAnimated,
        format,
        fileSize: contentLength ? parseInt(contentLength) : undefined,
      };
    } catch (error) {
      console.error('Error detecting image info:', error);
      return { isAnimated: false, format: 'unknown' };
    }
  };

  // 检测 WebP 是否为动画
  const checkWebPAnimation = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // 查找 ANIM chunk，表示动画 WebP
      for (let i = 0; i < bytes.length - 4; i++) {
        if (bytes[i] === 0x41 && bytes[i + 1] === 0x4E && 
            bytes[i + 2] === 0x49 && bytes[i + 3] === 0x4D) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  // 检测 APNG 动画
  const checkAPNGAnimation = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // 查找 acTL chunk，表示动画 PNG
      for (let i = 0; i < bytes.length - 4; i++) {
        if (bytes[i] === 0x61 && bytes[i + 1] === 0x63 && 
            bytes[i + 2] === 0x54 && bytes[i + 3] === 0x4C) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  // 控制动画播放/暂停
  const togglePlayback = () => {
    if (!imageInfo.isAnimated) return;

    const img = imgRef.current;
    if (!img) return;

    if (isPlaying) {
      // 暂停动画 - 对于某些格式，我们可能需要特殊处理
      setIsPlaying(false);
      if (imageInfo.format === 'gif') {
        // GIF 暂停需要特殊处理
        pauseGifAnimation();
      }
    } else {
      // 恢复动画
      setIsPlaying(true);
      if (imageInfo.format === 'gif') {
        resumeGifAnimation();
      }
    }
  };

  // GIF 动画控制（使用 canvas 实现）
  const pauseGifAnimation = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    // 隐藏原图，显示 canvas
    img.style.display = 'none';
    canvas.style.display = 'block';
  };

  const resumeGifAnimation = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    // 重新加载图片以恢复动画
    const currentSrc = img.src;
    img.src = '';
    img.src = currentSrc;
    
    // 显示原图，隐藏 canvas
    img.style.display = 'block';
    canvas.style.display = 'none';
  };

  // 重新开始动画
  const restartAnimation = () => {
    const img = imgRef.current;
    if (!img || !imageInfo.isAnimated) return;

    const currentSrc = img.src;
    img.src = '';
    setTimeout(() => {
      img.src = currentSrc;
      setIsPlaying(true);
    }, 50);
  };

  // 处理图片加载
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    const img = imgRef.current;
    if (img) {
      setImageInfo(prev => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    }
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 格式化文件大小
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 初始化检测图片信息
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      detectImageInfo(src).then(setImageInfo);
    }
  }, [src]);

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          flex flex-col items-center justify-center p-8 border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg
          bg-red-50 dark:bg-red-900/20 ${className}
        `}
        style={{ maxWidth, maxHeight }}
      >
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-700 dark:text-red-400 text-center">
          图片加载失败
        </p>
        <p className="text-red-600 dark:text-red-500 text-sm mt-1">
          {src}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group ${className}`}
      style={{ maxWidth }}
    >
      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        </div>
      )}

      {/* 主图片 */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        style={{ maxHeight }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Canvas 用于 GIF 暂停 */}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hidden"
        style={{ maxHeight }}
      />

      {/* 动画控制器 */}
      {imageInfo.isAnimated && showControls && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-2 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={togglePlayback}
            className="text-white hover:text-blue-400 transition-colors"
            title={isPlaying ? '暂停动画' : '播放动画'}
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={restartAnimation}
            className="text-white hover:text-green-400 transition-colors"
            title="重新开始"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>

          <div className="text-white text-xs">
            {imageInfo.format.toUpperCase()}
          </div>
        </motion.div>
      )}

      {/* 图片信息 */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center space-x-2 text-white text-xs">
            <PhotoIcon className="w-3 h-3" />
            <span>
              {imageInfo.width}×{imageInfo.height}
            </span>
            {imageInfo.fileSize && (
              <span>{formatFileSize(imageInfo.fileSize)}</span>
            )}
            {imageInfo.isAnimated && (
              <span className="text-green-400">动画</span>
            )}
          </div>
        </motion.div>
      )}

      {/* 图片说明 */}
      {alt && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
          {alt}
        </p>
      )}
    </motion.div>
  );
};

export default AnimatedImageRenderer;
