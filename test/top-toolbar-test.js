// 顶部工具栏测试
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TopToolbar from '../src/components/TopToolbar';
import { ThemeProvider } from '../src/theme/ThemeContext';

describe('TopToolbar', () => {
  test('显示格式化工具栏和功能按钮在同一行', () => {
    const mockFormatText = jest.fn();
    const mockExport = jest.fn();
    const mockToggleTheme = jest.fn();
    const mockToggleFullscreen = jest.fn();
    
    render(
      <ThemeProvider>
        <TopToolbar 
          onFormatText={mockFormatText}
          onExport={mockExport}
          onToggleTheme={mockToggleTheme}
          onToggleFullscreen={mockToggleFullscreen}
          wordCount={100}
          charCount={500}
          readingTime="2分钟"
        />
      </ThemeProvider>
    );
    
    // 验证格式化工具栏按钮显示
    expect(screen.getByTitle('粗体 (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByTitle('斜体 (Ctrl+I)')).toBeInTheDocument();
    expect(screen.getByTitle('引用 (Ctrl+Alt+Q)')).toBeInTheDocument();
    
    // 验证功能按钮显示
    expect(screen.getByText('导出')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
    
    // 验证字数统计显示
    expect(screen.getByText('100 词')).toBeInTheDocument();
    expect(screen.getByText('500 字符')).toBeInTheDocument();
    expect(screen.getByText('2分钟')).toBeInTheDocument();
  });
});
