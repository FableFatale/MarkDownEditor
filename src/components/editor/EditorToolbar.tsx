import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  LinkIcon,
  ImageIcon,
  CodeIcon,
  QuoteIcon,
} from '@heroicons/react/24/outline';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  shortcut?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  title,
  onClick,
  shortcut,
}) => (
  <button
    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    onClick={onClick}
    title={`${title}${shortcut ? ` (${shortcut})` : ''}`}
  >
    <div className="w-5 h-5">{icon}</div>
  </button>
);

interface EditorToolbarProps {
  onAction: (type: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAction }) => {
  const { theme } = useTheme();

  const tools = [
    {
      icon: <BoldIcon />,
      title: '加粗',
      action: 'bold',
      shortcut: 'Ctrl+B',
    },
    {
      icon: <ItalicIcon />,
      title: '斜体',
      action: 'italic',
      shortcut: 'Ctrl+I',
    },
    {
      icon: <ListIcon />,
      title: '无序列表',
      action: 'bullet-list',
      shortcut: 'Ctrl+Alt+U',
    },
    {
      icon: <LinkIcon />,
      title: '链接',
      action: 'link',
      shortcut: 'Ctrl+K',
    },
    {
      icon: <ImageIcon />,
      title: '图片',
      action: 'image',
      shortcut: 'Ctrl+Alt+I',
    },
    {
      icon: <CodeIcon />,
      title: '代码块',
      action: 'code-block',
      shortcut: 'Ctrl+Alt+E',
    },
    {
      icon: <QuoteIcon />,
      title: '引用',
      action: 'quote',
      shortcut: 'Ctrl+Alt+Q',
    },
  ];

  return (
    <div
      className={`flex items-center space-x-1 p-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
    >
      {tools.map((tool) => (
        <ToolbarButton
          key={tool.action}
          icon={tool.icon}
          title={tool.title}
          shortcut={tool.shortcut}
          onClick={() => onAction(tool.action)}
        />
      ))}
    </div>
  );
};

export default EditorToolbar;