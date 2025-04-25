import React, { useState, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import { LargeFileEditor } from './LargeFileEditor';
import { EditorToolbar } from './EditorToolbar';
import { AnimatedTransition } from './AnimatedTransition';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  isDarkMode,
  onToggleTheme,
}) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFormatText = useCallback((format: string) => {
    // 实现文本格式化逻辑
    const formatActions: { [key: string]: () => void } = {
      bold: () => onChange(content + '**粗体文本**'),
      italic: () => onChange(content + '*斜体文本*'),
      quote: () => onChange(content + '> 引用文本'),
      code: () => onChange(content + '```\n代码块\n```'),
      link: () => onChange(content + '[链接文本](url)'),
      image: () => onChange(content + '![图片描述](图片url)'),
      table: () => onChange(content + '| 列1 | 列2 |\n| --- | --- |\n| 内容1 | 内容2 |'),
      'bullet-list': () => onChange(content + '- 列表项'),
      'number-list': () => onChange(content + '1. 列表项'),
    };

    if (formatActions[format]) {
      formatActions[format]();
    }
  }, [content, onChange]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  return (
    <AnimatedTransition type="fade">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(['background-color']),
        }}
      >
        <EditorToolbar
          isDarkMode={isDarkMode}
          isFullscreen={isFullscreen}
          onToggleTheme={onToggleTheme}
          onToggleFullscreen={toggleFullscreen}
          onFormatText={handleFormatText}
        />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            padding: 2,
            transition: theme.transitions.create(['padding']),
          }}
        >
          <LargeFileEditor
            content={content}
            onChange={onChange}
            theme={isDarkMode ? 'dark' : 'light'}
          />
        </Box>
      </Box>
    </AnimatedTransition>
  );
};