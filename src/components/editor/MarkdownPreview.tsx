import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import '../../katex-styles.css';
import { createCustomHeadingRenderer, HeadingStyleType } from '../CustomHeadingStyles';
import { Box, FormControl, InputLabel, Select, MenuItem, useTheme, Typography, Divider, Tooltip } from '@mui/material';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { MermaidDiagram, isMermaidCode } from '../MermaidDiagram';

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

  // 使用 useMemo 缓存自定义组件，避免每次渲染时重新创建
  const components = useMemo(() => ({
    ...createCustomHeadingRenderer(effectiveHeadingStyle),
    a: ({ node, ...props }: any) => (
      <a
        className="text-blue-500 hover:text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    pre: ({ node, children, ...props }: any) => {
      // 检查是否包含代码块
      const codeElement = React.Children.toArray(children).find(
        (child: any) => child?.props?.className?.includes('language-')
      );

      if (codeElement && typeof codeElement === 'object' && 'props' in codeElement) {
        const className = codeElement.props.className || '';
        const match = /language-(\w+)/.exec(className);
        const language = match ? match[1] : '';

        // 获取原始代码内容，确保正确处理换行符
        let codeContent = '';
        if (React.isValidElement(codeElement) && codeElement.props.children) {
          if (typeof codeElement.props.children === 'string') {
            codeContent = codeElement.props.children;
          } else if (Array.isArray(codeElement.props.children)) {
            codeContent = codeElement.props.children.join('');
          } else {
            codeContent = String(codeElement.props.children);
          }
        }

        // 清理代码内容
        codeContent = codeContent.trim();

        if (isMermaidCode(language)) {
          // 验证内容不为空
          if (codeContent) {
            // 使用内容长度和前几个字符作为稳定的key，避免重复渲染
            const safeContent = codeContent.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
            const chartKey = `mermaid-${codeContent.length}-${safeContent}`;
            return <MermaidDiagram key={chartKey} chart={codeContent} />;
          }
        }
      }

      // 普通代码块
      return (
        <pre
          className={`rounded p-4 my-4 overflow-auto ${
            theme.palette.mode === 'dark'
              ? 'bg-gray-800 text-gray-100'
              : 'bg-gray-100 text-gray-900'
          }`}
          {...props}
        >
          {children}
        </pre>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      // 只处理内联代码，代码块由pre处理
      if (inline) {
        return (
          <code
            className={`rounded px-1 py-0.5 ${
              theme.palette.mode === 'dark'
                ? 'bg-gray-800 text-gray-100'
                : 'bg-gray-100 text-gray-900'
            }`}
            {...props}
          >
            {children}
          </code>
        );
      }

      // 检查是否为Mermaid代码块
      if (className && className.includes('language-mermaid')) {
        // 不处理Mermaid代码块，让pre组件处理
        return null;
      }

      // 非内联代码直接返回，让pre处理
      return <code className={className} {...props}>{children}</code>;
    },
    div: ({ node, className, ...props }: any) => {
      // 处理Mermaid容器
      if (className === 'mermaid-container') {
        const mermaidData = props['data-mermaid'];
        if (mermaidData) {
          const chart = decodeURIComponent(mermaidData);
          return <MermaidDiagram chart={chart} />;
        }
      }

      return <div className={className} {...props} />;
    },

    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className={`border-l-4 pl-4 my-4 italic ${
          theme.palette.mode === 'dark'
            ? 'border-gray-600 text-gray-300'
            : 'border-gray-300 text-gray-700'
        }`}
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table
          className={`min-w-full divide-y ${
            theme.palette.mode === 'dark'
              ? 'divide-gray-700'
              : 'divide-gray-200'
          }`}
          {...props}
        />
      </div>
    ),
    th: ({ node, ...props }: any) => (
      <th
        className={`px-3 py-2 text-left text-sm font-semibold ${
          theme.palette.mode === 'dark'
            ? 'bg-gray-800 text-gray-100'
            : 'bg-gray-100 text-gray-900'
        }`}
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        className={`px-3 py-2 border-t text-sm ${
          theme.palette.mode === 'dark'
            ? 'border-gray-700 text-gray-200'
            : 'border-gray-200 text-gray-800'
        }`}
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
  }), [theme.palette.mode, effectiveHeadingStyle]);

  return (
    <div
      className={`prose prose-sm md:prose-base lg:prose-lg ${
        theme.palette.mode === 'dark' ? 'prose-invert dark' : ''
      } max-w-none ${className}`}
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