import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  TextField,
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack, DarkMode, LightMode } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import './markdown-styles.css';

const SimpleMarkdownEditor: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [markdownContent, setMarkdownContent] = useState<string>('# 欢迎使用 Markdown 编辑器\n\n如果您看到此页面，说明React应用已正确加载。\n\n## 使用说明\n\n在左侧输入Markdown格式的文本，右侧会实时显示渲染后的效果。\n\n### 示例\n\n- 这是一个列表项\n- 这是另一个列表项\n\n**粗体文本** 和 *斜体文本*\n\n```\n// 这是代码块\nconsole.log("Hello, Markdown!");\n```');

  // 创建主题
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      background: {
        default: themeMode === 'light' ? '#f5f5f5' : '#121212',
        paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
  });

  // 切换主题
  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // 返回首页
  const handleReturn = () => {
    window.history.back();
  };

  // 初始化主题
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDarkMode ? 'dark' : 'light');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Markdown编辑器
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={handleReturn}
            >
              返回页面
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          p: 2,
          gap: 2,
          overflow: 'hidden'
        }}>
          {/* 编辑区域 */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Typography variant="subtitle1" sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              编辑
            </Typography>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  '& textarea': {
                    height: '100% !important',
                    overflow: 'auto'
                  },
                  '& fieldset': {
                    border: 'none'
                  }
                }
              }}
            />
          </Paper>

          {/* 预览区域 */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Typography variant="subtitle1" sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              预览
            </Typography>
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflow: 'auto',
                '& img': {
                  maxWidth: '100%'
                }
              }}
              className={`markdown-body ${themeMode === 'dark' ? 'dark' : ''}`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {markdownContent}
              </ReactMarkdown>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SimpleMarkdownEditor;
