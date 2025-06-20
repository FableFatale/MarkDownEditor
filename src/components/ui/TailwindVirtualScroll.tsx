import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  threshold?: number;
}

const TailwindVirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onLoadMore,
  hasMore = false,
  loading = false,
  threshold = 100
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const currentScrollTop = target.scrollTop;
    setScrollTop(currentScrollTop);

    // 检查是否需要加载更多内容（向下滚动时）
    if (
      onLoadMore &&
      hasMore &&
      !loading &&
      !loadingRef.current &&
      currentScrollTop > lastScrollTop.current && // 向下滚动
      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold
    ) {
      loadingRef.current = true;
      onLoadMore();
    }

    lastScrollTop.current = currentScrollTop;
  }, [onLoadMore, hasMore, loading, threshold]);

  useEffect(() => {
    if (!loading) {
      loadingRef.current = false;
    }
  }, [loading]);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const visibleStartIndex = Math.max(0, startIndex - overscan);
    const visibleEndIndex = Math.min(items.length - 1, endIndex + overscan);

    return {
      visibleItems: items.slice(visibleStartIndex, visibleEndIndex + 1).map((item, index) => ({
        item,
        index: visibleStartIndex + index
      })),
      totalHeight: items.length * itemHeight + (hasMore ? 60 : 0), // 为加载指示器预留空间
      offsetY: visibleStartIndex * itemHeight
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan, hasMore]);

  // 平滑滚动到指定位置
  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (scrollElementRef.current) {
      const targetScrollTop = index * itemHeight;
      scrollElementRef.current.scrollTo({
        top: targetScrollTop,
        behavior
      });
    }
  }, [itemHeight]);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1);
  }, [scrollToIndex, items.length]);

  return (
    <div className="relative">
      <div
        ref={scrollElementRef}
        className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${className}`}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map(({ item, index }) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ height: itemHeight }}
                className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
            
            {/* 加载更多指示器 */}
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transform: `translateY(${items.length * itemHeight}px)`
                }}
                className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm font-medium">加载中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>滚动加载更多</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 滚动控制按钮 */}
      {items.length > 10 && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="回到顶部"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="滚动到底部"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* 滚动进度指示器 */}
      {items.length > 0 && (
        <div className="absolute top-0 right-0 w-1 h-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="bg-blue-500 w-full rounded-full"
            style={{
              height: `${Math.min(100, (containerHeight / totalHeight) * 100)}%`,
              transform: `translateY(${(scrollTop / (totalHeight - containerHeight)) * (containerHeight - (containerHeight / totalHeight) * containerHeight)}px)`
            }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        </div>
      )}
    </div>
  );
};

export default TailwindVirtualScroll;
