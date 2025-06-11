import React, { useState } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { useThemeContext } from './theme/ThemeContext';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

// 样式导入
import './tailwind.css';

const TailwindTestAppContent: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();
  const [content, setContent] = useState(`# 测试 TailwindCSS 版本

这是一个简化的测试版本，用于验证 TailwindCSS 样式是否正常工作。

## 功能测试
- **主题切换** - 深色/浅色模式
- **动画效果** - framer-motion 动画
- **图标显示** - Heroicons 图标库
- **响应式设计** - TailwindCSS 响应式布局

## 样式测试
这里是一些基本的样式测试内容。

### 代码块
\`\`\`javascript
console.log("Hello TailwindCSS!");
\`\`\`

### 引用
> 这是一个引用块，用于测试样式。

### 列表
- 项目 1
- 项目 2
- 项目 3

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |

测试完成！`);

  const isDark = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleFormatText = (format: string) => {
    let formatText = '';
    switch (format) {
      case 'bold':
        formatText = '**粗体文本**';
        break;
      case 'italic':
        formatText = '*斜体文本*';
        break;
      case 'link':
        formatText = '[链接文本](URL)';
        break;
      default:
        return;
    }
    setContent(prev => prev + '\n' + formatText);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col h-screen">
        {/* 简化的工具栏 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            flex items-center justify-between px-6 py-4 border-b
            ${isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
            }
            transition-colors duration-300
          `}
        >
          {/* 左侧：格式化工具 */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              onClick={() => handleFormatText('bold')}
              title="粗体"
            >
              <BoldIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              onClick={() => handleFormatText('italic')}
              title="斜体"
            >
              <ItalicIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              onClick={() => handleFormatText('link')}
              title="链接"
            >
              <LinkIcon className="w-5 h-5" />
            </motion.button>
          </div>

          {/* 中间：标题 */}
          <div className="flex-1 text-center">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              TailwindCSS 测试版本
            </h1>
          </div>

          {/* 右侧：主题切换 */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              onClick={toggleTheme}
              title="切换主题"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 主内容区域 */}
        <div className="flex-1 flex">
          {/* 编辑器区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 h-full border-r border-gray-200 dark:border-gray-700"
          >
            <div className="h-full flex flex-col">
              <div className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  编辑器
                </h3>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`
                  flex-1 p-4 resize-none border-none outline-none font-mono text-sm
                  ${isDark 
                    ? 'bg-gray-900 text-gray-100' 
                    : 'bg-white text-gray-900'
                  }
                `}
                placeholder="在这里输入 Markdown 内容..."
              />
            </div>
          </motion.div>

          {/* 预览区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-1/2 h-full overflow-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          >
            <div className="h-full flex flex-col">
              <div className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  预览
                </h3>
              </div>
              <div className="flex-1 p-4">
                <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {content}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 状态栏 */}
        <div className={`px-4 py-2 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              TailwindCSS 测试版本 - 样式和动画测试
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              字符数: {content.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TailwindTestApp: React.FC = () => {
  return (
    <ThemeProvider>
      <TailwindTestAppContent />
    </ThemeProvider>
  );
};

export default TailwindTestApp;
