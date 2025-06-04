import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import Toolbar from '../src/components/Toolbar';

// 模拟全屏API
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
});

Object.defineProperty(document, 'exitFullscreen', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

Object.defineProperty(document.documentElement, 'requestFullscreen', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

// 创建测试组件
const TestToolbarComponent: React.FC = () => {
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const handleThemeSettings = () => {
    console.log('主题设置');
  };

  const handleLayoutSettings = () => {
    console.log('布局设置');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Typography variant="h6" data-testid="theme-status">
          当前主题: {themeMode === 'light' ? '浅色模式' : '深色模式'}
        </Typography>
        <Typography variant="body2" data-testid="fullscreen-status">
          全屏状态: {isFullScreen ? '已开启' : '未开启'}
        </Typography>
        <Toolbar
          content="测试内容，这是一个用于测试的Markdown文档。"
          themeMode={themeMode}
          isFullScreen={isFullScreen}
          onToggleTheme={toggleTheme}
          onToggleFullScreen={toggleFullScreen}
          onThemeSettings={handleThemeSettings}
          onLayoutSettings={handleLayoutSettings}
        />
      </Box>
    </ThemeProvider>
  );
};

describe('工具栏功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染工具栏组件', () => {
    render(<TestToolbarComponent />);
    
    expect(screen.getByTestId('theme-status')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-status')).toBeInTheDocument();
    expect(screen.getByText(/字数/)).toBeInTheDocument();
  });

  test('主题切换功能应该正常工作', async () => {
    render(<TestToolbarComponent />);
    
    // 初始状态应该是浅色模式
    expect(screen.getByText('当前主题: 浅色模式')).toBeInTheDocument();
    
    // 查找主题切换按钮
    const themeButton = screen.getByRole('button', { name: /切换到深色模式/ });
    expect(themeButton).toBeInTheDocument();
    
    // 点击主题切换按钮
    fireEvent.click(themeButton);
    
    // 等待主题切换完成
    await waitFor(() => {
      expect(screen.getByText('当前主题: 深色模式')).toBeInTheDocument();
    });
  });

  test('全屏切换功能应该正常工作', async () => {
    render(<TestToolbarComponent />);
    
    // 初始状态应该是未全屏
    expect(screen.getByText('全屏状态: 未开启')).toBeInTheDocument();
    
    // 查找全屏按钮
    const fullscreenButton = screen.getByRole('button', { name: /进入全屏/ });
    expect(fullscreenButton).toBeInTheDocument();
    
    // 点击全屏按钮
    fireEvent.click(fullscreenButton);
    
    // 等待状态更新
    await waitFor(() => {
      expect(screen.getByText('全屏状态: 已开启')).toBeInTheDocument();
    });
  });

  test('设置按钮应该打开设置菜单', async () => {
    render(<TestToolbarComponent />);
    
    // 查找设置按钮
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    expect(settingsButton).toBeInTheDocument();
    
    // 点击设置按钮
    fireEvent.click(settingsButton);
    
    // 检查设置菜单是否出现
    await waitFor(() => {
      expect(screen.getByText('主题设置')).toBeInTheDocument();
      expect(screen.getByText('布局设置')).toBeInTheDocument();
    });
  });

  test('字数统计应该显示正确的信息', () => {
    render(<TestToolbarComponent />);
    
    // 验证字数统计存在
    expect(screen.getByText(/字数/)).toBeInTheDocument();
    expect(screen.getByText(/字符/)).toBeInTheDocument();
  });

  test('工具栏按钮应该有正确的提示文本', () => {
    render(<TestToolbarComponent />);
    
    // 验证按钮的提示文本
    expect(screen.getByRole('button', { name: /切换到深色模式/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /进入全屏/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /设置/ })).toBeInTheDocument();
  });

  test('深色模式下按钮文本应该正确更新', async () => {
    render(<TestToolbarComponent />);
    
    // 切换到深色模式
    const themeButton = screen.getByRole('button', { name: /切换到深色模式/ });
    fireEvent.click(themeButton);
    
    // 等待更新完成
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /切换到浅色模式/ })).toBeInTheDocument();
    });
  });

  test('全屏模式下按钮文本应该正确更新', async () => {
    render(<TestToolbarComponent />);
    
    // 切换到全屏模式
    const fullscreenButton = screen.getByRole('button', { name: /进入全屏/ });
    fireEvent.click(fullscreenButton);
    
    // 等待更新完成
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /退出全屏/ })).toBeInTheDocument();
    });
  });
});
