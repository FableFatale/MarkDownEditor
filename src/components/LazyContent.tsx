import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LazyContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  once?: boolean;
  height?: number | string;
}

const LazyContent: React.FC<LazyContentProps> = ({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0,
  once = true,
  height = 'auto'
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // 添加延迟加载
          setTimeout(() => {
            setIsLoaded(true);
          }, delay);

          // 如果设置了 once，则停止观察
          if (once) {
            observerRef.current?.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
          setIsLoaded(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, delay, once]);

  const defaultFallback = (
    <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg h-4 w-32"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg h-3 w-24"></div>
        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded-lg h-3 w-20"></div>
      </div>
    </div>
  );

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0.5, 
            y: isLoaded ? 0 : 20 
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="h-full"
        >
          {isLoaded ? children : (fallback || defaultFallback)}
        </motion.div>
      ) : (
        <div className="h-full">
          {fallback || defaultFallback}
        </div>
      )}
    </div>
  );
};

// 懒加载的代码块组件
export const LazyCodeBlock: React.FC<{
  code: string;
  language: string;
  className?: string;
}> = ({ code, language, className = '' }) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟代码高亮的异步加载
    const highlightCode = async () => {
      try {
        // 这里可以集成实际的代码高亮库，如 Prism.js 或 highlight.js
        await new Promise(resolve => setTimeout(resolve, 100)); // 模拟异步操作
        setHighlightedCode(code);
      } catch (error) {
        console.error('代码高亮失败:', error);
        setHighlightedCode(code);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code]);

  return (
    <LazyContent
      className={className}
      fallback={
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      }
    >
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {language}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            复制
          </button>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className={`language-${language}`}>
            {isLoading ? (
              <div className="animate-pulse space-y-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ) : (
              highlightedCode
            )}
          </code>
        </pre>
      </div>
    </LazyContent>
  );
};

// 懒加载的表格组件
export const LazyTable: React.FC<{
  data: any[];
  columns: { key: string; title: string }[];
  className?: string;
}> = ({ data, columns, className = '' }) => {
  return (
    <LazyContent
      className={className}
      fallback={
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
            <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-4 py-3 space-y-2">
                <div className="animate-pulse h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="animate-pulse h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </LazyContent>
  );
};

export default LazyContent;
