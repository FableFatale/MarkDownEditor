import { useEffect, useRef, CSSProperties } from 'react';
import { EditorView } from 'codemirror'; // Assuming 'codemirror' might be a remnant or should be @codemirror/view
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
// import { HighlightStyle, syntaxHighlighting } from '@codemirror/highlight'; // Removed as package is removed
// import { tags } from '@lezer/highlight'; // Removed as it's related to @codemirror/highlight
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

  // markdownHighlightStyle removed as @codemirror/highlight and @lezer/highlight are removed.
  // Syntax highlighting will be handled by the theme and @codemirror/lang-markdown.

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
        // basicSetup, // Removed as @codemirror/basic-setup was removed
        markdown(),
        // syntaxHighlighting(markdownHighlightStyle), // Removed as @codemirror/highlight was removed
        editorTheme,
        EditorState.tabSize.of(2), // Added for basic functionality, can be configured
        EditorView.lineWrapping, // Added for basic functionality
        keymap.of(editorKeymap), // Ensure editorKeymap is correctly defined and imported
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
        // syntaxHighlighting(markdownHighlightStyle).reconfigure(), // Removed
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