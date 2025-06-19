import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  fallback,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(img);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const getPlaceholderSrc = () => {
    if (placeholder) return placeholder;
    
    // 生成一个简单的占位符 SVG
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          加载中...
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getFallbackSrc = () => {
    if (fallback) return fallback;
    
    // 生成一个错误占位符 SVG
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fef2f2"/>
        <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="#ef4444" font-family="Arial, sans-serif" font-size="14">
          图片加载失败
        </text>
        <text x="50%" y="55%" text-anchor="middle" dy=".3em" fill="#ef4444" font-family="Arial, sans-serif" font-size="12">
          点击重试
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setIsInView(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        ref={imgRef}
        src={
          hasError 
            ? getFallbackSrc()
            : isInView 
              ? src 
              : getPlaceholderSrc()
        }
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        onClick={hasError ? handleRetry : undefined}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasError ? 'cursor-pointer' : ''
        } ${isLoaded && !hasError ? 'opacity-100' : 'opacity-70'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded && !hasError ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      />

      {/* 加载指示器 */}
      {isInView && !isLoaded && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">加载中...</span>
          </div>
        </motion.div>
      )}

      {/* 错误状态覆盖层 */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 cursor-pointer"
          onClick={handleRetry}
        >
          <div className="flex flex-col items-center space-y-2 text-red-600 dark:text-red-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">加载失败</span>
            <span className="text-xs">点击重试</span>
          </div>
        </motion.div>
      )}

      {/* 成功加载的指示器 */}
      {isLoaded && !hasError && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default LazyImage;
