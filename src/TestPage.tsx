import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  Typography,
  Button,
  Paper,
  alpha,
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
  Alert
} from '@mui/material';
import Toolbar from './components/Toolbar';
import { MarkdownEditorContainer } from './components/editor/MarkdownEditorContainer';

const TestPage: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isFullScreen, setIsFullScreen] = useState(false);
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
  const [content, setContent] = useState(`# 测试页面

这是一个测试页面，用于验证以下功能：

## 1. 深色模式预览
切换到深色模式，预览区域应该也变成深色背景。

## 2. 全屏功能
点击全屏按钮，应该能够进入和退出全屏模式。

## 3. 设置按钮
点击齿轮图标，应该显示设置菜单。

## 测试内容

### 代码块测试
\`\`\`javascript
function test() {
  console.log('Hello World');
}
\`\`\`

### 表格测试
| 功能 | 状态 | 备注 |
|------|------|------|
| 深色模式 | ✅ | 预览区域正确响应主题 |
| 全屏模式 | ✅ | 按钮功能正常 |
| 设置菜单 | ✅ | 齿轮按钮有反应 |

### 引用测试
> 这是一个引用块，用于测试深色模式下的样式。

### 列表测试
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3
`);

  // 使用与主程序相同的主题配置
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
        transitions: {
          duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
          },
          easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
          },
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(12px)',
                backgroundColor: alpha(themeMode === 'light' ? '#FFFFFF' : '#1A1B1E', 0.85),
                borderBottom: `1px solid ${themeMode === 'light' ? '#E5E7EB' : '#2D2E32'}`,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                gap: '6px',
                '& .MuiIconButton-root': {
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  margin: '0 2px',
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                },
                '& .MuiButton-root': {
                  borderRadius: 6,
                  textTransform: 'none',
                  fontWeight: 500,
                  height: 28,
                  minWidth: 80,
                  padding: '0 12px',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                width: 28,
                height: 28,
                padding: '4px',
                color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.08),
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.12),
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                minWidth: 80,
                height: 28,
                padding: '0 12px',
                fontSize: '0.875rem',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                },
              },
            },
          },
        },
      }),
    [themeMode, isFullScreen],
  );

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

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

  // 监听全屏状态变化
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 测试信息 */}
        <Paper
          sx={{
            p: 2,
            m: 2,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            功能测试页面
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            当前主题: {themeMode === 'light' ? '浅色模式' : '深色模式'} |
            全屏状态: {isFullScreen ? '已开启' : '未开启'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={toggleTheme}
            >
              切换主题
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? '退出全屏' : '进入全屏'}
            </Button>
          </Box>
        </Paper>

        {/* 工具栏 */}
        <Toolbar
          content={content}
          themeMode={themeMode}
          isFullScreen={isFullScreen}
          onToggleTheme={toggleTheme}
          onToggleFullScreen={toggleFullScreen}
          onThemeSettings={handleThemeSettings}
          onLayoutSettings={handleLayoutSettings}
        />

        {/* 编辑器容器 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            mx: 2,
            mb: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <MarkdownEditorContainer
            initialValue={content}
            onContentChange={setContent}
            className="flex-1"
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

export default TestPage;
