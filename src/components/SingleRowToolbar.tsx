import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useThemeContext } from '../theme/ThemeContext';

// 导入图标
import {
  Bold, Italic, Link, Quote, ListOrdered, List,
  ImageIcon, Table, Code, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Heading1, Heading2, Heading3,
  FileText, Download, FileJson, Maximize2, Minimize2,
  Settings, Sun, Moon, MoreHorizontal
} from 'lucide-react';

interface SingleRowToolbarProps {
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

const SingleRowToolbar: React.FC<SingleRowToolbarProps> = ({
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 主要格式化工具
  const primaryTools = [
    { icon: <Bold size={16} />, tooltip: '粗体 (Ctrl+B)', format: 'bold' },
    { icon: <Italic size={16} />, tooltip: '斜体 (Ctrl+I)', format: 'italic' },
    { icon: <Quote size={16} />, tooltip: '引用', format: 'quote' },
    { icon: <Code size={16} />, tooltip: '代码', format: 'code' },
    { icon: <Link size={16} />, tooltip: '链接', format: 'link' },
    { icon: <ImageIcon size={16} />, tooltip: '图片', format: 'image' },
    { icon: <List size={16} />, tooltip: '无序列表', format: 'bullet-list' },
    { icon: <ListOrdered size={16} />, tooltip: '有序列表', format: 'number-list' },
    { icon: <Table size={16} />, tooltip: '表格', format: 'table' },
  ];

  // 标题工具
  const headingTools = [
    { icon: <Heading1 size={16} />, tooltip: 'H1', format: 'heading-1' },
    { icon: <Heading2 size={16} />, tooltip: 'H2', format: 'heading-2' },
    { icon: <Heading3 size={16} />, tooltip: 'H3', format: 'heading-3' },
  ];

  // 导出选项
  const exportOptions = [
    { icon: <FileText size={16} />, label: '导出为 Markdown', format: 'markdown' },
    { icon: <FileText size={16} />, label: '导出为 HTML', format: 'html' },
    { icon: <FileText size={16} />, label: '导出为 PDF', format: 'pdf' },
    { icon: <FileJson size={16} />, label: '导出为 JSON', format: 'json' },
  ];

  return (
    <div className="single-row-toolbar toolbar-slide-in">
      {/* 左侧：格式化工具 */}
      <div className="toolbar-group">
        {/* 主要工具 */}
        <div className="flex items-center space-x-0.5">
          {primaryTools.map((tool, index) => (
            <button
              key={index}
              className="toolbar-btn"
              title={tool.tooltip}
              onClick={() => onFormatText && onFormatText(tool.format)}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="toolbar-divider" />

        {/* 标题工具 */}
        <div className="flex items-center space-x-0.5">
          {headingTools.map((tool, index) => (
            <button
              key={index}
              className="toolbar-btn"
              title={tool.tooltip}
              onClick={() => onFormatText && onFormatText(tool.format)}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>

      {/* 中间：字数统计 */}
      <div className="word-count-area">
        <div className="word-count-item">{wordCount} 字</div>
        <div className="word-count-item">{charCount} 字符</div>
        <div className="word-count-item">阅读 {readingTime}</div>
      </div>

      {/* 右侧：功能按钮 */}
      <div className="function-buttons">
        {/* 导出菜单 */}
        <Menu as="div" className="relative">
          <Menu.Button className="toolbar-btn">
            <Download size={16} />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="export-menu">
              <div className="py-1">
                {exportOptions.map((option, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        className={`export-menu-item ${
                          active ? 'bg-gray-50 dark:bg-gray-600' : ''
                        }`}
                        onClick={() => onExport && onExport(option.format)}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* 分隔线 */}
        <div className="toolbar-divider" />

        {/* 主题切换 */}
        <button
          className="toolbar-btn"
          onClick={onToggleTheme || toggleTheme}
          title="切换主题"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* 全屏切换 */}
        <button
          className="toolbar-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? '退出全屏' : '全屏模式'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* 设置按钮 */}
        <button
          className="toolbar-btn"
          title="设置"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default SingleRowToolbar;
