import { useState, useRef, useEffect } from 'react';
import { MarkdownEditorCore } from './MarkdownEditorCore';
import { MarkdownPreview } from './MarkdownPreview';
import { Resizable } from 'react-resizable';
import WordCounter from '../WordCounter';
import PdfExporter from '../PdfExporter';
import { Box, Divider, useTheme } from '@mui/material';
import 'react-resizable/css/styles.css';

interface MarkdownEditorContainerProps {
  initialValue?: string;
  className?: string;
  onContentChange?: (content: string) => void;
}

export const MarkdownEditorContainer = ({
  initialValue = '',
  className = '',
  onContentChange,
}: MarkdownEditorContainerProps) => {
  const theme = useTheme();
  const [content, setContent] = useState(initialValue);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth / 2);
  const previewRef = useRef<HTMLDivElement>(null);

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
  };

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 确保编辑器宽度不超过窗口宽度的80%
      if (editorWidth > window.innerWidth * 0.8) {
        setEditorWidth(window.innerWidth * 0.5);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editorWidth]);

  // 处理编辑器大小调整
  const handleResize = (_: any, { size }: { size: { width: number } }) => {
    // 限制最小宽度和最大宽度
    const minWidth = 300;
    const maxWidth = window.innerWidth * 0.8;

    let newWidth = size.width;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    setEditorWidth(newWidth);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 工具栏 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <WordCounter text={content} />
        <PdfExporter contentRef={previewRef} fileName="markdown-document.pdf" />
      </Box>

      {/* 编辑器和预览区 */}
      <div className="flex flex-1 overflow-hidden">
        <Resizable
          width={editorWidth}
          height={0} // 高度由容器控制
          onResize={handleResize}
          handle={
            <div
              className="w-2 h-full cursor-col-resize"
              style={{
                backgroundColor: theme.palette.divider,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                }
              }}
            />
          }
          axis="x"
        >
          <div style={{ width: editorWidth }} className="h-full">
            <MarkdownEditorCore
              initialValue={initialValue}
              onChange={handleContentChange}
              className="h-full p-4"
              style={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                color: theme.palette.text.primary,
              }}
            />
          </div>
        </Resizable>

        <div
          ref={previewRef}
          className="flex-1 h-full overflow-auto p-4"
          style={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
            borderLeft: `1px solid ${theme.palette.divider}`,
          }}
        >
          <MarkdownPreview content={content} showStyleControls={true} />
        </div>
      </div>
    </div>
  );
};