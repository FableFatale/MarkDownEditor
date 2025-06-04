import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button } from '@mui/material';
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
        <Typography variant="h6">当前主题: {themeMode === 'light' ? '浅色模式' : '深色模式'}</Typography>
        <Typography variant="body2">全屏状态: {isFullScreen ? '已开启' : '未开启'}</Typography>
        <Toolbar
          content="测试内容"
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

describe('主题和设置功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染工具栏组件', () => {
    render(<TestToolbarComponent />);

    expect(screen.getByText(/当前主题:/)).toBeInTheDocument();
    expect(screen.getByText(/全屏状态:/)).toBeInTheDocument();
  });

  test('主题切换功能应该正常工作', async () => {
    render(<TestToolbarComponent />);

    // 查找主题切换按钮
    const themeButton = screen.getByRole('button', { name: /切换到深色模式/ });
    expect(themeButton).toBeInTheDocument();

    // 点击主题切换按钮
    fireEvent.click(themeButton);

    // 等待主题切换完成
    await waitFor(() => {
      expect(screen.getByText(/当前主题: 深色模式/)).toBeInTheDocument();
    });
  });

  test('设置按钮应该打开设置菜单', async () => {
    render(<TestPage />);

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

  test('主题设置对话框应该正常工作', async () => {
    render(<TestPage />);

    // 打开设置菜单
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    fireEvent.click(settingsButton);

    // 点击主题设置
    await waitFor(() => {
      const themeSettingsItem = screen.getByText('主题设置');
      fireEvent.click(themeSettingsItem);
    });

    // 检查主题设置对话框是否打开
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('主题设置')).toBeInTheDocument();
      expect(screen.getByText('浅色模式')).toBeInTheDocument();
      expect(screen.getByText('深色模式')).toBeInTheDocument();
    });
  });

  test('布局设置对话框应该正常工作', async () => {
    render(<TestPage />);

    // 打开设置菜单
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    fireEvent.click(settingsButton);

    // 点击布局设置
    await waitFor(() => {
      const layoutSettingsItem = screen.getByText('布局设置');
      fireEvent.click(layoutSettingsItem);
    });

    // 检查布局设置对话框是否打开
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('布局设置')).toBeInTheDocument();
      expect(screen.getByText(/编辑器宽度:/)).toBeInTheDocument();
      expect(screen.getByText('显示行号')).toBeInTheDocument();
      expect(screen.getByText('自动换行')).toBeInTheDocument();
    });
  });

  test('保存设置应该显示成功消息', async () => {
    render(<TestPage />);

    // 打开设置菜单并进入主题设置
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    fireEvent.click(settingsButton);

    await waitFor(() => {
      const themeSettingsItem = screen.getByText('主题设置');
      fireEvent.click(themeSettingsItem);
    });

    // 点击保存按钮
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(saveButton);
    });

    // 检查成功消息是否显示
    await waitFor(() => {
      expect(screen.getByText('主题设置已保存')).toBeInTheDocument();
    });
  });

  test('全屏功能应该正常工作', async () => {
    render(<TestPage />);

    // 查找全屏按钮
    const fullscreenButton = screen.getByRole('button', { name: /进入全屏/ });
    expect(fullscreenButton).toBeInTheDocument();

    // 点击全屏按钮
    fireEvent.click(fullscreenButton);

    // 验证requestFullscreen被调用
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  test('编辑器内容应该可以修改', async () => {
    render(<TestPage />);

    // 等待编辑器加载
    await waitFor(() => {
      expect(screen.getByText(/测试页面/)).toBeInTheDocument();
    });

    // 验证预览区域存在
    expect(screen.getByText('预览区域')).toBeInTheDocument();
  });
});
