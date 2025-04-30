import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { useTheme } from '../../theme/ThemeContext';
import { useMarkdownStore } from '../../store/markdownStore';
import { debounce } from 'lodash';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '',
  onChange,
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();
  const { theme } = useTheme();
  const { setContent } = useMarkdownStore();

  // 编辑器内容变化处理
  const handleDocChange = debounce((value: string) => {
    onChange?.(value);
    setContent(value);
  }, 300);

  useEffect(() => {
    if (!editorRef.current) return;

    // 创建编辑器实例
    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        markdown(),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            handleDocChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#e0e0e0' : '#2d2d2d',
          },
          '.cm-content': {
            fontFamily: 'Monaco, Menlo, Consolas, monospace',
            padding: '10px',
          },
          '.cm-line': {
            padding: '0 4px',
            lineHeight: '1.6',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // 主题变化时更新编辑器样式
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: EditorView.theme.reconfigure({
          '&': {
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#e0e0e0' : '#2d2d2d',
          },
        }),
      });
    }
  }, [theme]);

  return (
    <div
      ref={editorRef}
      className={`w-full h-full overflow-auto ${className}`}
      data-testid="markdown-editor"
    />
  );
};

export default MarkdownEditor;