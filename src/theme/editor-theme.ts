import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// 亮色主题
export const lightTheme = EditorView.theme({
  '&': {
    color: '#24292f',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  '.cm-content': {
    caretColor: '#24292f',
    lineHeight: '1.6',
  },
  '.cm-cursor': {
    borderLeftColor: '#24292f',
    borderLeftWidth: '2px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#6e7781',
    border: 'none',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
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

// 导出亮色主题
export const lightEditorTheme = [
  lightTheme,
  syntaxHighlighting(lightHighlightStyle),
];
