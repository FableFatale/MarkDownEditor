import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useThemeContext } from '../theme/ThemeContext';

// 导入Heroicons图标
import { 
  SunIcon, MoonIcon, ArrowDownTrayIcon, DocumentTextIcon, 
  PhotoIcon, TableCellsIcon, CodeBracketIcon, ListBulletIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, Bars3Icon
} from '@heroicons/react/24/outline';

// 导入Lucide图标
import { 
  Bold, Italic, Link, Quote, List, ListOrdered, 
  ImageIcon, FileText, Download, FileJson, Maximize2, Minimize2
} from 'lucide-react';

interface ModernToolbarProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onFormatText?: (format: string) => void;
  onExport?: (format: string) => void;
}

const ModernToolbar: React.FC<ModernToolbarProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
  onFormatText,
  onExport
}) => {
  const { theme, toggleTheme } = useThemeContext();
  const isDarkMode = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 工具栏分组
  const toolbarGroups = [
    {
      title: '文本格式',
      items: [
        { icon: <Bold size={18} />, tooltip: '粗体 (Ctrl+B)', format: 'bold' },
        { icon: <Italic size={18} />, tooltip: '斜体 (Ctrl+I)', format: 'italic' },
        { icon: <Link size={18} />, tooltip: '链接 (Ctrl+K)', format: 'link' },
        { icon: <Quote size={18} />, tooltip: '引用 (Ctrl+Alt+Q)', format: 'quote' },
      ],
    },
    {
      title: '插入元素',
      items: [
        { icon: <CodeBracketIcon className="w-5 h-5" />, tooltip: '代码块 (Ctrl+Alt+E)', format: 'code' },
        { icon: <ImageIcon size={18} />, tooltip: '图片 (Ctrl+Alt+I)', format: 'image' },
        { icon: <TableCellsIcon className="w-5 h-5" />, tooltip: '表格 (Ctrl+Alt+T)', format: 'table' },
      ],
    },
    {
      title: '列表',
      items: [
        { icon: <ListBulletIcon className="w-5 h-5" />, tooltip: '无序列表 (Ctrl+Alt+U)', format: 'bullet-list' },
        { icon: <ListOrdered size={18} />, tooltip: '有序列表 (Ctrl+Alt+O)', format: 'number-list' },
      ],
    },
  ];

  return (
    <div className="toolbar">
      {/* 左侧工具栏 */}
      <div className="flex items-center space-x-3 overflow-x-auto hide-scrollbar">
        <button className="toolbar-button hidden md:flex">
          <Bars3Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        
        {/* 工具栏分组 */}
        {toolbarGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <div className="toolbar-divider" />
            <div className="toolbar-group">
              {group.items.map((item, itemIndex) => (
                <button 
                  key={itemIndex}
                  className="toolbar-button" 
                  title={item.tooltip}
                  onClick={() => onFormatText && onFormatText(item.format)}
                >
                  <span className="text-gray-700 dark:text-gray-300">{item.icon}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* 右侧工具栏 */}
      <div className="flex items-center space-x-3">
        <div className="toolbar-divider" />

        {/* 导出按钮 */}
        <Menu as="div" className="relative">
          <Menu.Button className="toolbar-button">
            <Download size={18} className="text-gray-700 dark:text-gray-300" />
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="toolbar-menu">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-dark-600' : ''}`}
                      onClick={() => onExport && onExport('pdf')}
                    >
                      <FileText className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      导出为PDF
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-dark-600' : ''}`}
                      onClick={() => onExport && onExport('html')}
                    >
                      <FileText className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      导出为HTML
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-dark-600' : ''}`}
                      onClick={() => onExport && onExport('markdown')}
                    >
                      <FileJson className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      导出为Markdown
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-dark-600' : ''}`}
                      onClick={() => onExport && onExport('wechat')}
                    >
                      <svg className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.5,13.5A1.5,1.5 0 0,1 7,12A1.5,1.5 0 0,1 8.5,10.5A1.5,1.5 0 0,1 10,12A1.5,1.5 0 0,1 8.5,13.5M15.5,13.5A1.5,1.5 0 0,1 14,12A1.5,1.5 0 0,1 15.5,10.5A1.5,1.5 0 0,1 17,12A1.5,1.5 0 0,1 15.5,13.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                      </svg>
                      导出为微信公众号
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* 主题切换 */}
        <button 
          className="toolbar-button" 
          onClick={toggleTheme}
          title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDarkMode ? 
            <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : 
            <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          }
        </button>

        {/* 全屏切换 */}
        <button 
          className="toolbar-button" 
          onClick={onToggleFullscreen}
          title={isFullscreen ? '退出全屏' : '进入全屏'}
        >
          {isFullscreen ? 
            <Minimize2 size={18} className="text-gray-700 dark:text-gray-300" /> : 
            <Maximize2 size={18} className="text-gray-700 dark:text-gray-300" />
          }
        </button>
      </div>
    </div>
  );
};

// 添加自定义样式
const styles = `
  @layer components {
    .toolbar {
      @apply flex justify-between items-center px-4 py-2 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-dark-600/50 sticky top-0 z-50;
    }

    .toolbar-button {
      @apply p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-dark-600/80 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-105 active:scale-95 relative;
      &::before {
        content: '';
        @apply absolute inset-0 rounded-lg bg-current opacity-0 transition-opacity duration-200;
      }
      &:hover::before {
        @apply opacity-5;
      }
    }
    
    .toolbar-divider {
      @apply w-px h-6 bg-gray-200/60 dark:bg-dark-600/60 mx-2;
    }

    .toolbar-group {
      @apply flex items-center space-x-1 relative;
      &::after {
        content: '';
        @apply absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500/0 transition-all duration-200;
      }
      &:hover::after {
        @apply bg-primary-500/10;
      }
    }

    .toolbar-menu {
      @apply absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-dark-800 ring-1 ring-black/5 dark:ring-white/10 shadow-lg transform opacity-0 scale-95;
    }

    .toolbar-menu-item {
      @apply flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-dark-600/80 transition-colors duration-200;
      &:first-child {
        @apply rounded-t-xl;
      }
      &:last-child {
        @apply rounded-b-xl;
      }
    }
    
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;

export default ModernToolbar;