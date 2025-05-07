import React from 'react';
import { render, screen } from '@testing-library/react';
import WordCounter from '../../src/components/WordCounter';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// 创建测试主题
const theme = createTheme();

// 包装组件以提供主题
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('WordCounter', () => {
  it('displays zero counts for empty text', () => {
    renderWithTheme(<WordCounter text="" />);
    
    expect(screen.getByText('字数：0')).toBeInTheDocument();
    expect(screen.getByText('字符：0')).toBeInTheDocument();
    expect(screen.getByText('预计阅读：< 1分钟')).toBeInTheDocument();
  });

  it('correctly counts English words', () => {
    const text = 'This is a test sentence with ten words in it.';
    renderWithTheme(<WordCounter text={text} />);
    
    expect(screen.getByText('字数：10')).toBeInTheDocument();
  });

  it('correctly counts Chinese characters', () => {
    const text = '这是一个中文测试句子。';
    renderWithTheme(<WordCounter text={text} />);
    
    // 中文每个字符算一个字
    expect(screen.getByText('字数：9')).toBeInTheDocument();
  });

  it('correctly counts mixed Chinese and English text', () => {
    const text = '这是 a mixed 中英文 sentence with 一些 Chinese characters.';
    renderWithTheme(<WordCounter text={text} />);
    
    // 应该计算中文字符数加英文单词数
    // 中文字符：这是、中英文、一些 (7个字符)
    // 英文单词：a, mixed, sentence, with, Chinese, characters (6个单词)
    // 总计：13
    expect(screen.getByText('字数：13')).toBeInTheDocument();
  });

  it('ignores Markdown syntax when counting', () => {
    const text = '# 标题\n\n**粗体文本** 和 *斜体文本*\n\n- 列表项1\n- 列表项2';
    renderWithTheme(<WordCounter text={text} />);
    
    // 应该忽略Markdown语法，只计算实际文本
    // 标题、粗体文本、和、斜体文本、列表项1、列表项2
    expect(screen.getByText(/字数：\d+/)).toBeInTheDocument();
    // 不应该包含#、**、*、-等Markdown语法字符
    const charCountElement = screen.getByText(/字符：\d+/);
    const charCount = parseInt(charCountElement.textContent.match(/\d+/)[0]);
    expect(charCount).toBeLessThan(text.length);
  });

  it('calculates reading time based on word count', () => {
    // 创建一个较长的文本，应该需要超过1分钟阅读
    const longChineseText = '中文'.repeat(400); // 800个中文字符，按300字/分钟计算，应该需要约2-3分钟
    renderWithTheme(<WordCounter text={longChineseText} />);
    
    // 不应该显示"< 1分钟"
    expect(screen.queryByText('预计阅读：< 1分钟')).not.toBeInTheDocument();
    // 应该显示具体的分钟数
    expect(screen.getByText(/预计阅读：\d+分钟/)).toBeInTheDocument();
  });
});
