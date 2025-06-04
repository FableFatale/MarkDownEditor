import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography } from '@mui/material';

// 简单的测试组件
const SimpleComponent: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <Typography variant="h1">测试组件</Typography>
    </ThemeProvider>
  );
};

describe('简单测试', () => {
  test('应该渲染测试组件', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('测试组件')).toBeInTheDocument();
  });

  test('基本数学运算', () => {
    expect(2 + 2).toBe(4);
  });

  test('字符串测试', () => {
    expect('hello world').toContain('world');
  });
});
