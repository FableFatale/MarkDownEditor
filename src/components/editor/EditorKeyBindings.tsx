import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

// 定义Markdown编辑器的快捷键
export const editorKeymap = keymap.of([
  indentWithTab,
  {
    key: 'Mod-b',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      if (selectedText) {
        // 如果有选中文本，添加加粗标记
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `**${selectedText}**`
          },
          selection: { anchor: selection.from + 2, head: selection.to + 2 }
        });
      } else {
        // 如果没有选中文本，插入加粗标记并将光标放在中间
        view.dispatch({
          changes: {
            from: selection.from,
            insert: '****'
          },
          selection: { anchor: selection.from + 2, head: selection.from + 2 }
        });
      }
      return true;
    }
  },
  {
    key: 'Mod-i',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      if (selectedText) {
        // 如果有选中文本，添加斜体标记
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `*${selectedText}*`
          },
          selection: { anchor: selection.from + 1, head: selection.to + 1 }
        });
      } else {
        // 如果没有选中文本，插入斜体标记并将光标放在中间
        view.dispatch({
          changes: {
            from: selection.from,
            insert: '**'
          },
          selection: { anchor: selection.from + 1, head: selection.from + 1 }
        });
      }
      return true;
    }
  },
  {
    key: 'Mod-k',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      if (selectedText) {
        // 如果有选中文本，添加链接标记
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `[${selectedText}]()`
          },
          selection: { anchor: selection.to + 3, head: selection.to + 3 }
        });
      } else {
        // 如果没有选中文本，插入链接标记并将光标放在中间
        view.dispatch({
          changes: {
            from: selection.from,
            insert: '[]()'
          },
          selection: { anchor: selection.from + 1, head: selection.from + 1 }
        });
      }
      return true;
    }
  },
  {
    key: 'Mod-Alt-e',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      if (selectedText) {
        // 如果有选中文本，添加代码块标记
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `\`\`\`\n${selectedText}\n\`\`\``
          },
          selection: { anchor: selection.from + 4, head: selection.to + 4 }
        });
      } else {
        // 如果没有选中文本，插入代码块标记并将光标放在中间
        view.dispatch({
          changes: {
            from: selection.from,
            insert: '```\n\n```'
          },
          selection: { anchor: selection.from + 4, head: selection.from + 4 }
        });
      }
      return true;
    }
  },
  {
    key: 'Mod-Alt-t',
    run: (view) => {
      const selection = view.state.selection.main;
      
      // 插入表格模板
      const tableTemplate = `| 标题1 | 标题2 | 标题3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |`;
      
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: tableTemplate
        },
        selection: { anchor: selection.from, head: selection.from + tableTemplate.length }
      });
      
      return true;
    }
  },
  {
    key: 'Mod-Alt-h',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      // 插入标题
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: `# ${selectedText}`
        },
        selection: { anchor: selectedText ? selection.to + 2 : selection.from + 2, head: selectedText ? selection.to + 2 : selection.from + 2 }
      });
      
      return true;
    }
  },
  {
    key: 'Mod-Alt-l',
    run: (view) => {
      const selection = view.state.selection.main;
      const selectedText = view.state.sliceDoc(selection.from, selection.to);
      
      // 插入列表项
      const listTemplate = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- ';
      
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: listTemplate
        },
        selection: { anchor: selectedText ? selection.from + listTemplate.length : selection.from + 2, head: selectedText ? selection.from + listTemplate.length : selection.from + 2 }
      });
      
      return true;
    }
  }
]);

export default editorKeymap;
