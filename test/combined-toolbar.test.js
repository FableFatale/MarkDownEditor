// 测试合并工具栏
import React from 'react';
import { render, screen } from '@testing-library/react';
import CombinedToolbar from '../src/components/CombinedToolbar';

// 模拟 ThemeContext
jest.mock('../src/theme/ThemeContext', () => ({
  useThemeContext: () => ({
    theme: { mode: 'light' },
    toggleTheme: jest.fn()
  }),
  ThemeContextProvider: ({ children }) => <div>{children}</div>
}));

// 包装组件以提供主题上下文
const WrappedCombinedToolbar = (props) => (
  <ThemeContextProvider>
    <CombinedToolbar {...props} />
  </ThemeContextProvider>
);

describe('CombinedToolbar', () => {
  test('应该显示字数统计和预计阅读时间', () => {
    render(
      <WrappedCombinedToolbar
        wordCount={100}
        charCount={500}
        readingTime="2分钟"
      />
    );

    // 检查页面上是否存在字数统计
    const wordCountElement = screen.getByText('100 词');
    expect(wordCountElement).toBeInTheDocument();

    // 检查页面上是否存在字符统计
    const charCountElement = screen.getByText('500 字符');
    expect(charCountElement).toBeInTheDocument();

    // 检查页面上是否存在预计阅读时间
    const readingTimeElement = screen.getByText('预计阅读: 2分钟');
    expect(readingTimeElement).toBeInTheDocument();
  });

  test('应该显示格式化按钮', () => {
    const handleFormatText = jest.fn();
    render(<WrappedCombinedToolbar onFormatText={handleFormatText} />);

    // 检查是否存在粗体按钮
    const boldButton = screen.getByTitle('粗体 (Ctrl+B)');
    expect(boldButton).toBeInTheDocument();

    // 检查是否存在斜体按钮
    const italicButton = screen.getByTitle('斜体 (Ctrl+I)');
    expect(italicButton).toBeInTheDocument();

    // 检查是否存在链接按钮
    const linkButton = screen.getByTitle('链接 (Ctrl+K)');
    expect(linkButton).toBeInTheDocument();
  });
});
