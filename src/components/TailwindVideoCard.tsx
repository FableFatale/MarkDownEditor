import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';

interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
  platform: string;
  url: string;
  duration?: string;
  views?: string;
  publishedAt?: string;
}

interface TailwindVideoCardProps {
  video: VideoInfo;
  onCopy?: (markdown: string) => void;
  onInsert?: (markdown: string) => void;
  className?: string;
  compact?: boolean;
}

const TailwindVideoCard: React.FC<TailwindVideoCardProps> = ({
  video,
  onCopy,
  onInsert,
  className = '',
  compact = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const markdown = `[${video.title}](${video.url})`;
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      onCopy?.(markdown);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleInsert = () => {
    const markdown = `[${video.title}](${video.url})`;
    onInsert?.(markdown);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'bilibili':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.12zM6.4 15.64a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96zm4.8 0a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96zm4.8 0a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'bilibili':
        return 'text-pink-500';
      case 'youtube':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}
      >
        <div className="flex-shrink-0">
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            className="w-16 h-12 rounded object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {video.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {video.author} • {video.platform}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="复制链接"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </motion.button>

          {onInsert && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInsert}
              className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
              title="插入到编辑器"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* 缩略图 */}
      <div className="relative">
        <LazyImage
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center group">
          <motion.a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </motion.a>
        </div>

        {/* 时长标签 */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* 平台图标 */}
          <div className={`flex-shrink-0 ${getPlatformColor(video.platform)}`}>
            {getPlatformIcon(video.platform)}
          </div>

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {video.title}
            </h3>

            {/* 作者和平台 */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{video.author}</span>
              <span>•</span>
              <span>{video.platform}</span>
            </div>

            {/* 额外信息 */}
            {(video.views || video.publishedAt) && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500 mb-3">
                {video.views && <span>{video.views} 次观看</span>}
                {video.views && video.publishedAt && <span>•</span>}
                {video.publishedAt && <span>{video.publishedAt}</span>}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>复制链接</span>
                  </>
                )}
              </motion.button>

              {onInsert && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInsert}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>插入</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TailwindVideoCard;
