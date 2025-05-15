import React, { useState, ReactNode, useEffect } from 'react';
import ModernToolbar from './ModernToolbar';
import { useThemeContext } from '../theme/ThemeContext';
import { Transition } from '@headlessui/react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface ModernLayoutProps {
  children: ReactNode;
  onFormatText?: (format: string) => void;
  onExport?: (format: string) => void;
  // 移除字数统计相关props
}

const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  onFormatText,
  onExport
}) => {
  const { theme } = useThemeContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 切换全屏模式
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
  };

  // 响应式布局处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 在移动设备上自动关闭侧边栏
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化时执行一次

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 处理全屏模式的键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc键退出全屏
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
      // F11键切换全屏
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, toggleFullscreen]);

  return (
    <div className={`h-screen flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-dark-800' : ''}`}>
      {/* 顶部工具栏 */}
      <ModernToolbar 
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onFormatText={onFormatText}
        onExport={onExport}
      />
      
      {/* 移动端菜单按钮 */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
        >
          {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏 - 移动端时隐藏 */}
        <Transition
          show={sidebarOpen}
          enter="transition-all duration-300"
          enterFrom="opacity-0 -translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all duration-300"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-full"
          className="fixed inset-0 z-40 md:hidden"
        >
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-dark-700 shadow-lg transform transition-transform">
            {/* 侧边栏内容 */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex justify-between items-center">
              <h3 className="text-lg font-medium">文档列表</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="space-y-2">
                <div className="p-2 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                  当前文档
                </div>
                <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer">
                  最近文档 1
                </div>
                <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer">
                  最近文档 2
                </div>
                <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer">
                  最近文档 3
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">分类</h4>
                <div className="space-y-1">
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    技术文章
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    学习笔记
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    项目文档
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        {/* 主内容区域 */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {children}
        </main>
      </div>

      {/* 底部状态栏 - 在ModernMarkdownEditor中实现，这里移除 */}
    </div>
  );
};

export default ModernLayout;