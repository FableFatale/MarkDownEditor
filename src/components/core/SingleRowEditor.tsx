import React, { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import SingleRowToolbar from './SingleRowToolbar';
import { useThemeContext } from '../theme/ThemeContext';
import { createCustomHeadingRenderer, HeadingStyleType } from './CustomHeadingStyles';
import { Box, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import '../katex-styles.css';

interface SingleRowEditorProps {
  initialValue?: string;
  onContentChange?: (content: string) => void;
}

const SingleRowEditor: React.FC<SingleRowEditorProps> = ({
  initialValue = '',
  onContentChange
}) => {
  const { theme } = useThemeContext();
  const [content, setContent] = useState(initialValue);
  const [editorWidth, setEditorWidth] = useState(50); // 编辑器宽度百分比
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [headingStyle, setHeadingStyle] = useState<HeadingStyleType>('default');
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const isDarkMode = theme.mode === 'dark' ||
    (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 处理内容变化
  const handleChange = useCallback((value: string) => {
    setContent(value);
    onContentChange?.(value);
  }, [onContentChange]);

  // 处理格式化文本 - 与CodeMirror编辑器联动
  const handleFormatText = useCallback((format: string) => {
    if (!editorRef.current) return;

    const view = editorRef.current.view;
    if (!view) return;

    const selection = view.state.selection.main;
    const selectedText = view.state.sliceDoc(selection.from, selection.to);

    const formatActions: { [key: string]: () => { insert: string; cursorOffset?: number } } = {
      'bold': () => {
        if (selectedText) {
          return { insert: `**${selectedText}**`, cursorOffset: 2 };
        }
        return { insert: '****', cursorOffset: 2 };
      },
      'italic': () => {
        if (selectedText) {
          return { insert: `*${selectedText}*`, cursorOffset: 1 };
        }
        return { insert: '**', cursorOffset: 1 };
      },
      'quote': () => {
        const lines = selectedText ? selectedText.split('\n') : ['引用文本'];
        const quotedLines = lines.map(line => `> ${line}`).join('\n');
        return { insert: quotedLines };
      },
      'code': () => {
        if (selectedText) {
          if (selectedText.includes('\n')) {
            return { insert: `\`\`\`\n${selectedText}\n\`\`\`` };
          }
          return { insert: `\`${selectedText}\`` };
        }
        return { insert: '``', cursorOffset: 1 };
      },
      'link': () => {
        if (selectedText) {
          return { insert: `[${selectedText}](url)` };
        }
        return { insert: '[链接文本](url)' };
      },
      'image': () => {
        if (selectedText) {
          return { insert: `![${selectedText}](图片url)` };
        }
        return { insert: '![图片描述](图片url)' };
      },
      'bullet-list': () => {
        const lines = selectedText ? selectedText.split('\n') : ['列表项'];
        const listItems = lines.map(line => `- ${line}`).join('\n');
        return { insert: listItems };
      },
      'number-list': () => {
        const lines = selectedText ? selectedText.split('\n') : ['列表项'];
        const listItems = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
        return { insert: listItems };
      },
      'table': () => {
        return { insert: '| 列1 | 列2 |\n| --- | --- |\n| 内容1 | 内容2 |' };
      },
      'heading-1': () => {
        const text = selectedText || '一级标题';
        return { insert: `# ${text}` };
      },
      'heading-2': () => {
        const text = selectedText || '二级标题';
        return { insert: `## ${text}` };
      },
      'heading-3': () => {
        const text = selectedText || '三级标题';
        return { insert: `### ${text}` };
      },
    };

    if (formatActions[format]) {
      const { insert, cursorOffset } = formatActions[format]();

      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: insert
        },
        selection: cursorOffset ? {
          anchor: selection.from + cursorOffset,
          head: selection.from + cursorOffset
        } : undefined
      });

      view.focus();
    }
  }, []);

  // 处理导出
  const handleExport = useCallback((format: string) => {
    const exportActions: { [key: string]: () => void } = {
      'markdown': () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
      },
      'html': () => {
        // 这里可以实现HTML导出逻辑
        console.log('导出HTML');
      },
      'pdf': () => {
        // 这里可以实现PDF导出逻辑
        console.log('导出PDF');
      },
      'json': () => {
        const data = { content, timestamp: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    if (exportActions[format]) {
      exportActions[format]();
    }
  }, [content]);

  // 处理全屏切换
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // 处理拖拽调整大小
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setEditorWidth(Math.max(20, Math.min(80, newWidth)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 计算字数统计
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;
  const readingTime = Math.ceil(wordCount / 200) + '分钟'; // 假设每分钟阅读200字

  return (
    <div className={`h-screen flex flex-col ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* 统一工具栏 */}
      <SingleRowToolbar
        onFormatText={handleFormatText}
        onExport={handleExport}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        isDarkMode={isDarkMode}
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
      />

      {/* 编辑器和预览区域 */}
      <div
        ref={containerRef}
        className="editor-container"
      >
        {/* 编辑器区域 */}
        <div
          className="editor-panel"
          style={{ width: `${editorWidth}%` }}
        >
          <CodeMirror
            ref={editorRef}
            value={content}
            height="100%"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
              EditorView.lineWrapping,
              isDarkMode ? oneDark : []
            ]}
            onChange={handleChange}
            className="h-full"
            theme={isDarkMode ? oneDark : undefined}
          />
        </div>

        {/* 分隔条 */}
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'col-resize' : 'default' }}
        />

        {/* 预览区域 */}
        <div
          className="preview-panel"
          style={{ width: `${100 - editorWidth}%` }}
        >
          {/* 标题样式选择器 */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
            px: 2,
            pt: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1
          }}>
            <Tooltip title="选择不同的标题样式，立即在预览区查看效果">
              <FormControl size="small" variant="outlined" sx={{ minWidth: 180 }}>
                <InputLabel>标题样式</InputLabel>
                <Select
                  value={headingStyle}
                  onChange={(e) => setHeadingStyle(e.target.value as HeadingStyleType)}
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

          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none px-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeSlug]}
              components={createCustomHeadingRenderer(headingStyle)}
            >
              {content || '# 欢迎使用 Markdown 编辑器\n\n开始在左侧编辑器中输入内容，右侧将实时显示预览效果。\n\n## 功能特性\n\n- **实时预览**：左右分屏实时预览\n- **格式化工具**：丰富的格式化按钮\n- **标题样式**：多种标题样式可选\n- **主题切换**：支持明暗主题\n- **导出功能**：支持多种格式导出\n\n### 使用说明\n\n1. 在左侧编辑器中输入 Markdown 内容\n2. 右侧会实时显示预览效果\n3. 使用顶部工具栏快速插入格式\n4. 选择不同的标题样式查看效果'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRowEditor;
