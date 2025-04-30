import { Extension } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import createMarkdownShortcuts from './KeyboardShortcuts';

// 编辑器基础配置
export const createEditorConfig = (theme: 'light' | 'dark'): Extension[] => [
  // Markdown语言支持
  markdown({
    codeLanguages: languages,
  }),

  // 快捷键支持
  createMarkdownShortcuts(),

  // 编辑器主题
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
      maxWidth: '900px',
      margin: '0 auto',
    },
    '.cm-line': {
      padding: '0 4px',
      lineHeight: '1.6',
    },
    '.cm-header': { color: theme === 'dark' ? '#88c0d0' : '#0366d6' },
    '.cm-emphasis': { fontStyle: 'italic' },
    '.cm-strong': { fontWeight: 'bold' },
    '.cm-link': { color: theme === 'dark' ? '#88c0d0' : '#0366d6' },
    '.cm-url': { color: theme === 'dark' ? '#88c0d0' : '#0366d6' },
    '.cm-quote': { color: theme === 'dark' ? '#a3be8c' : '#22863a' },
    '.cm-code': {
      backgroundColor: theme === 'dark' ? '#2e3440' : '#f6f8fa',
      padding: '2px 4px',
      borderRadius: '3px',
    },
  }),

  // 编辑器行为配置
  EditorView.lineWrapping,
  EditorView.contentAttributes.of({ spellcheck: 'true' }),
];

// 编辑器默认配置
export const defaultEditorConfig = {
  fontSize: 14,
  lineHeight: 1.6,
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  autoCloseBrackets: true,
  autoCloseTags: true,
  highlightActiveLine: true,
  highlightSelectionMatches: true,
};