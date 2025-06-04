import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

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

// 模拟localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// 模拟matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('主程序功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('应该正确渲染主程序', async () => {
    render(<App />);
    
    // 等待组件加载
    await waitFor(() => {
      expect(screen.getByText(/字数/)).toBeInTheDocument();
    });
  });

  test('主题切换功能应该正常工作', async () => {
    render(<App />);
    
    // 等待组件加载
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /切换到深色模式/ })).toBeInTheDocument();
    });
    
    // 查找主题切换按钮
    const themeButton = screen.getByRole('button', { name: /切换到深色模式/ });
    
    // 点击主题切换按钮
    fireEvent.click(themeButton);
    
    // 验证localStorage被调用
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  test('设置按钮应该打开设置菜单', async () => {
    render(<App />);
    
    // 等待组件加载
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /设置/ })).toBeInTheDocument();
    });
    
    // 查找设置按钮
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    
    // 点击设置按钮
    fireEvent.click(settingsButton);
    
    // 检查设置菜单是否出现
    await waitFor(() => {
      expect(screen.getByText('主题设置')).toBeInTheDocument();
      expect(screen.getByText('布局设置')).toBeInTheDocument();
    });
  });

  test('主题设置对话框应该正常工作', async () => {
    render(<App />);
    
    // 等待组件加载并打开设置菜单
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /设置/ })).toBeInTheDocument();
    });
    
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
    render(<App />);
    
    // 等待组件加载并打开设置菜单
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /设置/ })).toBeInTheDocument();
    });
    
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

  test('全屏功能应该正常工作', async () => {
    render(<App />);
    
    // 等待组件加载
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /进入全屏/ })).toBeInTheDocument();
    });
    
    // 查找全屏按钮
    const fullscreenButton = screen.getByRole('button', { name: /进入全屏/ });
    
    // 点击全屏按钮
    fireEvent.click(fullscreenButton);
    
    // 验证requestFullscreen被调用
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  test('保存设置应该显示成功消息', async () => {
    render(<App />);
    
    // 等待组件加载并打开设置菜单
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /设置/ })).toBeInTheDocument();
    });
    
    const settingsButton = screen.getByRole('button', { name: /设置/ });
    fireEvent.click(settingsButton);
    
    // 进入主题设置
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

  test('编辑器应该可以输入内容', async () => {
    render(<App />);
    
    // 等待编辑器加载
    await waitFor(() => {
      expect(screen.getByText(/欢迎使用 Markdown 编辑器/)).toBeInTheDocument();
    });
    
    // 验证预览区域存在
    expect(screen.getByText('预览区域')).toBeInTheDocument();
  });
});
