import React from 'react';
import {
  Bold, Italic, Link, Quote, ListOrdered,
  ImageIcon, Table, Code, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Heading1, Heading2, Heading3
} from 'lucide-react';
import {
  ListBulletIcon,
  SunIcon, MoonIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import { useThemeContext } from '../theme/ThemeContext';

interface EditorFormatToolbarProps {
  onFormatText?: (format: string) => void;
  isDarkMode?: boolean;
  isFullscreen?: boolean;
  onToggleTheme?: () => void;
  onToggleFullscreen?: () => void;
}

const EditorFormatToolbar: React.FC<EditorFormatToolbarProps> = ({
  onFormatText,
  isDarkMode,
  isFullscreen,
  onToggleTheme,
  onToggleFullscreen
}) => {
  const { theme, toggleTheme } = useThemeContext();
  const actualDarkMode = isDarkMode !== undefined ? isDarkMode :
    (theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  // 工具栏分组
  const toolbarGroups = [
    {
      title: '文本格式',
      items: [
        { icon: <Bold size={18} />, tooltip: '粗体 (Ctrl+B)', format: 'bold' },
        { icon: <Italic size={18} />, tooltip: '斜体 (Ctrl+I)', format: 'italic' },
        { icon: <Quote size={18} />, tooltip: '引用 (Ctrl+Alt+Q)', format: 'quote' },
      ]
    },
    {
      title: '标题',
      items: [
        { icon: <Heading1 size={18} />, tooltip: '一级标题', format: 'heading-1' },
        { icon: <Heading2 size={18} />, tooltip: '二级标题', format: 'heading-2' },
        { icon: <Heading3 size={18} />, tooltip: '三级标题', format: 'heading-3' },
      ]
    },
    {
      title: '列表',
      items: [
        { icon: <ListBulletIcon className="w-5 h-5" />, tooltip: '无序列表 (Ctrl+Alt+U)', format: 'bullet-list' },
        { icon: <ListOrdered size={18} />, tooltip: '有序列表 (Ctrl+Alt+O)', format: 'number-list' },
      ]
    },
    {
      title: '插入元素',
      items: [
        { icon: <Code size={18} />, tooltip: '代码块 (Ctrl+Alt+E)', format: 'code' },
        { icon: <ImageIcon size={18} />, tooltip: '图片 (Ctrl+Alt+I)', format: 'image' },
        { icon: <Table size={18} />, tooltip: '表格 (Ctrl+Alt+T)', format: 'table' },
        { icon: <Link size={18} />, tooltip: '链接 (Ctrl+K)', format: 'link' },
      ]
    },
    {
      title: '对齐方式',
      items: [
        { icon: <AlignLeft size={18} />, tooltip: '左对齐', format: 'align-left' },
        { icon: <AlignCenter size={18} />, tooltip: '居中对齐', format: 'align-center' },
        { icon: <AlignRight size={18} />, tooltip: '右对齐', format: 'align-right' },
        { icon: <AlignJustify size={18} />, tooltip: '两端对齐', format: 'align-justify' },
      ]
    }
  ];

  return (
    <div className="editor-format-toolbar flex items-center justify-between bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-md p-1 shadow-sm">
      {/* 左侧工具栏按钮组 */}
      <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
        {toolbarGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className="toolbar-divider mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700"></div>}
            <div className="flex items-center space-x-0.5">
              {group.items.map((button, itemIndex) => (
                <button
                  key={itemIndex}
                  className="toolbar-button"
                  title={button.tooltip}
                  onClick={() => onFormatText && onFormatText(button.format)}
                >
                  <span className="text-gray-700 dark:text-gray-300">{button.icon}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* 右侧工具栏按钮 */}
      <div className="flex items-center space-x-1">
        {/* 主题切换按钮 */}
        <button
          className="toolbar-button"
          title={actualDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          onClick={onToggleTheme || toggleTheme}
        >
          {actualDarkMode ?
            <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> :
            <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          }
        </button>

        {/* 全屏切换按钮 */}
        <button
          className="toolbar-button"
          title={isFullscreen ? '退出全屏' : '进入全屏'}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ?
            <ArrowsPointingInIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> :
            <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          }
        </button>
      </div>
    </div>
  );
};

export default EditorFormatToolbar;
