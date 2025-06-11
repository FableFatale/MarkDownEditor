import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// OneDarkPro 主题颜色配置
const oneDarkProColors = {
  // 背景色
  background: '#282c34',
  foreground: '#abb2bf',
  
  // 编辑器背景
  editorBackground: '#21252b',
  editorForeground: '#abb2bf',
  
  // 选择和光标
  selection: '#3e4451',
  cursor: '#528bff',
  
  // 行号
  lineNumber: '#495162',
  activeLineNumber: '#abb2bf',
  
  // 语法高亮
  comment: '#5c6370',
  keyword: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  function: '#61afef',
  variable: '#e06c75',
  type: '#e5c07b',
  operator: '#56b6c2',
  punctuation: '#abb2bf',
  
  // UI 元素
  gutter: '#21252b',
  gutterBorder: '#181a1f',
  activeLine: '#2c313c',
  matchingBracket: '#515a6b',
  
  // 搜索
  searchMatch: '#e5c07b',
  searchMatchSelected: '#ff7b72',
};

// 创建 OneDarkPro 主题
export const oneDarkPro: Extension = [
  EditorView.theme({
    '&': {
      color: oneDarkProColors.foreground,
      backgroundColor: oneDarkProColors.background,
    },
    
    '.cm-content': {
      caretColor: oneDarkProColors.cursor,
      backgroundColor: oneDarkProColors.editorBackground,
    },
    
    '.cm-focused .cm-cursor': {
      borderLeftColor: oneDarkProColors.cursor,
    },
    
    '.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: oneDarkProColors.selection,
    },
    
    '.cm-panels': {
      backgroundColor: oneDarkProColors.background,
      color: oneDarkProColors.foreground,
    },
    
    '.cm-panels.cm-panels-top': {
      borderBottom: `2px solid ${oneDarkProColors.gutterBorder}`,
    },
    
    '.cm-panels.cm-panels-bottom': {
      borderTop: `2px solid ${oneDarkProColors.gutterBorder}`,
    },
    
    '.cm-searchMatch': {
      backgroundColor: oneDarkProColors.searchMatch,
      color: oneDarkProColors.background,
    },
    
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: oneDarkProColors.searchMatchSelected,
    },
    
    '.cm-activeLine': {
      backgroundColor: oneDarkProColors.activeLine,
    },
    
    '.cm-selectionMatch': {
      backgroundColor: '#99ff7780',
    },
    
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: oneDarkProColors.matchingBracket,
      outline: 'none',
    },
    
    '.cm-gutters': {
      backgroundColor: oneDarkProColors.gutter,
      color: oneDarkProColors.lineNumber,
      border: 'none',
    },
    
    '.cm-activeLineGutter': {
      backgroundColor: oneDarkProColors.activeLine,
      color: oneDarkProColors.activeLineNumber,
    },
    
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: oneDarkProColors.comment,
    },
    
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: oneDarkProColors.background,
      color: oneDarkProColors.foreground,
    },
    
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: oneDarkProColors.background,
      borderBottomColor: oneDarkProColors.background,
    },
    
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: oneDarkProColors.selection,
        color: oneDarkProColors.foreground,
      },
    },
  }, { dark: true }),
  
  syntaxHighlighting(HighlightStyle.define([
    { tag: t.comment, color: oneDarkProColors.comment, fontStyle: 'italic' },
    { tag: t.lineComment, color: oneDarkProColors.comment, fontStyle: 'italic' },
    { tag: t.blockComment, color: oneDarkProColors.comment, fontStyle: 'italic' },
    { tag: t.docComment, color: oneDarkProColors.comment, fontStyle: 'italic' },
    
    { tag: t.keyword, color: oneDarkProColors.keyword },
    { tag: t.controlKeyword, color: oneDarkProColors.keyword },
    { tag: t.modifier, color: oneDarkProColors.keyword },
    { tag: t.operatorKeyword, color: oneDarkProColors.operator },
    
    { tag: t.variableName, color: oneDarkProColors.variable },
    { tag: t.typeName, color: oneDarkProColors.type },
    { tag: t.tagName, color: oneDarkProColors.variable },
    { tag: t.propertyName, color: oneDarkProColors.function },
    
    { tag: t.function(t.variableName), color: oneDarkProColors.function },
    { tag: t.function(t.propertyName), color: oneDarkProColors.function },
    
    { tag: t.number, color: oneDarkProColors.number },
    { tag: t.string, color: oneDarkProColors.string },
    { tag: t.regexp, color: oneDarkProColors.string },
    { tag: t.escape, color: oneDarkProColors.operator },
    
    { tag: t.operator, color: oneDarkProColors.operator },
    { tag: t.derefOperator, color: oneDarkProColors.operator },
    { tag: t.arithmeticOperator, color: oneDarkProColors.operator },
    { tag: t.logicOperator, color: oneDarkProColors.operator },
    { tag: t.bitwiseOperator, color: oneDarkProColors.operator },
    { tag: t.compareOperator, color: oneDarkProColors.operator },
    { tag: t.updateOperator, color: oneDarkProColors.operator },
    { tag: t.definitionOperator, color: oneDarkProColors.operator },
    
    { tag: t.punctuation, color: oneDarkProColors.punctuation },
    { tag: t.separator, color: oneDarkProColors.punctuation },
    { tag: t.bracket, color: oneDarkProColors.punctuation },
    { tag: t.angleBracket, color: oneDarkProColors.punctuation },
    { tag: t.squareBracket, color: oneDarkProColors.punctuation },
    { tag: t.paren, color: oneDarkProColors.punctuation },
    { tag: t.brace, color: oneDarkProColors.punctuation },
    
    { tag: t.heading, color: oneDarkProColors.variable, fontWeight: 'bold' },
    { tag: t.heading1, color: oneDarkProColors.variable, fontWeight: 'bold', fontSize: '1.2em' },
    { tag: t.heading2, color: oneDarkProColors.function, fontWeight: 'bold', fontSize: '1.1em' },
    { tag: t.heading3, color: oneDarkProColors.type, fontWeight: 'bold' },
    { tag: t.heading4, color: oneDarkProColors.keyword, fontWeight: 'bold' },
    { tag: t.heading5, color: oneDarkProColors.operator, fontWeight: 'bold' },
    { tag: t.heading6, color: oneDarkProColors.comment, fontWeight: 'bold' },
    
    { tag: t.emphasis, fontStyle: 'italic' },
    { tag: t.strong, fontWeight: 'bold' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
    { tag: t.link, color: oneDarkProColors.function, textDecoration: 'underline' },
    { tag: t.url, color: oneDarkProColors.string },
    
    { tag: t.list, color: oneDarkProColors.operator },
    { tag: t.quote, color: oneDarkProColors.comment, fontStyle: 'italic' },
    { tag: t.monospace, color: oneDarkProColors.string, fontFamily: 'monospace' },
    
    { tag: t.invalid, color: '#ff6c6b', textDecoration: 'underline' },
  ])),
];

export default oneDarkPro;
