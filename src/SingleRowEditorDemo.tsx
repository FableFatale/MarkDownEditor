import React from 'react';
import SingleRowEditor from './components/SingleRowEditor';
import { ThemeProvider } from './theme/ThemeContext';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const initialContent = `# 单行工具栏 Markdown 编辑器

这是一个将所有工具栏功能合并到一行的现代化 Markdown 编辑器。

## 功能特性

- **统一工具栏**：所有功能都集中在顶部一行
- **格式化工具**：粗体、斜体、引用、代码等
- **标题工具**：H1、H2、H3 快速插入
- **列表支持**：有序和无序列表
- **插入功能**：链接、图片、表格
- **导出选项**：支持多种格式导出
- **实时预览**：左右分屏实时预览
- **主题切换**：支持明暗主题
- **全屏模式**：专注写作体验
- **字数统计**：实时显示字数、字符数和阅读时间

## 使用说明

1. 在左侧编辑器中输入 Markdown 内容
2. 右侧会实时显示预览效果
3. 使用顶部工具栏快速插入格式
4. 拖拽中间分隔条调整编辑器和预览区域大小
5. 点击导出按钮选择导出格式

## 快捷键

- **Ctrl+B**：粗体
- **Ctrl+I**：斜体
- **Ctrl+K**：插入链接
- **Ctrl+Alt+Q**：引用
- **Ctrl+Alt+U**：无序列表
- **Ctrl+Alt+O**：有序列表

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 表格示例

| 功能 | 描述 | 状态 |
|------|------|------|
| 格式化 | 文本格式化工具 | ✅ |
| 预览 | 实时预览 | ✅ |
| 导出 | 多格式导出 | ✅ |
| 主题 | 明暗主题切换 | ✅ |

## 数学公式

行内公式：$E = mc^2$

块级公式：
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

> 这是一个引用示例，展示了引用文本的样式。

---

开始使用这个强大的 Markdown 编辑器吧！`;

const SingleRowEditorDemo: React.FC = () => {
  // 创建Material-UI主题
  const muiTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeProvider>
        <div className="h-screen">
          <SingleRowEditor
            initialValue={initialContent}
            onContentChange={(content) => {
              console.log('Content changed:', content.length, 'characters');
            }}
          />
        </div>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default SingleRowEditorDemo;
