import React, { useCallback, useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { oneDarkPro } from '../theme/oneDarkPro';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { motion } from 'framer-motion';
import TailwindMarkdownPreview from './TailwindMarkdownPreview';

interface EditorSettings {
  fontSize: number;
  lineHeight: number;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  editorWidth: number;
  headingStyle: 'default' | 'underline' | 'bordered' | 'gradient' | 'modern' | 'elegant';
}

interface TailwindMarkdownEditorProps {
  initialValue?: string;
  onContentChange?: (content: string) => void;
  className?: string;
  previewRef?: React.RefObject<HTMLDivElement>;
  onFormatText?: (format: string, options?: any) => void;
  editorSettings?: EditorSettings;
  onSettingsChange?: (settings: EditorSettings) => void;
}

const TailwindMarkdownEditor: React.FC<TailwindMarkdownEditorProps> = ({
  initialValue = '',
  onContentChange,
  className = '',
  previewRef,
  onFormatText,
  editorSettings,
  onSettingsChange,
}) => {
  const [content, setContent] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [editorWidth, setEditorWidth] = useState(editorSettings?.editorWidth || 50);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  // 检测深色模式
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // 处理内容变化
  const handleChange = useCallback((value: string) => {
    setContent(value);
    onContentChange?.(value);
  }, [onContentChange]);

  // 创建编辑器扩展
  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    keymap.of([indentWithTab]),
    EditorView.theme({
      '&': {
        fontSize: `${editorSettings?.fontSize || 14}px`,
        lineHeight: `${editorSettings?.lineHeight || 1.5}`,
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        height: '100%',
      },
      '.cm-scroller': {
        fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", "Consolas", monospace',
      },
    }),
    ...(isDark ? [oneDarkPro] : []),
  ];

  // 处理分栏拖动
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
        setEditorWidth(newWidth);
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

  // 格式化文本功能
  const formatText = useCallback((format: string, options?: any) => {
    if (!editorRef.current) return;

    const view = editorRef.current.view;
    if (!view) return;

    const { state } = view;
    const { selection } = state;
    const { from, to } = selection.main;
    
    let insertText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        insertText = from === to ? '**粗体文本**' : `**${state.sliceDoc(from, to)}**`;
        cursorOffset = from === to ? 2 : 0;
        break;
      case 'italic':
        insertText = from === to ? '*斜体文本*' : `*${state.sliceDoc(from, to)}*`;
        cursorOffset = from === to ? 1 : 0;
        break;
      case 'link':
        const selectedText = state.sliceDoc(from, to);
        insertText = selectedText ? `[${selectedText}](URL)` : '[链接文本](URL)';
        cursorOffset = insertText.indexOf('URL');
        break;
      case 'image':
        insertText = options?.imageUrl 
          ? `![${options.altText || '图片描述'}](${options.imageUrl})`
          : '![图片描述](图片URL)';
        break;
      case 'code':
        if (from === to) {
          insertText = '```\n代码块\n```';
          cursorOffset = 4;
        } else {
          insertText = `\`${state.sliceDoc(from, to)}\``;
        }
        break;
      case 'quote':
        insertText = from === to ? '> 引用文本' : `> ${state.sliceDoc(from, to)}`;
        break;
      case 'table':
        insertText = '| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |';
        break;
      case 'bullet-list':
        insertText = from === to ? '- 列表项' : `- ${state.sliceDoc(from, to)}`;
        break;
      case 'number-list':
        insertText = from === to ? '1. 列表项' : `1. ${state.sliceDoc(from, to)}`;
        break;
      default:
        if (format.startsWith('heading-')) {
          const level = parseInt(format.split('-')[1]);
          const hashes = '#'.repeat(level);
          insertText = from === to ? `${hashes} 标题` : `${hashes} ${state.sliceDoc(from, to)}`;
        }
        break;
    }

    if (insertText) {
      view.dispatch({
        changes: { from, to, insert: insertText },
        selection: cursorOffset > 0 
          ? { anchor: from + cursorOffset, head: from + cursorOffset }
          : { anchor: from + insertText.length }
      });
      view.focus();
    }
  }, []);

  // 暴露格式化函数到全局
  useEffect(() => {
    (window as any).editorFormatText = formatText;
    return () => {
      delete (window as any).editorFormatText;
    };
  }, [formatText]);

  // 使用 useMemo 优化 headingStyle，避免不必要的重新渲染
  const headingStyle = React.useMemo(() =>
    editorSettings?.headingStyle || 'default',
    [editorSettings?.headingStyle]
  );

  return (
    <div
      ref={containerRef}
      className={`flex h-full relative ${className}`}
    >
      {/* 编辑器区域 - 现代化样式 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full relative overflow-hidden"
        style={{ width: `${editorWidth}%` }}
      >
        {/* 背景装饰 - 深色模式不添加背景，让OneDarkPro主题生效 */}
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/30" />
        )}

        <div className="h-full flex flex-col relative z-10">
          {/* 编辑器头部 - 玻璃态效果 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`px-4 py-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-b border-white/20 dark:border-gray-700/20`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>编辑器</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{Math.round(editorWidth)}%</span>
              </div>
            </div>
          </motion.div>
          
          {/* CodeMirror编辑器 */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              ref={editorRef}
              value={content}
              height="100%"
              extensions={extensions}
              onChange={handleChange}
              className="h-full"
              basicSetup={{
                lineNumbers: editorSettings?.showLineNumbers !== false,
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                highlightSelectionMatches: false,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* 分隔条 - 现代化样式 */}
      <motion.div
        className={`w-1 cursor-col-resize transition-all duration-300 relative ${
          isDragging
            ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
            : 'bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 hover:from-blue-400 hover:to-blue-500'
        }`}
        onMouseDown={handleMouseDown}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        {/* 拖拽指示器 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-white/50 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* 预览区域 - 现代化样式 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        ref={previewRef}
        className={`h-full overflow-auto relative`}
        style={{ width: `${100 - editorWidth}%` }}
      >
        {/* 背景装饰 - 深色模式不添加背景，保持预览区域的深色主题 */}
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-50/30 to-cyan-50/30" />
        )}

        <div className="h-full flex flex-col relative z-10">
          {/* 预览头部 - 玻璃态效果 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`px-4 py-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-b border-white/20 dark:border-gray-700/20`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                <span>预览</span>
              </h3>
              {/* 标题样式选择器 */}
              <select
                value={headingStyle}
                onChange={(e) => {
                  const newStyle = e.target.value as EditorSettings['headingStyle'];
                  if (onSettingsChange && editorSettings) {
                    onSettingsChange({
                      ...editorSettings,
                      headingStyle: newStyle
                    });
                  }
                }}
                className={`text-xs px-2 py-1 rounded border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="default">默认</option>
                <option value="underline">下划线</option>
                <option value="bordered">边框</option>
                <option value="gradient">渐变</option>
                <option value="modern">现代</option>
                <option value="elegant">优雅</option>
              </select>
            </div>
          </motion.div>
          
          {/* 预览内容 */}
          <div className="flex-1 p-4">
            <TailwindMarkdownPreview
              content={content}
              headingStyle={headingStyle}
              isDark={isDark}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TailwindMarkdownEditor;
