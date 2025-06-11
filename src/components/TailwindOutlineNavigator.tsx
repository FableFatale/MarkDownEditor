import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  line: number;
}

interface TailwindOutlineNavigatorProps {
  content: string;
  onHeadingClick: (line: number) => void;
  onClose: () => void;
  className?: string;
}

const TailwindOutlineNavigator: React.FC<TailwindOutlineNavigatorProps> = ({
  content,
  onHeadingClick,
  onClose,
  className = '',
}) => {
  // 解析标题
  const headings = useMemo(() => {
    const lines = content.split('\n');
    const headingRegex = /^(#{1,6})\s+(.+)$/;
    const headings: HeadingItem[] = [];

    lines.forEach((line, index) => {
      const match = line.match(headingRegex);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        headings.push({
          id: `heading-${index}`,
          text,
          level,
          line: index + 1,
        });
      }
    });

    return headings;
  }, [content]);

  const getIndentClass = (level: number) => {
    const indents = {
      1: 'ml-0',
      2: 'ml-4',
      3: 'ml-8',
      4: 'ml-12',
      5: 'ml-16',
      6: 'ml-20',
    };
    return indents[level as keyof typeof indents] || 'ml-0';
  };

  const getFontSizeClass = (level: number) => {
    const sizes = {
      1: 'text-base font-bold',
      2: 'text-sm font-semibold',
      3: 'text-sm font-medium',
      4: 'text-xs font-medium',
      5: 'text-xs',
      6: 'text-xs',
    };
    return sizes[level as keyof typeof sizes] || 'text-xs';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            文档大纲
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 内容 */}
      <div className="max-h-96 overflow-y-auto">
        {headings.length > 0 ? (
          <div className="p-2">
            {headings.map((heading, index) => (
              <motion.button
                key={heading.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onHeadingClick(heading.line)}
                className={`
                  w-full text-left p-2 rounded-lg transition-all duration-200
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  ${getIndentClass(heading.level)}
                `}
              >
                <div className="flex items-center space-x-2">
                  {/* 级别指示器 */}
                  <div
                    className={`
                      w-2 h-2 rounded-full
                      ${heading.level === 1 ? 'bg-red-500' :
                        heading.level === 2 ? 'bg-orange-500' :
                        heading.level === 3 ? 'bg-yellow-500' :
                        heading.level === 4 ? 'bg-green-500' :
                        heading.level === 5 ? 'bg-blue-500' :
                        'bg-purple-500'
                      }
                    `}
                  />
                  
                  {/* 标题文本 */}
                  <span
                    className={`
                      ${getFontSizeClass(heading.level)}
                      text-gray-900 dark:text-gray-100
                      truncate
                    `}
                    title={heading.text}
                  >
                    {heading.text}
                  </span>
                  
                  {/* 行号 */}
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {heading.line}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <BookOpenIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              文档中没有找到标题
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              使用 # 开头创建标题
            </p>
          </div>
        )}
      </div>

      {/* 底部统计 */}
      {headings.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>共 {headings.length} 个标题</span>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6].map((level) => {
                const count = headings.filter(h => h.level === level).length;
                if (count === 0) return null;
                return (
                  <span key={level} className="flex items-center space-x-1">
                    <span className="text-xs">H{level}:</span>
                    <span className="font-medium">{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TailwindOutlineNavigator;
