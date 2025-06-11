import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// 亮色主题 - 使用统一的颜色方案
export const lightTheme = EditorView.theme({
  '&': {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  '.cm-content': {
    caretColor: '#0969da',
    lineHeight: '1.6',
  },
  '.cm-cursor': {
    borderLeftColor: '#0969da',
    borderLeftWidth: '2px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(9, 105, 218, 0.08)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(9, 105, 218, 0.08)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(9, 105, 218, 0.15)',
  },
  '.cm-gutters': {
    backgroundColor: '#f7f8fa',
    color: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  },
  '.cm-lineNumbers': {
    minWidth: '3em',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#eef1f5',
    border: 'none',
    color: '#57606a',
    borderRadius: '3px',
  },
  '.cm-tooltip': {
    backgroundColor: '#ffffff',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#f6f8fa',
      color: '#24292f',
    },
  },
  '.cm-panels': {
    backgroundColor: '#f6f8fa',
    color: '#24292f',
  },
  '.cm-panels-top': {
    borderBottom: '1px solid #d0d7de',
  },
  '.cm-panels-bottom': {
    borderTop: '1px solid #d0d7de',
  },
  '.cm-search': {
    padding: '4px 8px',
  },
  '.cm-searchMatch': {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    outline: '1px solid rgba(255, 215, 0, 0.5)',
  },
  '.cm-searchMatch-selected': {
    backgroundColor: 'rgba(255, 165, 0, 0.4)',
  },
});

// 亮色语法高亮
export const lightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#cf222e' },
  { tag: t.comment, color: '#6e7781', fontStyle: 'italic' },
  { tag: t.name, color: '#0550ae' },
  { tag: t.variableName, color: '#953800' },
  { tag: t.propertyName, color: '#0550ae' },
  { tag: t.typeName, color: '#0550ae' },
  { tag: t.className, color: '#0550ae' },
  { tag: t.special(t.brace), color: '#24292f' },
  { tag: t.number, color: '#0550ae' },
  { tag: t.string, color: '#0a3069' },
  { tag: t.regexp, color: '#116329' },
  { tag: t.operator, color: '#cf222e' },
  { tag: t.meta, color: '#6639ba' },
  { tag: t.heading, color: '#0550ae', fontWeight: 'bold' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#0969da', textDecoration: 'underline' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.tagName, color: '#116329' },
  { tag: t.attributeName, color: '#953800' },
  { tag: t.attributeValue, color: '#0a3069' },
  { tag: t.processingInstruction, color: '#6639ba' },
]);

// 深色主题
export const darkTheme = EditorView.theme({
  '&': {
    color: 'rgba(255, 255, 255, 0.87)',
    backgroundColor: '#1a1b1e',
    fontSize: '14px',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  '.cm-content': {
    caretColor: '#60a5fa',
    lineHeight: '1.6',
  },
  '.cm-cursor': {
    borderLeftColor: '#60a5fa',
    borderLeftWidth: '2px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
  },
  '.cm-gutters': {
    backgroundColor: '#27282b',
    color: 'rgba(255, 255, 255, 0.6)',
    border: 'none',
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  },
  '.cm-lineNumbers': {
    minWidth: '3em',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#2d2e32',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '3px',
  },
  '.cm-tooltip': {
    backgroundColor: '#27282b',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#2d2e32',
      color: 'rgba(255, 255, 255, 0.87)',
    },
  },
  '.cm-panels': {
    backgroundColor: '#27282b',
    color: 'rgba(255, 255, 255, 0.87)',
  },
  '.cm-panels-top': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  },
  '.cm-panels-bottom': {
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
  },
  '.cm-search': {
    padding: '4px 8px',
  },
  '.cm-searchMatch': {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
    outline: '1px solid rgba(96, 165, 250, 0.5)',
  },
  '.cm-searchMatch-selected': {
    backgroundColor: 'rgba(96, 165, 250, 0.4)',
  },
}, { dark: true });

// 深色语法高亮
export const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#ff7b72' },
  { tag: t.comment, color: '#8b949e', fontStyle: 'italic' },
  { tag: t.name, color: '#79c0ff' },
  { tag: t.variableName, color: '#ffa657' },
  { tag: t.propertyName, color: '#79c0ff' },
  { tag: t.typeName, color: '#79c0ff' },
  { tag: t.className, color: '#79c0ff' },
  { tag: t.special(t.brace), color: 'rgba(255, 255, 255, 0.87)' },
  { tag: t.number, color: '#79c0ff' },
  { tag: t.string, color: '#a5d6ff' },
  { tag: t.regexp, color: '#7ee787' },
  { tag: t.operator, color: '#ff7b72' },
  { tag: t.meta, color: '#d2a8ff' },
  { tag: t.heading, color: '#60a5fa', fontWeight: 'bold' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, color: '#58a6ff', textDecoration: 'underline' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.tagName, color: '#7ee787' },
  { tag: t.attributeName, color: '#ffa657' },
  { tag: t.attributeValue, color: '#a5d6ff' },
  { tag: t.processingInstruction, color: '#d2a8ff' },
]);

// 导出主题
export const lightEditorTheme = [
  lightTheme,
  syntaxHighlighting(lightHighlightStyle),
];

export const darkEditorTheme = [
  darkTheme,
  syntaxHighlighting(darkHighlightStyle),
];
