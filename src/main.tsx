import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './theme/ThemeContext'

// 保留测试组件以备需要
import TestComponent from './TestComponent'
// 导入简单版Markdown编辑器
import SimpleMarkdownEditor from './SimpleMarkdownEditor'
// 导入基础版Markdown编辑器
import BasicEditor from './BasicEditor'
// 导入文章管理演示页面
import ArticleManagementDemo from './ArticleManagementDemo'
// 导入新的现代UI编辑器组件
import ModernMarkdownEditor from './ModernMarkdownEditor'
// 导入Tailwind CSS测试组件
import TailwindTest from './TailwindTest'
// 导入简单的Tailwind CSS测试组件
import SimpleTailwindTest from './SimpleTailwindTest'
// 导入最小化的Tailwind CSS测试组件
import MinimalTailwindTest from './MinimalTailwindTest'
// 导入简单的Tailwind CSS演示组件
import SimpleTailwindDemo from './SimpleTailwindDemo'
// 导入单行工具栏编辑器演示
import SingleRowEditorDemo from './SingleRowEditorDemo'
// 导入测试页面
import TestPage from './TestPage'
// 导入主应用组件
import App from './App'

// 导入主样式文件
import './styles/main.css'
// 导入其他CSS文件
import './markdown-styles.css'
import './modern-fonts.css'
import './katex-styles.css'

// 使用新版本的ReactDOM.createRoot方法
const rootElement = document.getElementById('root')
if (rootElement) {
  try {
    // 确保清除后备内容，但保留根元素
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }
    const root = ReactDOM.createRoot(rootElement)


// 使用条件渲染，根据URL参数决定显示哪个组件
const urlParams = new URLSearchParams(window.location.search);
const showTest = urlParams.has('test');
const showSimple = urlParams.has('simple');
const showBasic = urlParams.has('basic');
const showArticleManager = urlParams.has('articles');
const showModern = urlParams.has('modern');
const showTailwind = urlParams.has('tailwind');
const showSimpleTailwind = urlParams.has('simple-tailwind');
const showMinimalTailwind = urlParams.has('minimal-tailwind');
const showSimpleTailwindDemo = urlParams.has('simple-tailwind-demo');
const showSingleRow = urlParams.has('single-row');
const showTestPage = urlParams.has('test-page');

// 默认显示主应用程序
let componentToRender = <App />;

// 根据URL参数决定显示哪个组件
if (showTest) {
  componentToRender = <TestComponent />;
} else if (showSimple) {
  componentToRender = <SimpleMarkdownEditor />;
} else if (showBasic) {
  componentToRender = <BasicEditor />;
} else if (showModern) {
  componentToRender = (
    <ThemeProvider>
      <ModernMarkdownEditor />
    </ThemeProvider>
  );
} else if (showTailwind) {
  componentToRender = (
    <ThemeProvider>
      <TailwindTest />
    </ThemeProvider>
  );
} else if (showSimpleTailwind) {
  componentToRender = (
    <ThemeProvider>
      <SimpleTailwindTest />
    </ThemeProvider>
  );
} else if (showMinimalTailwind) {
  componentToRender = (
    <ThemeProvider>
      <MinimalTailwindTest />
    </ThemeProvider>
  );
} else if (showSimpleTailwindDemo) {
  componentToRender = (
    <ThemeProvider>
      <SimpleTailwindDemo />
    </ThemeProvider>
  );
} else if (showSingleRow) {
  componentToRender = <SingleRowEditorDemo />;
} else if (showTestPage) {
  componentToRender = <TestPage />;
} else if (showArticleManager) {
  componentToRender = <ArticleManagementDemo />;
}

    // 打印当前渲染的组件类型，用于调试
    console.log('当前渲染组件:',
      showTest ? 'TestComponent' :
      showSimple ? 'SimpleMarkdownEditor' :
      showBasic ? 'BasicEditor' :
      showArticleManager ? 'ArticleManagementDemo' :
      showTailwind ? 'TailwindTest' :
      showSimpleTailwind ? 'SimpleTailwindTest' :
      showMinimalTailwind ? 'MinimalTailwindTest' :
      showSimpleTailwindDemo ? 'SimpleTailwindDemo' :
      showSingleRow ? 'SingleRowEditorDemo' :
      showTestPage ? 'TestPage' :
      showModern ? 'ModernMarkdownEditor' :
      'App (默认主程序)'
    );

    root.render(
      <React.StrictMode>
        {componentToRender}
      </React.StrictMode>
    )
    console.log('React应用已成功渲染')
  } catch (error) {
    console.error('React应用渲染失败:', error)
    // 显示错误信息
    rootElement.innerHTML = `
      <div style="padding: 20px; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
        <h1 style="color: #d32f2f;">渲染错误</h1>
        <p>应用程序渲染时发生错误。请查看控制台获取更多信息。</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${error}</pre>
        <button onclick="location.reload()" style="padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">刷新页面</button>
      </div>
    `
  }
}