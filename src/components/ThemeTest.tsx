import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { MarkdownPreview } from './editor/MarkdownPreview';

const testMarkdown = `# 主题测试

这是一个测试深色模式的页面。

## 代码块测试

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 内联代码测试

这是一个 \`内联代码\` 示例。

## 引用测试

> 这是一个引用块
> 用来测试深色模式下的显示效果

## 表格测试

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 测试1 | 测试2 | 测试3 |

## Mermaid 图表测试

\`\`\`mermaid
graph TD
    A[开始] --> B[处理]
    B --> C[结束]
\`\`\`
`;

export const ThemeTest: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

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
            主题测试页面
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
            切换开关来测试深色/浅色模式的效果。
          </Typography>
        </Paper>

        <Paper sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}>
          <Typography variant="h5" gutterBottom>
            Markdown 预览测试
          </Typography>
          
          <Box sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 2,
            backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF'
          }}>
            <MarkdownPreview 
              content={testMarkdown}
              className={isDark ? 'dark' : ''}
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ThemeTest;
