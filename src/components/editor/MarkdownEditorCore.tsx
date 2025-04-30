import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/highlight';
import { tags } from '@lezer/highlight';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

// 自定义Markdown语法高亮样式
const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, class: 'text-blue-600 font-bold' },
  { tag: tags.emphasis, class: 'italic' },
  { tag: tags.strong, class: 'font-bold' },
  { tag: tags.link, class: 'text-blue-500 underline' },
  { tag: tags.url, class: 'text-blue-500 underline' },
  { tag: tags.quote, class: 'text-gray-600 border-l-4 border-gray-300 pl-4' },
  { tag: tags.list, class: 'text-gray-800' },
  { tag: tags.listMark, class: 'text-gray-500 font-bold' },
  { tag: tags.code, class: 'bg-gray-100 rounded px-1 font-mono' },
]);

export const MarkdownEditorCore = ({
  initialValue = '',
  onChange,
  className = '',
}: MarkdownEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        markdown(),
        syntaxHighlighting(markdownHighlightStyle),
        keymap.of(defaultKeymap),
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
  }, [initialValue, onChange]);

  return (
    <div
      ref={editorRef}
      className={`w-full h-full overflow-auto font-mono ${className}`}
    />
  );
};