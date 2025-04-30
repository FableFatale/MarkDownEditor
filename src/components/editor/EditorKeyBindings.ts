import { keymap } from '@codemirror/view';
import { EditorState, Transaction } from '@codemirror/state';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

type KeymapCommand = (target: EditorState) => boolean | Transaction;

interface EditorCommand {
  key: string;
  run: KeymapCommand;
  preventDefault?: boolean;
}

// 在行首插入文本
const insertAtLineStart = (text: string): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;
    const line = state.doc.lineAt(selection.from);
    return state.update({
      changes: {
        from: line.from,
        to: line.from + line.text.match(/^[#>\-\d.]* */)?.[0].length || 0,
        insert: text,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('插入行首文本失败:', error);
    return false;
  }
};

// 切换内联样式
const toggleInlineStyle = (openMark: string, closeMark = openMark): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;
    const text = state.sliceDoc(selection.from, selection.to);
    const isStyled = text.startsWith(openMark) && text.endsWith(closeMark);

    return state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: isStyled
          ? text.slice(openMark.length, -closeMark.length)
          : `${openMark}${text}${closeMark}`,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('切换内联样式失败:', error);
    return false;
  }
};

// 插入块级元素
const insertBlock = (start: string, end: string): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;
    const text = state.sliceDoc(selection.from, selection.to);
    return state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: `${start}${text}${end}`,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('插入块级元素失败:', error);
    return false;
  }
};

// 定义所有快捷键命令
const markdownCommands: EditorCommand[] = [
  // 标题快捷键
  ...Array.from({ length: 6 }, (_, i) => ({
    key: `Ctrl-${i + 1}`,
    run: insertAtLineStart('#'.repeat(i + 1) + ' '),
    preventDefault: true
  })),

  // 文本样式快捷键
  { key: 'Ctrl-b', run: toggleInlineStyle('**'), preventDefault: true },
  { key: 'Ctrl-i', run: toggleInlineStyle('_'), preventDefault: true },
  { key: 'Ctrl-u', run: toggleInlineStyle('__'), preventDefault: true },
  { key: 'Ctrl-e', run: toggleInlineStyle('`'), preventDefault: true },
  { key: 'Ctrl-m', run: toggleInlineStyle('$'), preventDefault: true },
  { key: 'Ctrl-Alt-x', run: toggleInlineStyle('~~'), preventDefault: true },

  // 列表快捷键
  { key: 'Ctrl-Alt-u', run: insertAtLineStart('- '), preventDefault: true },
  { key: 'Ctrl-Alt-o', run: insertAtLineStart('1. '), preventDefault: true },

  // 其他元素快捷键
  { key: 'Ctrl-Alt-q', run: insertAtLineStart('> '), preventDefault: true },
  { key: 'Ctrl-Alt-e', run: insertBlock('```\n', '\n```'), preventDefault: true },
  { key: 'Ctrl-Alt-m', run: insertBlock('$$\n', '\n$$'), preventDefault: true },
  { key: 'Ctrl-Alt-h', run: insertBlock('\n---\n', ''), preventDefault: true },
];

// 导出统一的快捷键配置
export const editorKeymap = keymap.of([
  ...defaultKeymap,
  indentWithTab,
  ...markdownCommands
]);