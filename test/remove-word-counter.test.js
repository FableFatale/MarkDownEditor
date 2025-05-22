// 测试移除顶部字数统计和预计阅读时间
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarkdownEditorContainer } from '../src/components/editor/MarkdownEditorContainer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// 创建一个模拟主题
const theme = createTheme();

// 包装组件以提供主题上下文
const WrappedMarkdownEditorContainer = ({ initialValue = '' }) => (
  <ThemeProvider theme={theme}>
    <MarkdownEditorContainer initialValue={initialValue} />
  </ThemeProvider>
);

describe('MarkdownEditorContainer', () => {
  test('不应该显示顶部的字数统计和预计阅读时间', () => {
    render(<WrappedMarkdownEditorContainer initialValue="测试内容" />);
    
    // 检查页面上是否不存在"字数："文本
    const wordCountElement = screen.queryByText(/字数：/);
    expect(wordCountElement).toBeNull();
    
    // 检查页面上是否不存在"字符："文本
    const charCountElement = screen.queryByText(/字符：/);
    expect(charCountElement).toBeNull();
    
    // 检查页面上是否不存在"预计阅读："文本
    const readingTimeElement = screen.queryByText(/预计阅读：/);
    expect(readingTimeElement).toBeNull();
  });
});
