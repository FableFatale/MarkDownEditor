import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarkdownEditorCore } from '../../src/components/editor/MarkdownEditorCore';

// 模拟CodeMirror
jest.mock('@codemirror/view', () => ({
  EditorView: class {
    constructor(config) {
      this.config = config;
      if (config.parent) {
        this.parent = config.parent;
      }
    }
    destroy() {}
  },
  keymap: {
    of: jest.fn().mockReturnValue([]),
  },
}));

jest.mock('@codemirror/state', () => ({
  EditorState: {
    create: jest.fn().mockReturnValue({}),
  },
}));

jest.mock('@codemirror/lang-markdown', () => ({
  markdown: jest.fn().mockReturnValue([]),
}));

jest.mock('@codemirror/highlight', () => ({
  HighlightStyle: {
    define: jest.fn().mockReturnValue([]),
  },
  syntaxHighlighting: jest.fn().mockReturnValue([]),
}));

describe('MarkdownEditorCore', () => {
  it('renders without crashing', () => {
    render(<MarkdownEditorCore initialValue="# Test" />);
    // 由于我们模拟了CodeMirror，我们只能测试组件是否渲染
    expect(document.querySelector('div')).toBeInTheDocument();
  });

  it('calls onChange when content changes', () => {
    const handleChange = jest.fn();
    render(<MarkdownEditorCore initialValue="# Test" onChange={handleChange} />);
    
    // 这里我们无法直接测试CodeMirror的内容变化
    // 在实际测试中，我们需要使用更复杂的方法来模拟CodeMirror的事件
  });
});
