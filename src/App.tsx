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

const App: React.FC = () => {
  // 基本状态
  const [value, setValue] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能完整的 Markdown 编辑器，支持：

## 功能特性

- **实时预览**：左右分屏实时预览
- **主题切换**：支持明暗主题
- **全屏模式**：专注写作体验
- **字数统计**：实时显示字数、字符数
- **设置系统**：完整的主题和布局设置

## 快捷键

- **Ctrl+B**：粗体
- **Ctrl+I**：斜体
- **Ctrl+K**：插入链接

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

开始使用这个强大的 Markdown 编辑器吧！`);

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 设置对话框状态
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
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

  // 设置处理函数
  const handleThemeSettings = () => {
    setThemeDialogOpen(true);
  };

  const handleLayoutSettings = () => {
    setLayoutDialogOpen(true);
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

  // 格式化文本处理
  const handleFormatText = (format: string) => {
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
            main: '#5E6AD2',
            light: '#8B8FE5',
            dark: '#4A4FB8',
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
          />

          {/* 使用新的MarkdownEditorContainer组件 */}
          <MarkdownEditorContainer
            initialValue={value}
            onContentChange={setValue}
            className="flex-1"
            previewRef={previewRef}
            onFormatText={handleFormatText}
          />
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
