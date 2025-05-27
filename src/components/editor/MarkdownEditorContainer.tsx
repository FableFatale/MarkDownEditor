import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MarkdownEditorCore } from './MarkdownEditorCore';
import { MarkdownPreview } from './MarkdownPreview';
import { Resizable } from 'react-resizable';
import WordCounter from '../WordCounter';
import PdfExporter from '../PdfExporter';
import { Box, Divider, useTheme, CircularProgress, Typography, LinearProgress, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { LargeFileEditor } from '../LargeFileEditor';
import { MarkdownEditor } from '../MarkdownEditor';
import debounce from 'lodash.debounce';
import 'react-resizable/css/styles.css';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

interface MarkdownEditorContainerProps {
  initialValue?: string;
  className?: string;
  onContentChange?: (content: string) => void;
  largeFileThreshold?: number; // Size threshold in characters to use large file editor
  previewRef?: React.RefObject<HTMLDivElement>;
  onFormatText?: (format: string) => void;
}

export const MarkdownEditorContainer = ({
  initialValue = '',
  className = '',
  onContentChange,
  largeFileThreshold = 100000, // Default to 100KB (approximately 100,000 characters)
  previewRef: externalPreviewRef,
  onFormatText
}: MarkdownEditorContainerProps) => {
  const theme = useTheme();
  const [content, setContent] = useState(initialValue);
  const [previewContent, setPreviewContent] = useState(initialValue);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth * 0.4); // 初始编辑器宽度设为40%，给预览区域留出更多空间
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [headingStyle, setHeadingStyle] = useState<string>('default');
  const internalPreviewRef = useRef<HTMLDivElement>(null);
  const previewRef = externalPreviewRef || internalPreviewRef;

  // Determine if we should use the large file editor based on content size
  const isLargeFile = useMemo(() => {
    return initialValue.length > largeFileThreshold;
  }, [initialValue.length, largeFileThreshold]);

  // 处理内容变化 - 使用debounce优化大文件性能
  const handleContentChange = useMemo(
    () =>
      debounce((newContent: string) => {
        setContent(newContent);
        onContentChange?.(newContent);

        // 对于大文件，延迟更新预览内容以提高性能
        if (isLargeFile) {
          setIsPreviewUpdating(true);
          setTimeout(() => {
            setPreviewContent(newContent);
            setIsPreviewUpdating(false);
          }, 1000); // 1秒后更新预览，减少频繁渲染
        } else {
          setPreviewContent(newContent);
        }
      }, 300),
    [onContentChange, isLargeFile]
  );

  // 处理加载状态变化
  const handleLoadingStateChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // 切换暗黑模式
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // 清理debounce函数
  useEffect(() => {
    return () => {
      handleContentChange.cancel();
    };
  }, [handleContentChange]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 确保编辑器宽度在窗口调整时保持合理比例，给预览区域留出足够空间
      const maxAllowedWidth = window.innerWidth * 0.7;
      if (editorWidth > maxAllowedWidth) {
        setEditorWidth(window.innerWidth * 0.4); // 重置为默认40%宽度
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editorWidth]);

  // 处理编辑器大小调整
  const handleResize = (_: any, { size }: { size: { width: number } }) => {
    // 限制最小宽度和最大宽度
    const minWidth = 300;
    const maxWidth = window.innerWidth * 0.7; // 允许编辑器占据更大空间，但仍保留足够的预览区域

    let newWidth = size.width;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    setEditorWidth(newWidth);
  };

  // 设置data-theme属性以支持CSS变量
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}
      data-theme={theme.palette.mode}
    >
      {/* 加载状态指示器 */}
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 9999
          }}
        />
      )}



      {/* 编辑器和预览区 - 水平并列布局 */}
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, width: '100%', overflow: 'hidden' }}>
        {/* 编辑器区域 */}
        <Box sx={{ width: editorWidth, height: '100%', position: 'relative' }}>
          <Resizable
            width={editorWidth}
            height={0}
            onResize={handleResize}
            handle={
              <div
                style={{
                  width: '8px',
                  height: '100%',
                  cursor: 'col-resize',
                  backgroundColor: theme.palette.divider,
                  position: 'absolute',
                  right: '-4px',
                  top: 0,
                  bottom: 0,
                  zIndex: 10,
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.light;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = theme.palette.divider;
                }}
              />
            }
            axis="x"
          >
            <Box sx={{ width: editorWidth, height: '100%', position: 'relative' }}>
              {isLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 3,
                    borderRadius: 2,
                  }}
                >
                  <CircularProgress color="primary" />
                  <Box sx={{ color: 'white' }}>Loading large file...</Box>
                </Box>
              )}
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <MarkdownEditor
                  content={content}
                  onChange={handleContentChange}
                  isDarkMode={isDarkMode}
                  onToggleTheme={toggleDarkMode}
                  largeFileThreshold={largeFileThreshold}
                  onLoadingStateChange={handleLoadingStateChange}
                  onFormatText={onFormatText}
                />
              </Box>
            </Box>
          </Resizable>
        </Box>

        {/* 预览区域 */}
        <Box
          ref={previewRef}
          sx={{
            flex: 1,
            height: '100%',
            overflow: 'auto',
            padding: 3,
            backgroundColor: theme.palette.background.default,
            borderLeft: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // 确保弹性布局中不会溢出
          }}
        >
          <Box sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2,
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.default,
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              borderRadius: '4px 4px 0 0',
            }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                mb: 1,
                fontWeight: 'medium',
                color: theme.palette.text.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>预览区域</span>
              {isLoading && (
                <CircularProgress
                  size={20}
                  thickness={4}
                  sx={{ opacity: 0.7 }}
                />
              )}
            </Typography>

            {/* 标题样式选择器 - 移动到预览区域内部 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <FormatColorTextIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: '1.2rem' }} />
                <Typography variant="subtitle2" fontWeight="medium">标题样式设置</Typography>
              </Box>

              <Tooltip title="选择不同的标题样式，立即在预览区查看效果">
                <FormControl size="small" variant="outlined" sx={{ minWidth: 180 }}>
                  <InputLabel>标题样式</InputLabel>
                  <Select
                    value={headingStyle}
                    onChange={(e) => setHeadingStyle(e.target.value)}
                    label="标题样式"
                  >
                    <MenuItem value="default">默认样式</MenuItem>
                    <MenuItem value="underline">下划线样式</MenuItem>
                    <MenuItem value="bordered">边框样式</MenuItem>
                    <MenuItem value="gradient">渐变样式</MenuItem>
                    <MenuItem value="modern">现代样式</MenuItem>
                    <MenuItem value="elegant">优雅样式</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Box>
          </Box>

          {(isLargeFile && (isLoading || isPreviewUpdating)) ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
                width: '100%',
                padding: 2,
              }}
            >
              <CircularProgress size={40} thickness={4} color="primary" />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {isLoading ? 'Loading content...' : 'Rendering preview...'}
                {isLargeFile && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Large file processing may take longer
                  </Typography>
                )}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                opacity: isLoading ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
                overflowY: 'auto',
                width: '100%', // 确保内容宽度充分利用可用空间
                height: '100%', // 确保内容高度充分利用可用空间
                '& .prose': {
                  maxWidth: 'none', // 覆盖prose默认的最大宽度限制
                  width: '100%',
                }
              }}
            >
              <MarkdownPreview
                content={previewContent}
                showStyleControls={false}
                headingStyle={headingStyle}
                className="preview-content"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};