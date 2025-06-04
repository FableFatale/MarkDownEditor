import { useCallback, useRef } from 'react';

export interface EditorFormatOptions {
  onContentChange?: (content: string) => void;
}

export const useEditorFormat = (options: EditorFormatOptions = {}) => {
  const editorViewRef = useRef<any>(null);

  // 设置编辑器视图引用
  const setEditorView = useCallback((view: any) => {
    editorViewRef.current = view;
  }, []);

  // 获取当前选中的文本和位置信息
  const getSelectionInfo = useCallback(() => {
    const view = editorViewRef.current;
    if (!view) return null;

    const { state } = view;
    const { selection } = state;
    const { main } = selection;
    
    return {
      from: main.from,
      to: main.to,
      selectedText: state.doc.sliceString(main.from, main.to),
      isEmpty: main.empty
    };
  }, []);

  // 在指定位置插入文本
  const insertText = useCallback((text: string, from?: number, to?: number) => {
    const view = editorViewRef.current;
    if (!view) return false;

    const { state } = view;
    const { selection } = state;
    
    const insertFrom = from ?? selection.main.from;
    const insertTo = to ?? selection.main.to;

    const transaction = state.update({
      changes: {
        from: insertFrom,
        to: insertTo,
        insert: text
      },
      selection: {
        anchor: insertFrom + text.length
      }
    });

    view.dispatch(transaction);
    view.focus();
    
    // 触发内容变化回调
    const newContent = transaction.state.doc.toString();
    options.onContentChange?.(newContent);
    
    return true;
  }, [options]);

  // 包装选中的文本
  const wrapSelection = useCallback((before: string, after: string, placeholder?: string) => {
    const selectionInfo = getSelectionInfo();
    if (!selectionInfo) return false;

    const { from, to, selectedText, isEmpty } = selectionInfo;
    
    if (isEmpty && placeholder) {
      // 没有选中文本时，插入占位符
      const text = before + placeholder + after;
      insertText(text, from, to);
      
      // 选中占位符文本
      const view = editorViewRef.current;
      if (view) {
        const newSelection = {
          anchor: from + before.length,
          head: from + before.length + placeholder.length
        };
        view.dispatch({
          selection: newSelection
        });
      }
    } else {
      // 有选中文本时，包装选中的文本
      const text = before + selectedText + after;
      insertText(text, from, to);
    }
    
    return true;
  }, [getSelectionInfo, insertText]);

  // 在行首插入文本
  const insertAtLineStart = useCallback((prefix: string) => {
    const view = editorViewRef.current;
    if (!view) return false;

    const { state } = view;
    const { selection } = state;
    const line = state.doc.lineAt(selection.main.from);
    
    const transaction = state.update({
      changes: {
        from: line.from,
        to: line.from,
        insert: prefix
      },
      selection: {
        anchor: line.from + prefix.length
      }
    });

    view.dispatch(transaction);
    view.focus();
    
    const newContent = transaction.state.doc.toString();
    options.onContentChange?.(newContent);
    
    return true;
  }, [options]);

  // 插入图片的函数
  const insertImage = useCallback((imageUrl: string, altText?: string) => {
    const alt = altText || '图片描述';
    const imageMarkdown = `![${alt}](${imageUrl})`;
    return insertText(imageMarkdown);
  }, [insertText]);

  // 格式化文本的主要函数
  const formatText = useCallback((format: string, options?: any) => {
    switch (format) {
      case 'bold':
        return wrapSelection('**', '**', '粗体文本');

      case 'italic':
        return wrapSelection('*', '*', '斜体文本');

      case 'quote':
        return insertAtLineStart('> ');

      case 'code':
        const selectionInfo = getSelectionInfo();
        if (selectionInfo && !selectionInfo.isEmpty) {
          return wrapSelection('```\n', '\n```');
        } else {
          return insertText('```\n代码块\n```');
        }

      case 'link':
        return wrapSelection('[', '](URL)', '链接文本');

      case 'image':
        return wrapSelection('![', '](图片URL)', '图片描述');

      case 'custom-image':
        if (options?.imageUrl) {
          return insertImage(options.imageUrl, options.altText);
        }
        return false;

      case 'table':
        const tableText = '| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |';
        return insertText('\n' + tableText + '\n');

      case 'bullet-list':
        return insertAtLineStart('- ');

      case 'number-list':
        return insertAtLineStart('1. ');

      default:
        return false;
    }
  }, [wrapSelection, insertAtLineStart, insertText, getSelectionInfo, insertImage]);

  return {
    setEditorView,
    formatText,
    insertText,
    insertImage,
    wrapSelection,
    insertAtLineStart,
    getSelectionInfo
  };
};
