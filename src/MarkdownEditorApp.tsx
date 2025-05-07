import React, { useState } from 'react';
import { Box, Container, Typography, Paper, ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { MarkdownEditorContainer } from './components/editor/MarkdownEditorContainer';
import { Menu as MenuIcon, DarkMode, LightMode, Save, PictureAsPdf } from '@mui/icons-material';
import './markdown-styles.css';
import './modern-fonts.css';
import './katex-styles.css';

const initialMarkdown = `# 欢迎使用 Markdown 编辑器

这是一个功能强大的Markdown编辑器，支持实时预览、语法高亮、自定义样式等功能。

## 功能特性

- **实时预览**：边写边看，所见即所得
- **语法高亮**：代码块自动高亮显示
- **自定义标题样式**：多种标题样式可选
- **字数统计**：实时统计字数、字符数
- **PDF导出**：一键导出为PDF文档

## 快捷键支持

| 功能 | 快捷键 |
|------|------|
| 加粗 | Ctrl+B |
| 斜体 | Ctrl+I |
| 插入链接 | Ctrl+K |
| 插入代码块 | Ctrl+Alt+E |
| 插入表格 | Ctrl+Alt+T |

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

> 这是一个引用块，用于测试样式渲染。

### 数学公式支持

$$
E = mc^2
$$

祝您使用愉快！
`;

const MarkdownEditorApp: React.FC = () => {
  const [content, setContent] = useState(initialMarkdown);
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5E6AD2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Markdown编辑器
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button 
              color="primary" 
              startIcon={<Save />}
              sx={{ ml: 1 }}
            >
              保存
            </Button>
            <Button 
              color="primary" 
              startIcon={<PictureAsPdf />}
              sx={{ ml: 1 }}
            >
              导出PDF
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ flex: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              flex: 1, 
              overflow: 'hidden',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MarkdownEditorContainer 
              initialValue={content}
              onContentChange={setContent}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MarkdownEditorApp;
