import { keymap } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

interface ShortcutCommand {
  key: string;
  run: (state: EditorState) => boolean;
  preventDefault?: boolean;
}

const createMarkdownShortcuts = (): Extension => {
  const shortcuts: ShortcutCommand[] = [
    // 标题快捷键
    ...Array.from({ length: 6 }, (_, i) => ({
      key: `Ctrl-${i + 1}`,
      run: (state: EditorState) => {
        const prefix = '#'.repeat(i + 1);
        return insertAtLineStart(state, prefix + ' ');
      },
    })),

    // 文本样式快捷键
    {
      key: 'Ctrl-b',
      run: (state: EditorState) => wrapSelection(state, '**'),
    },
    {
      key: 'Ctrl-i',
      run: (state: EditorState) => wrapSelection(state, '_'),
    },
    {
      key: 'Ctrl-Alt-x',
      run: (state: EditorState) => wrapSelection(state, '~~'),
    },

    // 列表快捷键
    {
      key: 'Ctrl-Alt-u',
      run: (state: EditorState) => insertAtLineStart(state, '- '),
    },
    {
      key: 'Ctrl-Alt-o',
      run: (state: EditorState) => insertAtLineStart(state, '1. '),
    },

    // 其他元素快捷键
    {
      key: 'Ctrl-Alt-q',
      run: (state: EditorState) => insertAtLineStart(state, '> '),
    },
    {
      key: 'Ctrl-Alt-e',
      run: (state: EditorState) => insertBlock(state, '```\n', '\n```'),
    },
    {
      key: 'Ctrl-Alt-m',
      run: (state: EditorState) => insertBlock(state, '$\n', '\n$'),
    },
    {
      key: 'Ctrl-Alt-h',
      run: (state: EditorState) => insertLine(state, '---'),
    },
  ];

  return keymap.of([
    ...defaultKeymap,
    indentWithTab,
    ...shortcuts.map(({ key, run, preventDefault = true }) => ({
      key,
      run,
      preventDefault,
    })),
  ]);
};

// 辅助函数
const insertAtLineStart = (state: EditorState, text: string): boolean => {
  const { from, to } = state.selection.main;
  const line = state.doc.lineAt(from);
  const pos = line.from;
  return insertAt(state, pos, text);
};

const wrapSelection = (state: EditorState, wrapper: string): boolean => {
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);
  return insertAt(state, from, `${wrapper}${selectedText}${wrapper}`);
};

const insertBlock = (state: EditorState, start: string, end: string): boolean => {
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);
  return insertAt(state, from, `${start}${selectedText}${end}`);
};

const insertLine = (state: EditorState, text: string): boolean => {
  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);
  return insertAt(state, line.to, `\n${text}\n`);
};

const insertAt = (state: EditorState, pos: number, text: string): boolean => {
  if (state.readOnly) return false;
  state.update({
    changes: { from: pos, insert: text },
    scrollIntoView: true,
  });
  return true;
};

export default createMarkdownShortcuts;