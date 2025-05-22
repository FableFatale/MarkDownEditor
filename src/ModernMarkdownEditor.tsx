import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import debounce from 'lodash.debounce';
import ModernLayout from './components/ModernLayout';
import { useThemeContext } from './theme/ThemeContext';
import { WordCounter } from './components/WordCounter';
import { BackupManager } from './components/BackupManager';
import { offlineService } from './services/offlineService';
import TopToolbar from './components/TopToolbar';

// 导入自定义样式
import './styles/main.css';

const initialMarkdown = `# 欢迎使用现代 Markdown 编辑器

这是一个功能强大的Markdown编辑器，支持实时预览、语法高亮、自定义样式等功能。

## 功能特性

- **实时预览**：边写边看，所见即所得
- **语法高亮**：代码块自动高亮显示
- **自定义标题样式**：多种标题样式可选
- **字数统计**：实时统计字数、字符数
- **PDF导出**：一键导出为PDF文档

## 快捷键支持

| 功能 | 快捷键 |
|------|------|
| 加粗 | Ctrl+B |
| 斜体 | Ctrl+I |
| 插入链接 | Ctrl+K |
| 插入代码块 | Ctrl+Alt+E |
| 插入表格 | Ctrl+Alt+T |

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

> 这是一个引用块，用于测试样式渲染。

### 数学公式支持

$$
E = mc^2
$$

祝您使用愉快！
`;

const ModernMarkdownEditor: React.FC = () => {
  const { theme } = useThemeContext();
  const [content, setContent] = useState(initialMarkdown);
  const [editorWidth, setEditorWidth] = useState('50%');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDarkMode = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 自动保存功能
  const saveContent = debounce((value: string) => {
    localStorage.setItem('markdown-content', value);
  }, 1000);

  // 加载保存的内容
  useEffect(() => {
    const savedContent = localStorage.getItem('markdown-content');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // 处理编辑器内容变化
  const handleChange = (value: string) => {
    setContent(value);
    saveContent(value);
  };

  // 处理格式化文本
  const handleFormatText = useCallback((format: string) => {
    // 实现文本格式化逻辑
    const formatActions: { [key: string]: () => void } = {
      bold: () => setContent(prev => prev + '**粗体文本**'),
      italic: () => setContent(prev => prev + '*斜体文本*'),
      quote: () => setContent(prev => prev + '> 引用文本'),
      code: () => setContent(prev => prev + '```\n代码块\n```'),
      link: () => setContent(prev => prev + '[链接文本](url)'),
      image: () => setContent(prev => prev + '![图片描述](图片url)'),
      table: () => setContent(prev => prev + '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |'),
      'bullet-list': () => setContent(prev => prev + '- 列表项'),
      'number-list': () => setContent(prev => prev + '1. 列表项'),
      'heading-1': () => setContent(prev => prev + '# 一级标题'),
      'heading-2': () => setContent(prev => prev + '## 二级标题'),
      'heading-3': () => setContent(prev => prev + '### 三级标题'),
      'heading-4': () => setContent(prev => prev + '#### 四级标题'),
      'heading-5': () => setContent(prev => prev + '##### 五级标题'),
      'heading-6': () => setContent(prev => prev + '###### 六级标题'),
      'strikethrough': () => setContent(prev => prev + '~~删除线文本~~'),
      'align-left': () => setContent(prev => prev + '<div style="text-align: left">左对齐文本</div>'),
      'align-center': () => setContent(prev => prev + '<div style="text-align: center">居中对齐文本</div>'),
      'align-right': () => setContent(prev => prev + '<div style="text-align: right">右对齐文本</div>'),
      'align-justify': () => setContent(prev => prev + '<div style="text-align: justify">两端对齐文本</div>'),
    };

    if (formatActions[format]) {
      formatActions[format]();
    }
  }, []);

  // 处理导出功能
  const handleExport = useCallback((format: string) => {
    console.log(`Export to: ${format}`);
    // 实现导出功能
    switch (format) {
      case 'pdf':
        // 导出为PDF
        window.alert('PDF导出功能即将实现');
        break;
      case 'html':
        // 导出为HTML
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Markdown导出</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
              .container { max-width: 800px; margin: 0 auto; padding: 20px; }
              pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
              code { font-family: 'Fira Code', monospace; }
              blockquote { border-left: 4px solid #ddd; padding-left: 16px; color: #666; }
              img { max-width: 100%; }
              table { border-collapse: collapse; width: 100%; }
              table, th, td { border: 1px solid #ddd; padding: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              ${document.querySelector('.preview-pane')?.innerHTML || ''}
            </div>
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.html';
        a.click();
        URL.revokeObjectURL(url);
        break;
      case 'markdown':
        // 导出为Markdown
        const markdownBlob = new Blob([content], { type: 'text/markdown' });
        const markdownUrl = URL.createObjectURL(markdownBlob);
        const markdownLink = document.createElement('a');
        markdownLink.href = markdownUrl;
        markdownLink.download = 'document.md';
        markdownLink.click();
        URL.revokeObjectURL(markdownUrl);
        break;
      case 'wechat':
        // 导出为微信公众号格式
        window.alert('微信公众号导出功能即将实现');
        break;
      default:
        break;
    }
  }, [content]);

  // 处理分栏拖动调整大小
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // 限制拖动范围
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(`${newWidth}%`);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 计算字数和字符数
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  // 计算预计阅读时间
  const getReadingTime = (text: string): string => {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+(?:['''][a-zA-Z]+)*(?:-[a-zA-Z]+)*/g) || []).length;

    // 中文阅读速度：300字/分钟，英文阅读速度：200词/分钟
    const minutes = Math.ceil((chineseChars / 300) + (englishWords / 200));
    return minutes < 1 ? '< 1分钟' : `${minutes}分钟`;
  };

  const readingTime = getReadingTime(content);

  // 离线编辑支持
  useEffect(() => {
    // 注册离线编辑事件监听
    const handleOfflineChange = () => {
      const isOffline = !navigator.onLine;
      if (isOffline) {
        // 保存到离线存储
        offlineService.saveContent(content);
      }
    };

    window.addEventListener('online', handleOfflineChange);
    window.addEventListener('offline', handleOfflineChange);

    return () => {
      window.removeEventListener('online', handleOfflineChange);
      window.removeEventListener('offline', handleOfflineChange);
    };
  }, [content]);

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部工具栏 */}
      <TopToolbar
        onFormatText={handleFormatText}
        onExport={handleExport}
        isDarkMode={isDarkMode}
        isFullscreen={false}
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
        onToggleTheme={() => {
          // 切换主题
          const newMode = theme.mode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme-mode', newMode);
        }}
        onToggleFullscreen={() => {
          // 切换全屏
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }}
      />

      <div
        ref={containerRef}
        className="flex-1 flex flex-col md:flex-row overflow-hidden"
      >
        {/* 编辑器区域 */}
        <div className="editor-pane h-1/2 md:h-auto md:w-1/2 lg:w-auto flex flex-col" style={{ width: editorWidth }}>
          <CodeMirror
            value={content}
            height="100%"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
              EditorView.lineWrapping,
              isDarkMode ? oneDark : []
            ]}
            onChange={(value) => handleChange(value)}
            className="flex-1"
          />
        </div>

        {/* 分隔条 - 仅在桌面显示 */}
        <div
          className="resizer hidden md:block"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'col-resize' : 'default' }}
        />

        {/* 预览区域 */}
        <div className="preview-pane h-1/2 md:h-auto md:w-1/2 lg:w-auto" style={{ width: `calc(100% - ${editorWidth})` }}>
          <div className="prose dark:prose-invert max-w-none p-4 h-full overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 底部状态栏 - 只保留离线模式和备份管理器 */}
      <div className="flex items-center justify-end px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {!navigator.onLine && (
            <span className="text-amber-500 font-medium mr-2">离线模式</span>
          )}
          <BackupManager content={content} />
        </div>
      </div>
    </div>
  );
};

export default ModernMarkdownEditor;