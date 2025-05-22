import React, { useState, ReactNode, useEffect } from 'react';
import CombinedToolbar from './CombinedToolbar';
import { useThemeContext } from '../theme/ThemeContext';
import { Transition } from '@headlessui/react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface ModernLayoutProps {
  children: ReactNode;
  onFormatText?: (format: string) => void;
  onExport?: (format: string) => void;
  wordCount?: number;
  charCount?: number;
  readingTime?: string;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  onFormatText,
  onExport,
  wordCount = 0,
  charCount = 0,
  readingTime = '0分钟'
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
    <div className={`h-screen flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800' : ''}`}>
      {/* 顶部工具栏 */}
      <CombinedToolbar
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onFormatText={onFormatText}
        onExport={onExport}
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
      />

      {/* 移动端菜单按钮 */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
          aria-label={sidebarOpen ? "关闭菜单" : "打开菜单"}
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
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-lg transform transition-transform overflow-hidden" style={{ top: 0 }}>
            {/* 侧边栏内容 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">文档列表</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="关闭侧边栏"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-60px)]">
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">最近文档</h4>
                  <div className="p-2 rounded-md bg-primary-50 text-primary-700 dark:text-primary-300 font-medium" style={{ backgroundColor: 'rgba(240, 244, 255, 0.9)' }}>
                    当前文档
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    最近文档 1
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    最近文档 2
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    最近文档 3
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">分类</h4>
                  <div className="space-y-1">
                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center transition-colors">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      技术文章
                    </div>
                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center transition-colors">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      学习笔记
                    </div>
                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                      项目文档
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full py-2 px-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                  新建文档
                </button>
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