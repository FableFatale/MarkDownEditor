import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  Snackbar,
  Alert,
  Button,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Toolbar from './components/Toolbar';
import { MarkdownEditorContainer } from './components/editor/MarkdownEditorContainer';
import { useAutoSave } from './hooks/useAutoSave';
import SaveStatusIndicator from './components/SaveStatusIndicator';
import VersionHistory from './components/VersionHistory';
import OutlineNavigator from './components/OutlineNavigator';

const App: React.FC = () => {
  // 基本状态
  const [value, setValue] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能完整的现代化 Markdown 编辑器。

## 主要功能
- **实时预览** - 左右分屏实时渲染
- **多格式导出** - PDF、HTML、图片等格式
- **文章管理** - 分类、搜索、版本控制
- **大纲模式** - 基于标题的导航目录
- **封面生成** - 2.35:1比例封面图

## 快捷键
- **Ctrl+B** - 粗体
- **Ctrl+I** - 斜体
- **Ctrl+S** - 手动保存

> 💡 更多功能请查看工具栏的各个按钮和设置菜单 → 使用说明

开始编写您的内容...`);

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 设置对话框状态
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [outlineVisible, setOutlineVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 主题设置状态
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [autoSave, setAutoSave] = useState(true);

  // 布局设置状态
  const [editorWidth, setEditorWidth] = useState(50);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);

  // 预览区域引用，用于PDF导出
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
    key: 'markdown-editor-content',
    debounceMs: 2000,
    maxVersions: 10,
    onSave: (content) => {
      console.log('Content auto-saved:', content.length, 'characters');
    },
    onRestore: (content) => {
      setValue(content);
      setSnackbarMessage('内容已恢复');
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(`保存失败: ${error}`);
      setSnackbarOpen(true);
    }
  });

  // 主题切换
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // 全屏切换
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

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

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  // 应用主题到文档根元素
  useEffect(() => {
    const isDark = themeMode === 'dark';
    document.documentElement.setAttribute('data-theme', themeMode);

    // 为Tailwind深色模式添加/移除dark类
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 添加统一主题类
    document.documentElement.classList.add('unified-theme');
  }, [themeMode]);

  // 设置处理函数
  const handleThemeSettings = () => {
    setThemeDialogOpen(true);
  };

  const handleLayoutSettings = () => {
    setLayoutDialogOpen(true);
  };

  const handleVersionHistory = () => {
    setVersionHistoryOpen(true);
  };

  const handleVersionHistoryClose = () => {
    setVersionHistoryOpen(false);
  };

  const handleToggleOutline = () => {
    setOutlineVisible(!outlineVisible);
  };

  const handleHeadingClick = (line: number) => {
    // 这里可以实现跳转到指定行的功能
    // 目前先显示一个提示
    setSnackbarMessage(`跳转到第 ${line} 行`);
    setSnackbarOpen(true);
  };

  const handleArticleManage = () => {
    setSnackbarMessage('文章管理功能已打开');
    setSnackbarOpen(true);
  };

  const handleArticleEdit = (articleId: string) => {
    // 这里可以实现加载指定文章的功能
    setSnackbarMessage(`正在编辑文章: ${articleId}`);
    setSnackbarOpen(true);
  };

  const handleArticleCreate = () => {
    // 创建新文章
    setValue('# 新文章\n\n开始编写您的内容...');
    setSnackbarMessage('已创建新文章');
    setSnackbarOpen(true);
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await restoreVersion(versionId);
      setSnackbarMessage('版本已恢复');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('版本恢复失败');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    try {
      await deleteVersion(versionId);
      setSnackbarMessage('版本已删除');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('版本删除失败');
      setSnackbarOpen(true);
    }
  };

  const handleSaveVersion = async (title?: string) => {
    try {
      await saveVersion(title);
      setSnackbarMessage('版本已保存');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('版本保存失败');
      setSnackbarOpen(true);
    }
  };

  const handleThemeDialogClose = () => {
    setThemeDialogOpen(false);
  };

  const handleLayoutDialogClose = () => {
    setLayoutDialogOpen(false);
  };

  const handleSaveThemeSettings = () => {
    setSnackbarMessage('主题设置已保存');
    setSnackbarOpen(true);
    setThemeDialogOpen(false);
  };

  const handleSaveLayoutSettings = () => {
    setSnackbarMessage('布局设置已保存');
    setSnackbarOpen(true);
    setLayoutDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 格式化文本处理 - 支持真正的编辑器联动
  const handleFormatText = (format: string, options?: any) => {
    // 首先尝试使用编辑器的格式化功能
    if ((window as any).editorFormatText) {
      const success = (window as any).editorFormatText(format, options);
      if (success) {
        return; // 如果编辑器格式化成功，直接返回
      }
    }

    // 回退到简单的文本追加方案
    handleSimpleFormat(format, options);
  };

  // 简单的格式化处理（回退方案）
  const handleSimpleFormat = (format: string, options?: any) => {
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
  };

  // 主题配置
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#0969DA',
            light: '#60A5FA',
            dark: '#0550AE',
          },
          background: {
            default: themeMode === 'light' ? '#FFFFFF' : '#1A1B1E',
            paper: themeMode === 'light' ? '#F7F8FA' : '#27282B',
          },
          text: {
            primary: themeMode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
            secondary: themeMode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          },
        },
        components: {
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                  transform: 'translateY(-1px)',
                },
              },
            },
          },
        },
      }),
    [themeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box
          className={`editor-container ${isFullScreen ? 'fullscreen' : ''}`}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            height: '100vh',
            position: 'relative',
            boxShadow: themeMode === 'light' ? '0 2px 12px rgba(0, 0, 0, 0.1)' : '0 2px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease-in-out',
            mx: 'auto',
            my: 1,
            maxWidth: '1600px',
            width: '100%',
            '&.fullscreen': {
              maxHeight: '100vh',
              maxWidth: '100vw',
              mx: 0,
              my: 0,
              borderRadius: 0
            }
          }}
        >
          {/* 集成工具栏到编辑器内部 */}
          <Toolbar
            content={value}
            themeMode={themeMode}
            isFullScreen={isFullScreen}
            onToggleTheme={toggleTheme}
            onToggleFullScreen={toggleFullScreen}
            onThemeSettings={handleThemeSettings}
            onLayoutSettings={handleLayoutSettings}
            previewRef={previewRef}
            onFormatText={handleFormatText}
            saveState={saveState}
            onManualSave={manualSave}
            onVersionHistory={handleVersionHistory}
            onToggleOutline={handleToggleOutline}
            onHeadingClick={handleHeadingClick}
            onArticleManage={handleArticleManage}
            onArticleEdit={handleArticleEdit}
            onArticleCreate={handleArticleCreate}
          />

          {/* 主编辑区域 */}
          <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
            {/* 使用新的MarkdownEditorContainer组件 */}
            <MarkdownEditorContainer
              initialValue={value}
              onContentChange={setValue}
              className="flex-1"
              previewRef={previewRef}
              onFormatText={handleFormatText}
            />

            {/* 大纲导航器 */}
            {outlineVisible && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1000,
                  maxHeight: 'calc(100vh - 200px)',
                  overflow: 'auto'
                }}
              >
                <OutlineNavigator
                  content={value}
                  onHeadingClick={handleHeadingClick}
                  isVisible={outlineVisible}
                  onToggleVisibility={handleToggleOutline}
                  onClose={() => setOutlineVisible(false)}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* 主题设置对话框 */}
        <Dialog open={themeDialogOpen} onClose={handleThemeDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>主题设置</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">主题模式</FormLabel>
                <RadioGroup
                  value={themeMode}
                  onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark')}
                >
                  <FormControlLabel value="light" control={<Radio />} label="浅色模式" />
                  <FormControlLabel value="dark" control={<Radio />} label="深色模式" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>字体大小: {fontSize}px</Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, value) => setFontSize(value as number)}
                  min={12}
                  max={20}
                  step={1}
                  marks
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>行高: {lineHeight}</Typography>
                <Slider
                  value={lineHeight}
                  onChange={(_, value) => setLineHeight(value as number)}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  marks
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                }
                label="自动保存"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleThemeDialogClose}>取消</Button>
            <Button onClick={handleSaveThemeSettings} variant="contained">保存</Button>
          </DialogActions>
        </Dialog>

        {/* 布局设置对话框 */}
        <Dialog open={layoutDialogOpen} onClose={handleLayoutDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>布局设置</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>编辑器宽度: {editorWidth}%</Typography>
                <Slider
                  value={editorWidth}
                  onChange={(_, value) => setEditorWidth(value as number)}
                  min={30}
                  max={70}
                  step={5}
                  marks
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                  />
                }
                label="显示行号"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                  />
                }
                label="自动换行"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLayoutDialogClose}>取消</Button>
            <Button onClick={handleSaveLayoutSettings} variant="contained">保存</Button>
          </DialogActions>
        </Dialog>

        {/* 版本历史对话框 */}
        <VersionHistory
          open={versionHistoryOpen}
          onClose={handleVersionHistoryClose}
          versions={versions}
          onRestoreVersion={handleRestoreVersion}
          onDeleteVersion={handleDeleteVersion}
          onSaveVersion={handleSaveVersion}
          currentContent={value}
        />

        {/* 消息提示 */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;
