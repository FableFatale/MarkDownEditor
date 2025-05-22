// 工具栏功能测试
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnifiedToolbar from '../src/components/UnifiedToolbar';
import { ThemeProvider } from '../src/theme/ThemeContext';

describe('UnifiedToolbar', () => {
  test('显示字数统计和功能按钮', () => {
    const mockFormatText = jest.fn();
    const mockExport = jest.fn();
    const mockToggleTheme = jest.fn();
    const mockToggleFullscreen = jest.fn();
    
    render(
      <ThemeProvider>
        <UnifiedToolbar 
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
    
    // 验证字数统计显示
    expect(screen.getByText('100 词')).toBeInTheDocument();
    expect(screen.getByText('500 字符')).toBeInTheDocument();
    expect(screen.getByText('2分钟')).toBeInTheDocument();
    
    // 验证功能按钮显示
    expect(screen.getByText('导出')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
  });
});
