import React, { useState, useCallback, useEffect } from 'react';
import { Box, useTheme, CircularProgress, Typography, Chip } from '@mui/material';
import { LargeFileEditor } from './LargeFileEditor';
import { AnimatedTransition } from './AnimatedTransition';
import { formatFileSize } from '../utils/formatters';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  largeFileThreshold?: number; // 大文件阈值（字符数）
  onLoadingStateChange?: (isLoading: boolean) => void; // 加载状态变化回调
  onFormatText?: (format: string) => void; // 格式化文本回调
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  isDarkMode,
  onToggleTheme,
  largeFileThreshold = 100000, // 默认10万字符为大文件
  onLoadingStateChange,
  onFormatText,
}) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [isLargeFile, setIsLargeFile] = useState(false);



  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  // 监控内容变化，更新文件大小和大文件状态
  useEffect(() => {
    const size = new Blob([content]).size;
    setFileSize(size);
    setIsLargeFile(content.length > largeFileThreshold);
  }, [content, largeFileThreshold]);

  // 处理加载状态变化
  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    onLoadingStateChange?.(loading);
  }, [onLoadingStateChange]);

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

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            padding: 2,
            transition: theme.transitions.create(['padding']),
          }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* 文件大小指示器 */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {isLargeFile && (
                <Chip
                  label={`大文件: ${formatFileSize(fileSize)}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(0, 0, 0, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
              )}
              {isLoading && (
                <CircularProgress
                  size={20}
                  thickness={5}
                  sx={{
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.2))'
                  }}
                />
              )}
            </Box>

            <LargeFileEditor
              content={content}
              onChange={onChange}
              theme={isDarkMode ? 'dark' : 'light'}
              onLoadingChange={handleLoadingChange}
            />
          </Box>
        </Box>
      </Box>
    </AnimatedTransition>
  );
};