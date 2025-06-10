import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { LargeFileEditor } from './LargeFileEditor';

const testContent = `# 编辑器主题测试

这是一个测试编辑器深色模式的页面。

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return "测试中文字符";
}
\`\`\`

## Markdown 语法测试

- **粗体文本**
- *斜体文本*
- \`内联代码\`

### 引用测试

> 这是一个引用块
> 用来测试编辑器的显示效果

### 列表测试

1. 第一项
2. 第二项
3. 第三项

### 链接测试

[这是一个链接](https://example.com)

### 表格测试

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
`;

export const EditorThemeTest: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [content, setContent] = useState(testContent);

  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#5E6AD2',
      },
      background: {
        default: isDark ? '#1A1B1E' : '#FFFFFF',
        paper: isDark ? '#27282B' : '#F7F8FA',
      },
      text: {
        primary: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
        secondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
  });

  // 应用主题到文档根元素
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // 为Tailwind深色模式添加/移除dark类
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'background.default',
        color: 'text.primary',
        p: 3 
      }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            编辑器主题测试页面
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={(e) => setIsDark(e.target.checked)}
              />
            }
            label={`当前模式: ${isDark ? '深色' : '浅色'}`}
          />
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            切换开关来测试编辑器深色/浅色模式的效果。
          </Typography>
        </Paper>

        <Paper sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          height: '600px'
        }}>
          <Typography variant="h5" gutterBottom>
            编辑器测试
          </Typography>
          
          <Box sx={{ 
            height: '500px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <LargeFileEditor
              content={content}
              onChange={setContent}
              theme={isDark ? 'dark' : 'light'}
              height="100%"
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EditorThemeTest;
