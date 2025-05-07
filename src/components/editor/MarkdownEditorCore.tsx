import { useEffect, useRef, CSSProperties } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/highlight';
import { tags } from '@lezer/highlight';
import { editorKeymap } from './EditorKeyBindings';
import { useTheme as useMuiTheme } from '@mui/material/styles';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export const MarkdownEditorCore = ({
  initialValue = '',
  onChange,
  className = '',
  style = {},
}: MarkdownEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();
  const muiTheme = useMuiTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';

  // 简化编辑区的Markdown语法高亮样式，标题样式将在预览区域应用
  const markdownHighlightStyle = HighlightStyle.define([
    {
      tag: tags.heading1,
      fontWeight: 'bold',
      color: isDarkMode ? '#61afef' : '#1976d2',
    },
    {
      tag: tags.heading2,
      fontWeight: 'bold',
      color: isDarkMode ? '#c678dd' : '#7b1fa2',
    },
    {
      tag: tags.heading3,
      fontWeight: 'bold',
      color: isDarkMode ? '#e5c07b' : '#ff9800',
    },
    { tag: tags.heading4, fontWeight: 'bold' },
    { tag: tags.heading5, fontWeight: 'bold' },
    { tag: tags.heading6, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strong, fontWeight: 'bold' },
    {
      tag: tags.link,
      color: isDarkMode ? '#61afef' : '#2196f3',
      textDecoration: 'underline',
    },
    {
      tag: tags.url,
      color: isDarkMode ? '#61afef' : '#2196f3',
      textDecoration: 'underline',
    },
    {
      tag: tags.quote,
      color: isDarkMode ? '#98c379' : '#4caf50',
      fontStyle: 'italic',
    },
    {
      tag: tags.list,
      color: isDarkMode ? '#abb2bf' : '#424242',
    },
    {
      tag: tags.listMark,
      color: isDarkMode ? '#e06c75' : '#f44336',
      fontWeight: 'bold',
    },
    {
      tag: tags.code,
      backgroundColor: isDarkMode ? '#282c34' : '#f5f5f5',
      color: isDarkMode ? '#abb2bf' : '#333',
      fontFamily: 'monospace',
      padding: '0 4px',
      borderRadius: '3px',
    },
    {
      tag: tags.content,
      color: isDarkMode ? '#abb2bf' : '#333',
    },
  ]);

  // 编辑器主题
  const editorTheme = EditorView.theme({
    '&': {
      height: '100%',
      fontSize: '14px',
      fontFamily: "'Fira Code', 'Consolas', monospace",
      backgroundColor: isDarkMode ? '#282c34' : '#ffffff',
      color: isDarkMode ? '#abb2bf' : '#333',
    },
    '.cm-content': {
      fontFamily: "'Fira Code', 'Consolas', monospace",
      padding: '10px 8px',
      lineHeight: '1.6',
    },
    '.cm-line': {
      padding: '0 4px',
    },
    '.cm-cursor': {
      borderLeftColor: isDarkMode ? '#61afef' : '#1976d2',
      borderLeftWidth: '2px',
    },
    '.cm-activeLine': {
      backgroundColor: isDarkMode ? 'rgba(97, 175, 239, 0.1)' : 'rgba(25, 118, 210, 0.05)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: isDarkMode ? 'rgba(97, 175, 239, 0.1)' : 'rgba(25, 118, 210, 0.05)',
    },
    '.cm-gutters': {
      backgroundColor: isDarkMode ? '#21252b' : '#f5f5f5',
      color: isDarkMode ? '#545862' : '#999',
      border: 'none',
    },
    '.cm-gutter': {
      minWidth: '2em',
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: "'Fira Code', 'Consolas', monospace",
    },
    '.cm-matchingBracket': {
      backgroundColor: isDarkMode ? 'rgba(97, 175, 239, 0.3)' : 'rgba(25, 118, 210, 0.2)',
      color: 'inherit',
    },
    '.cm-selectionMatch': {
      backgroundColor: isDarkMode ? 'rgba(97, 175, 239, 0.2)' : 'rgba(25, 118, 210, 0.1)',
    },
  });

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        markdown(),
        syntaxHighlighting(markdownHighlightStyle),
        editorTheme,
        editorKeymap, // 使用自定义快捷键
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [initialValue, onChange, isDarkMode]);

  // 当主题变化时更新编辑器样式
  useEffect(() => {
    if (!editorViewRef.current) return;

    editorViewRef.current.dispatch({
      effects: [
        EditorView.theme.reconfigure(editorTheme),
        syntaxHighlighting(markdownHighlightStyle).reconfigure(),
      ],
    });
  }, [isDarkMode]);

  return (
    <div
      ref={editorRef}
      className={`w-full h-full overflow-auto font-mono ${className}`}
      style={style}
    />
  );
};