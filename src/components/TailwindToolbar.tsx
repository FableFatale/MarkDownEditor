import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  ListBulletIcon,
  CodeBracketIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckIcon,
  SparklesIcon,
  BookOpenIcon,
  ChartBarIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

interface TailwindToolbarProps {
  content: string;
  isDark: boolean;
  isFullScreen: boolean;
  onToggleTheme: () => void;
  onToggleFullScreen: () => void;
  onShowSettings: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
  onFormatText: (format: string, options?: any) => void;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onManualSave: () => void;
  onShowVersionHistory: () => void;
  onToggleOutline: () => void;
  onShowSpellChecker: () => void;
  onShowSEOAnalyzer: () => void;
  onShowImageCompressor: () => void;
}

const TailwindToolbar: React.FC<TailwindToolbarProps> = ({
  content,
  isDark,
  isFullScreen,
  onToggleTheme,
  onToggleFullScreen,
  onShowSettings,
  previewRef,
  onFormatText,
  saveState,
  onManualSave,
  onShowVersionHistory,
  onToggleOutline,
  onShowSpellChecker,
  onShowSEOAnalyzer,
  onShowImageCompressor,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const buttonClass = `
    relative p-2 rounded-lg transition-all duration-300 group overflow-hidden
    ${isDark
      ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
    }
    hover:scale-105 active:scale-95 hover:shadow-lg
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/0 before:via-purple-500/10 before:to-blue-500/0
    before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
  `;

  const formatButtons = [
    { icon: BoldIcon, action: 'bold', tooltip: '粗体 (Ctrl+B)' },
    { icon: ItalicIcon, action: 'italic', tooltip: '斜体 (Ctrl+I)' },
    { icon: LinkIcon, action: 'link', tooltip: '链接 (Ctrl+K)' },
    { icon: PhotoIcon, action: 'image', tooltip: '图片 (Ctrl+Alt+I)' },
    { icon: TableCellsIcon, action: 'table', tooltip: '表格 (Ctrl+Alt+T)' },
    { icon: ListBulletIcon, action: 'bullet-list', tooltip: '无序列表 (Ctrl+Alt+U)' },
    { icon: CodeBracketIcon, action: 'code', tooltip: '代码块 (Ctrl+Alt+E)' },
    { icon: ChatBubbleLeftIcon, action: 'quote', tooltip: '引用 (Ctrl+Alt+Q)' },
  ];

  const handleExport = (format: string) => {
    setShowExportMenu(false);
    // 这里可以调用导出功能
    console.log(`Export to: ${format}`);
  };

  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />

      <div className={`
        relative flex items-center justify-between px-6 py-4
        transition-all duration-300
      `}>
        {/* 左侧：格式化工具 */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-1"
        >
          {formatButtons.map(({ icon: Icon, action, tooltip }, index) => (
            <motion.button
              key={action}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={buttonClass}
              onClick={() => onFormatText(action)}
              title={tooltip}
            >
              <Icon className="w-5 h-5 relative z-10" />
            </motion.button>
          ))}

          {/* 分隔线 */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.3 }}
            className={`w-px h-6 mx-3 bg-gradient-to-b ${isDark ? 'from-gray-600 to-gray-700' : 'from-gray-300 to-gray-400'}`}
          />

          {/* 标题快捷按钮 */}
          {[1, 2, 3].map((level, index) => (
            <motion.button
              key={`h${level}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 group overflow-hidden
                ${isDark
                  ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                }
                hover:shadow-lg
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/0 before:via-purple-500/20 before:to-blue-500/0
                before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
              `}
              onClick={() => onFormatText(`heading-${level}`)}
              title={`H${level} 标题 (Ctrl+${level})`}
            >
              <span className="relative z-10">H{level}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* 中间：标题 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 text-center"
        >
          <motion.h1
            className={`text-xl font-bold bg-gradient-to-r ${
              isDark
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            } bg-clip-text text-transparent`}
            whileHover={{ scale: 1.05 }}
          >
            Markdown 编辑器
          </motion.h1>
          <motion.div
            className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-1 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* 右侧：功能按钮 */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-1"
        >
          {/* 拼写检查 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onShowSpellChecker}
            title="拼写检查"
          >
            <SparklesIcon className="w-5 h-5 relative z-10" />
          </motion.button>

          {/* SEO分析 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onShowSEOAnalyzer}
            title="SEO分析"
          >
            <ChartBarIcon className="w-5 h-5 relative z-10" />
          </motion.button>

          {/* 图片压缩 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onShowImageCompressor}
            title="图片压缩"
          >
            <CubeTransparentIcon className="w-5 h-5 relative z-10" />
          </motion.button>

          {/* 大纲 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onToggleOutline}
            title="大纲导航"
          >
            <BookOpenIcon className="w-5 h-5 relative z-10" />
          </motion.button>

          {/* 版本历史 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.75 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onShowVersionHistory}
            title="版本历史"
          >
            <ClockIcon className="w-5 h-5 relative z-10" />
          </motion.button>

          {/* 手动保存 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              ${buttonClass}
              ${saveState === 'saving' ? 'animate-pulse' : ''}
              ${saveState === 'saved' ? 'text-green-500' : ''}
              ${saveState === 'error' ? 'text-red-500' : ''}
            `}
            onClick={onManualSave}
            title="手动保存 (Ctrl+S)"
          >
            {saveState === 'saved' ? (
              <CheckIcon className="w-5 h-5 relative z-10" />
            ) : (
              <DocumentTextIcon className="w-5 h-5 relative z-10" />
            )}
          </motion.button>

          {/* 导出菜单 */}
          <div className="relative">
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={buttonClass}
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="导出"
            >
              <DocumentArrowDownIcon className="w-5 h-5 relative z-10" />
            </motion.button>

          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`
                absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50
                ${isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
                }
              `}
            >
              <div className="py-2">
                {[
                  { label: '导出为 PDF', value: 'pdf' },
                  { label: '导出为 HTML', value: 'html' },
                  { label: '导出为 Markdown', value: 'markdown' },
                  { label: '导出为图片', value: 'image' },
                  { label: '微信公众号', value: 'wechat' },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={`
                      w-full text-left px-4 py-2 text-sm transition-colors
                      ${isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => handleExport(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          </div>

          {/* 分隔线 */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.9 }}
            className={`w-px h-6 mx-3 bg-gradient-to-b ${isDark ? 'from-gray-600 to-gray-700' : 'from-gray-300 to-gray-400'}`}
          />

          {/* 主题切换 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.95 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onToggleTheme}
            title="切换主题"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5 relative z-10" />
            ) : (
              <MoonIcon className="w-5 h-5 relative z-10" />
            )}
          </motion.button>

          {/* 全屏切换 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onToggleFullScreen}
            title="全屏模式"
          >
            {isFullScreen ? (
              <ArrowsPointingInIcon className="w-5 h-5 relative z-10" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5 relative z-10" />
            )}
          </motion.button>

          {/* 设置 */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClass}
            onClick={onShowSettings}
            title="设置"
          >
            <Cog6ToothIcon className="w-5 h-5 relative z-10" />
          </motion.button>
        </motion.div>

        {/* 点击外部关闭导出菜单 */}
        {showExportMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowExportMenu(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TailwindToolbar;
