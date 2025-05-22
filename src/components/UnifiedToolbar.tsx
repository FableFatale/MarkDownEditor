import React from 'react';
import { useThemeContext } from '../theme/ThemeContext';
import { Menu, Transition } from '@headlessui/react';

// 导入Heroicons图标
import {
  SunIcon, MoonIcon, Cog6ToothIcon, ListBulletIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

// 导入Lucide图标
import {
  Bold, Italic, Link, Quote, ListOrdered, FileText,
  ImageIcon, Table, Code, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Heading1, Heading2, Heading3,
  Download, FileJson, Settings, Clock
} from 'lucide-react';

interface UnifiedToolbarProps {
  onFormatText?: (format: string) => void;
  onExport?: (format: string) => void;
  onToggleTheme?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  isDarkMode?: boolean;
  wordCount?: number;
  charCount?: number;
  readingTime?: string;
}

const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({
  onFormatText,
  onExport,
  onToggleTheme,
  onToggleFullscreen,
  isFullscreen = false,
  isDarkMode = false,
  wordCount = 0,
  charCount = 0,
  readingTime = '0分钟'
}) => {
  const { theme, toggleTheme } = useThemeContext();
  const actualDarkMode = isDarkMode !== undefined ? isDarkMode :
    (theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  // 格式化工具栏分组
  const formatToolbarGroups = [
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
    <div className="unified-toolbar">
      {/* 左侧格式化工具栏 */}
      <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
        {formatToolbarGroups.map((group, groupIndex) => (
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

      {/* 右侧功能区 */}
      <div className="flex items-center space-x-3">
        {/* 字数统计 - 移除hidden类，始终显示 */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }}>
          <span className="flex items-center">
            <FileText size={14} className="mr-1" />
            {wordCount} 词
          </span>
          <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
          <span>{charCount} 字符</span>
          <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {readingTime}
          </span>
        </div>

        {/* 导出按钮 */}
        <Menu as="div" className="relative">
          <Menu.Button className="toolbar-button flex items-center px-2 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }}>
            <Download size={16} className="mr-1 text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">导出</span>
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
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
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
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
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
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
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
                      className={`toolbar-menu-item ${active ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
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

        {/* 设置按钮 */}
        <button
          className="toolbar-button flex items-center px-2 py-1.5 rounded-md"
          style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }}
          title="设置"
        >
          <Settings size={16} className="mr-1 text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">设置</span>
        </button>

        {/* 主题切换 */}
        <button
          className="toolbar-button"
          onClick={onToggleTheme || toggleTheme}
          title={actualDarkMode ? '切换到浅色模式' : '切换到深色模式'}
        >
          {actualDarkMode ?
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
            <ArrowsPointingInIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> :
            <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          }
        </button>
      </div>
    </div>
  );
};

export default UnifiedToolbar;
