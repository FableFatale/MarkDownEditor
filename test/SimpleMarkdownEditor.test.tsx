import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleMarkdownEditor from '../src/SimpleMarkdownEditor';

// 模拟window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; }
  };
};

// 模拟window.history.back
const mockHistoryBack = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    ...window.history,
    back: mockHistoryBack
  }
});

describe('SimpleMarkdownEditor', () => {
  beforeEach(() => {
    mockHistoryBack.mockClear();
  });

  test('renders the editor title', () => {
    render(<SimpleMarkdownEditor />);
    const titleElement = screen.getByText(/Markdown编辑器/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the editor and preview sections', () => {
    render(<SimpleMarkdownEditor />);
    const editorLabel = screen.getByText(/编辑/i);
    const previewLabel = screen.getByText(/预览/i);
    expect(editorLabel).toBeInTheDocument();
    expect(previewLabel).toBeInTheDocument();
  });

  test('updates preview when editing markdown', () => {
    render(<SimpleMarkdownEditor />);
    const textarea = screen.getByRole('textbox');
    
    // 清除文本框并输入新内容
    fireEvent.change(textarea, { target: { value: '# 测试标题' } });
    
    // 检查预览区域是否更新
    const previewHeading = screen.getByText('测试标题');
    expect(previewHeading).toBeInTheDocument();
    expect(previewHeading.tagName).toBe('H1');
  });

  test('back button calls history.back', () => {
    render(<SimpleMarkdownEditor />);
    const backButton = screen.getByText(/返回页面/i);
    
    fireEvent.click(backButton);
    
    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });
});
