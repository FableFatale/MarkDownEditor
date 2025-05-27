import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import '../../katex-styles.css';
import { createCustomHeadingRenderer, HeadingStyleType } from '../CustomHeadingStyles';
import { Box, FormControl, InputLabel, Select, MenuItem, useTheme, Typography, Divider, Tooltip } from '@mui/material';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  showStyleControls?: boolean;
  headingStyle?: HeadingStyleType;
}

export const MarkdownPreview = ({
  content,
  className = '',
  showStyleControls = false,
  headingStyle = 'default'
}: MarkdownPreviewProps) => {
  const theme = useTheme();
  const [internalHeadingStyle, setInternalHeadingStyle] = useState<HeadingStyleType>('default');

  // 使用外部传入的headingStyle或内部状态
  const effectiveHeadingStyle = showStyleControls ? internalHeadingStyle : headingStyle;

  // 自定义组件
  const components = {
    ...createCustomHeadingRenderer(effectiveHeadingStyle),
    a: ({ node, ...props }: any) => (
      <a
        className="text-blue-500 hover:text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props} />
      ) : (
        <code className="block bg-gray-100 dark:bg-gray-800 rounded p-4 my-4 overflow-auto" {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic"
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th
        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold"
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-sm"
        {...props}
      />
    ),
    img: ({ node, ...props }: any) => (
      <img
        className="max-w-full h-auto my-4 rounded-md"
        loading="lazy"
        {...props}
      />
    ),
  };

  return (
    <div
      className={`prose prose-sm md:prose-base lg:prose-lg ${theme.palette.mode === 'dark' ? 'prose-invert' : ''} max-w-none ${className}`}
      style={{
        color: theme.palette.text.primary,
        backgroundColor: 'transparent'
      }}
    >
      {showStyleControls && (
        <>
          <Box sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <FormatColorTextIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" fontWeight="medium">标题样式设置</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="选择不同的标题样式，立即在预览区查看效果">
                <FormControl size="small" variant="outlined" sx={{ minWidth: 180 }}>
                  <InputLabel>标题样式</InputLabel>
                  <Select
                    value={internalHeadingStyle}
                    onChange={(e) => setInternalHeadingStyle(e.target.value as HeadingStyleType)}
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
        </>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};