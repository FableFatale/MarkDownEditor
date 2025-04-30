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

// 插入链接
const insertLink = (): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;
    const text = state.sliceDoc(selection.from, selection.to);

    return state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: text ? `[${text}](url)` : `[链接文字](url)`,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('插入链接失败:', error);
    return false;
  }
};

// 插入图片
const insertImage = (): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;

    return state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: `![图片描述](图片URL)`,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('插入图片失败:', error);
    return false;
  }
};

// 插入表格
const insertTable = (): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const selection = state.selection.main;
    const tableTemplate = `
| 标题1 | 标题2 | 标题3 |
| ----- | ----- | ----- |
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`;

    return state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: tableTemplate,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('插入表格失败:', error);
    return false;
  }
};

// 将微信外链转为脚注
const convertWechatLinksToFootnotes = (): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const doc = state.doc.toString();

    // 匹配微信外链格式
    const wechatLinkRegex = /\[(.*?)\]\((https?:\/\/mp\.weixin\.qq\.com\/[^\)]+)\)/g;
    let match;
    let footnotes = '';
    let newDoc = doc;
    let footnoteIndex = 1;

    // 收集所有匹配项
    const matches = [];
    while ((match = wechatLinkRegex.exec(doc)) !== null) {
      matches.push({
        full: match[0],
        text: match[1],
        url: match[2],
        index: footnoteIndex++
      });
    }

    // 替换链接为脚注引用
    matches.forEach(m => {
      newDoc = newDoc.replace(m.full, `${m.text}[^${m.index}]`);
      footnotes += `[^${m.index}]: ${m.url}\n`;
    });

    // 如果有脚注，添加到文档末尾
    if (footnotes) {
      newDoc = newDoc + '\n\n' + footnotes;
    }

    // 如果没有变化，返回false
    if (newDoc === doc) return false;

    return state.update({
      changes: {
        from: 0,
        to: state.doc.length,
        insert: newDoc,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('转换微信外链失败:', error);
    return false;
  }
};

// 格式化文档
const formatDocument = (): KeymapCommand => (state) => {
  try {
    if (state.readOnly) return false;
    const doc = state.doc.toString();

    // 简单的Markdown格式化规则
    let formattedDoc = doc
      // 确保标题前后有空行
      .replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2')
      .replace(/(#{1,6} .*)\n([^\n])/g, '$1\n\n$2')
      // 确保列表项之间没有空行，但列表前后有空行
      .replace(/([^\n])\n(- |\d+\. )/g, '$1\n\n$2')
      .replace(/((- |\d+\. ).*)\n\n((- |\d+\. ))/g, '$1\n$3')
      // 确保代码块前后有空行
      .replace(/([^\n])\n```/g, '$1\n\n```')
      .replace(/```\n([^\n])/g, '```\n\n$1')
      // 确保引用块前后有空行
      .replace(/([^\n])\n>/g, '$1\n\n>')
      .replace(/(>.*)\n([^>\n])/g, '$1\n\n$2')
      // 删除连续的空行，最多保留两个
      .replace(/\n{3,}/g, '\n\n');

    // 如果没有变化，返回false
    if (formattedDoc === doc) return false;

    return state.update({
      changes: {
        from: 0,
        to: state.doc.length,
        insert: formattedDoc,
      },
      scrollIntoView: true
    });
  } catch (error) {
    console.error('格式化文档失败:', error);
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
  { key: 'Ctrl-k', run: insertLink(), preventDefault: true },
  { key: 'Ctrl-Alt-i', run: insertImage(), preventDefault: true },
  { key: 'Ctrl-Alt-t', run: insertTable(), preventDefault: true },
  { key: 'Ctrl-Alt-l', run: convertWechatLinksToFootnotes(), preventDefault: true },
  { key: 'Ctrl-Alt-f', run: formatDocument(), preventDefault: true },
];

// 导出统一的快捷键配置
export const editorKeymap = keymap.of([
  ...defaultKeymap,
  indentWithTab,
  ...markdownCommands
]);