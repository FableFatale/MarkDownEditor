import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Toolbar from '../src/components/Toolbar';

// 创建测试主题
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// 测试工具栏功能
describe('Toolbar Functionality Tests', () => {
  const mockToggleTheme = jest.fn();
  const mockToggleFullScreen = jest.fn();
  const testContent = '# 测试内容\n\n这是一个测试文档。';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该渲染工具栏组件', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Toolbar
          content={testContent}
          themeMode="light"
          isFullScreen={false}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 检查字数统计是否显示
    expect(screen.getByText(/字数/)).toBeInTheDocument();
  });

  test('主题切换按钮应该正常工作', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Toolbar
          content={testContent}
          themeMode="light"
          isFullScreen={false}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 查找主题切换按钮
    const themeButton = screen.getByRole('button', { name: /切换到深色模式/ });
    expect(themeButton).toBeInTheDocument();

    // 点击主题切换按钮
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('全屏切换按钮应该正常工作', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Toolbar
          content={testContent}
          themeMode="light"
          isFullScreen={false}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 查找全屏切换按钮
    const fullscreenButton = screen.getByRole('button', { name: /进入全屏/ });
    expect(fullscreenButton).toBeInTheDocument();

    // 点击全屏切换按钮
    fireEvent.click(fullscreenButton);
    expect(mockToggleFullScreen).toHaveBeenCalledTimes(1);
  });

  test('设置按钮应该打开设置菜单', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Toolbar
          content={testContent}
          themeMode="light"
          isFullScreen={false}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 查找设置按钮
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    expect(settingsButton).toBeInTheDocument();

    // 点击设置按钮
    fireEvent.click(settingsButton);

    // 检查设置菜单是否出现
    expect(screen.getByText('浅色模式')).toBeInTheDocument();
    expect(screen.getByText('全屏模式')).toBeInTheDocument();
  });

  test('深色模式下应该显示正确的图标', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <Toolbar
          content={testContent}
          themeMode="dark"
          isFullScreen={false}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 在深色模式下，应该显示切换到浅色模式的按钮
    const themeButton = screen.getByRole('button', { name: /切换到浅色模式/ });
    expect(themeButton).toBeInTheDocument();
  });

  test('全屏模式下应该显示正确的图标', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Toolbar
          content={testContent}
          themeMode="light"
          isFullScreen={true}
          onToggleTheme={mockToggleTheme}
          onToggleFullScreen={mockToggleFullScreen}
        />
      </ThemeProvider>
    );

    // 在全屏模式下，应该显示退出全屏的按钮
    const fullscreenButton = screen.getByRole('button', { name: /退出全屏/ });
    expect(fullscreenButton).toBeInTheDocument();
  });
});
