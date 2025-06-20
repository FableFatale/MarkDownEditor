import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { useThemeContext } from './theme/ThemeContext';
import TailwindMarkdownEditor from './components/core/TailwindMarkdownEditor';
import { useAutoSave } from './hooks/useAutoSave';
import { AnimatedTransition } from './components/ui/AnimatedTransition';
import { motion } from 'framer-motion';

// TailwindCSS组件导入
import TailwindToolbarFixed from './components/toolbar/TailwindToolbarFixed';
import TailwindSaveStatus from './components/layout/TailwindSaveStatus';
import TailwindVersionHistory from './components/dialogs/TailwindVersionHistory';
import TailwindOutlineNavigator from './components/features/analysis/TailwindOutlineNavigator';
import TailwindSettingsDialog from './components/dialogs/TailwindSettingsDialog';
import TailwindSpellChecker from './components/features/analysis/TailwindSpellChecker';
import SEOAnalyzer from './components/features/seo/SEOAnalyzer';
import ImageCompressor from './components/features/media/ImageCompressor';
import SEOTestButton from './components/features/seo/SEOTestButton';
import SEOErrorBoundary from './components/features/seo/SEOErrorBoundary';
import { ModernBackground, MouseFollower } from './components/ui/FloatingElements';
import ModernCard from './components/ui/ModernCard';
import PWAStatus from './components/layout/PWAStatus';
// 开发环境下导入SEO测试工具
if (process.env.NODE_ENV === 'development') {
  import('./utils/seoTestUtils');
}

// 样式导入
import './tailwind.css';
import './markdown-styles.css';
import './katex-styles.css';

const TailwindAppContent: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();
  
  // 基本状态
  const [value, setValue] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能完整的现代化 Markdown 编辑器，使用 TailwindCSS 构建。

## 主要功能
- **实时预览** - 左右分屏实时渲染
- **多格式导出** - PDF、HTML、图片等格式
- **文章管理** - 分类、搜索、版本控制
- **大纲模式** - 基于标题的导航目录
- **封面生成** - 2.35:1比例封面图
- **拼写检查** - 实时拼写检查功能
- **自定义标题样式** - 多种标题样式可选

## 快捷键
- **Ctrl+B** - 粗体
- **Ctrl+I** - 斜体
- **Ctrl+S** - 手动保存
- **Ctrl+K** - 插入链接

> 💡 更多功能请查看工具栏的各个按钮和设置菜单

开始编写您的内容...`);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showSpellChecker, setShowSpellChecker] = useState(false);
  const [showSEOAnalyzer, setShowSEOAnalyzer] = useState(false);
  const [showImageCompressor, setShowImageCompressor] = useState(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);

  // 编辑器设置
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    lineHeight: 1.5,
    autoSave: true,
    showLineNumbers: true,
    wordWrap: true,
    editorWidth: 50,
    headingStyle: 'default' as 'default' | 'underline' | 'bordered' | 'gradient' | 'modern' | 'elegant'
  });

  // 预览区域引用
  const previewRef = useRef<HTMLDivElement>(null);

  // 自动保存功能
  const {
    saveState,
    versions,
    manualSave,
    restoreContent,
    saveVersion,
    restoreVersion,
    deleteVersion,
    clearAll
  } = useAutoSave(value, {
    key: 'tailwind-markdown-editor-content',
    debounceMs: 2000,
    maxVersions: 10,
    onSave: (content) => {
      console.log('Content auto-saved:', content.length, 'characters');
    },
    onRestore: (content) => {
      setValue(content);
      showNotification('内容已恢复', 'success');
    },
    onError: (error) => {
      showNotification(`保存失败: ${error}`, 'error');
    }
  });

  // 通知函数
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // 全屏切换
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 监听Ctrl+S快捷键进行手动保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        manualSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [manualSave]);

  // 格式化文本处理
  const handleFormatText = useCallback((format: string, options?: any) => {
    // 首先尝试使用编辑器的格式化功能
    if ((window as any).editorFormatText) {
      const success = (window as any).editorFormatText(format, options);
      if (success) {
        return;
      }
    }

    // 回退到简单的文本追加方案
    handleSimpleFormat(format, options);
  }, []);

  // 简单的格式化处理（回退方案）
  const handleSimpleFormat = useCallback((format: string, options?: any) => {
    let formatText = '';
    let needsNewLine = false;

    switch (format) {
      case 'bold':
        formatText = '**粗体文本**';
        break;
      case 'italic':
        formatText = '*斜体文本*';
        break;
      case 'quote':
        formatText = '> 引用文本';
        needsNewLine = true;
        break;
      case 'code':
        formatText = '```\n代码块\n```';
        needsNewLine = true;
        break;
      case 'link':
        formatText = '[链接文本](URL)';
        break;
      case 'image':
        formatText = '![图片描述](图片URL)';
        break;
      case 'custom-image':
        if (options?.imageUrl) {
          const altText = options.altText || '图片描述';
          formatText = `![${altText}](${options.imageUrl})`;
        } else {
          formatText = '![图片描述](图片URL)';
        }
        break;
      case 'table':
        formatText = '| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |';
        needsNewLine = true;
        break;
      case 'bullet-list':
        formatText = '- 列表项1\n- 列表项2\n- 列表项3';
        needsNewLine = true;
        break;
      case 'number-list':
        formatText = '1. 列表项1\n2. 列表项2\n3. 列表项3';
        needsNewLine = true;
        break;
      default:
        return;
    }

    // 智能插入：如果需要新行且当前内容不为空，则在前面添加换行
    const currentContent = value;
    const insertText = needsNewLine && currentContent && !currentContent.endsWith('\n')
      ? '\n' + formatText
      : formatText;

    setValue(prev => prev + insertText);
  }, [value]);

  // 处理版本历史
  const handleRestoreVersion = useCallback(async (versionId: string) => {
    try {
      await restoreVersion(versionId);
      showNotification('版本已恢复', 'success');
    } catch (error) {
      showNotification('版本恢复失败', 'error');
    }
  }, [restoreVersion, showNotification]);

  const handleDeleteVersion = useCallback(async (versionId: string) => {
    try {
      await deleteVersion(versionId);
      showNotification('版本已删除', 'success');
    } catch (error) {
      showNotification('版本删除失败', 'error');
    }
  }, [deleteVersion, showNotification]);

  const handleSaveVersion = useCallback(async (title?: string) => {
    try {
      await saveVersion(title);
      showNotification('版本已保存', 'success');
    } catch (error) {
      showNotification('版本保存失败', 'error');
    }
  }, [saveVersion, showNotification]);

  // 处理大纲点击
  const handleHeadingClick = useCallback((line: number) => {
    showNotification(`跳转到第 ${line} 行`, 'info');
  }, [showNotification]);

  const isDark = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 转换SaveState到简单的字符串状态
  const getSimpleSaveState = (): 'idle' | 'saving' | 'saved' | 'error' => {
    if (saveState.isSaving) return 'saving';
    if (saveState.error) return 'error';
    if (saveState.lastSaved && !saveState.hasUnsavedChanges) return 'saved';
    return 'idle';
  };

  // 转换版本格式
  const convertedVersions = versions.map(v => ({
    ...v,
    size: v.content.length
  }));

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* 现代化背景效果 */}
      <ModernBackground isDark={isDark} />

      {/* 鼠标跟随效果 */}
      <MouseFollower />

      <div className={`flex flex-col h-screen relative z-10 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* 工具栏 - 玻璃态效果 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <TailwindToolbarFixed
          content={value}
          isDark={isDark}
          isFullScreen={isFullScreen}
          onToggleTheme={toggleTheme}
          onToggleFullScreen={toggleFullScreen}
          onShowSettings={() => setShowSettings(true)}
          previewRef={previewRef}
          onFormatText={handleFormatText}
          saveState={getSimpleSaveState()}
          onManualSave={manualSave}
          onShowVersionHistory={() => setShowVersionHistory(true)}
          onToggleOutline={() => setShowOutline(!showOutline)}
          onShowSpellChecker={() => setShowSpellChecker(true)}
          onShowSEOAnalyzer={() => setShowSEOAnalyzer(true)}
          onShowImageCompressor={() => setShowImageCompressor(true)}
        />
        </motion.div>

        {/* 主编辑区域 */}
        <div className="flex-1 flex relative overflow-hidden p-4 gap-4">
          <ModernCard
            className="flex-1"
            glass={true}
            hover={false}
            glow={true}
          >
            <AnimatedTransition type="fade">
              <TailwindMarkdownEditor
                initialValue={value}
                onContentChange={setValue}
                className="h-full"
                previewRef={previewRef}
                onFormatText={handleFormatText}
                editorSettings={editorSettings}
                onSettingsChange={setEditorSettings}
              />
            </AnimatedTransition>
          </ModernCard>

          {/* 大纲导航器 - 现代化浮动效果 */}
          {showOutline && (
            <motion.div
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              className="absolute top-4 right-4 z-20 max-h-96 overflow-auto"
            >
              <ModernCard glass={true} glow={true} hover={false}>
                <TailwindOutlineNavigator
                  content={value}
                  onHeadingClick={handleHeadingClick}
                  onClose={() => setShowOutline(false)}
                />
              </ModernCard>
            </motion.div>
          )}
        </div>

        {/* 状态栏 - 玻璃态效果 */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-gray-700/20`}
        >
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TailwindSaveStatus saveState={getSimpleSaveState()} />
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <span className="inline-flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>字数: {value.trim().split(/\s+/).filter(Boolean).length}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                  <span>字符: {value.length}</span>
                </span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 设置对话框 */}
      {showSettings && (
        <TailwindSettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={editorSettings}
          onSettingsChange={setEditorSettings}
        />
      )}

      {/* 版本历史对话框 */}
      {showVersionHistory && (
        <TailwindVersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          versions={convertedVersions}
          onRestoreVersion={handleRestoreVersion}
          onDeleteVersion={handleDeleteVersion}
          onSaveVersion={handleSaveVersion}
          currentContent={value}
        />
      )}

      {/* 拼写检查器 */}
      {showSpellChecker && (
        <TailwindSpellChecker
          isOpen={showSpellChecker}
          onClose={() => setShowSpellChecker(false)}
          content={value}
          onCorrect={setValue}
        />
      )}

      {/* SEO分析器 */}
      {showSEOAnalyzer && (
        <SEOErrorBoundary>
          <SEOAnalyzer
            content={value}
            isOpen={showSEOAnalyzer}
            onClose={() => setShowSEOAnalyzer(false)}
          />
        </SEOErrorBoundary>
      )}

      {/* 图片压缩器 */}
      {showImageCompressor && (
        <ImageCompressor
          isOpen={showImageCompressor}
          onClose={() => setShowImageCompressor(false)}
          onImageInsert={(imageUrl, altText) => {
            const imageMarkdown = `![${altText || '图片描述'}](${imageUrl})`;
            setValue(prev => prev + '\n' + imageMarkdown);
            setShowImageCompressor(false);
            showNotification('图片已插入', 'success');
          }}
        />
      )}

      {/* PWA状态管理 */}
      <PWAStatus />

      {/* 开发环境下的SEO测试按钮 */}
      {process.env.NODE_ENV === 'development' && (
        <SEOErrorBoundary>
          <SEOTestButton />
        </SEOErrorBoundary>
      )}

      {/* 现代化通知系统 */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <ModernCard glass={true} glow={true} className="min-w-[300px]">
            <div className={`p-4 flex items-center space-x-3 ${
              notification.type === 'success' ? 'text-green-600 dark:text-green-400' :
              notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {/* 状态图标 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}
              >
                {notification.type === 'success' ? '✓' :
                 notification.type === 'error' ? '✕' : 'ℹ'}
              </motion.div>

              {/* 消息文本 */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {notification.message}
                </p>
              </motion.div>

              {/* 进度条 */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </ModernCard>
        </motion.div>
      )}
    </div>
  );
};

const TailwindApp: React.FC = () => {
  return (
    <ThemeProvider>
      <TailwindAppContent />
    </ThemeProvider>
  );
};

export default TailwindApp;
