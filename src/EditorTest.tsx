import React, { useState } from 'react';
import { Box, Container, Typography, Paper, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { MarkdownEditorContainer } from './components/editor/MarkdownEditorContainer';

const initialMarkdown = `# Markdown编辑器测试

这是一个简单的Markdown编辑器测试页面。

## 功能特性

- 实时预览
- 语法高亮
- 自定义标题样式
- 字数统计
- PDF导出

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## 表格示例

| 功能 | 状态 | 备注 |
|------|------|------|
| 编辑器 | ✅ | 基于CodeMirror |
| 预览 | ✅ | 使用React-Markdown |
| 导出PDF | ✅ | 使用html2pdf |
| 字数统计 | ✅ | 支持中英文 |

> 这是一个引用块，用于测试样式渲染。

![示例图片](https://via.placeholder.com/800x400)

### 数学公式

$$
E = mc^2
$$

祝您使用愉快！
`;

const EditorTest: React.FC = () => {
  const [content, setContent] = useState(initialMarkdown);
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#5E6AD2',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Markdown编辑器测试页面
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            height: 'calc(100vh - 120px)', 
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <MarkdownEditorContainer 
            initialValue={content}
            onContentChange={setContent}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditorTest;
