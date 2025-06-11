# 📝 现代化 Markdown 编辑器 (TailwindCSS 版本)

一个功能完整的现代化 Markdown 编辑器，使用 TailwindCSS 构建，支持实时预览、多格式导出、文章管理等功能。

## 🎨 UI 框架统一

**已完成 UI 框架统一为 TailwindCSS**：
- ✅ 移除 Material-UI 依赖
- ✅ 统一使用 TailwindCSS 样式系统
- ✅ 集成 framer-motion 动画效果
- ✅ 使用 Heroicons 图标库
- ✅ 完整的深色/浅色主题支持

## 已实现功能
- ✅ Markdown语法高亮
- ✅ 实时预览与编辑
- ✅ 全屏专注模式


## 待实现功能
- ⌛ 快捷键支持
- ⌛ 文章分类管理
- ⌛ 本地存储功能
- ⌛ 响应式布局设计
- ⌛ 代码块语法高亮
- ⌛ 表格支持
- ⌛ 大纲导航
- ⌛ 文件的打开和保存
- ⌛ 导出PDF功能
- ⌛ 字数统计（包括字符数、单词数、行数）
- ⌛ 主题切换（深色/浅色模式）
- ⌛ 图片上传与管理
- ⌛ 版本控制与历史记录
- ⌛ 多端同步功能
- ⌛ 协同编辑功能
- ⌛ 自定义字体和颜色
- ⌛ LaTeX语法和公式渲染支持
- ⌛ 拼写检查
- ⌛ 自动保存和备份
- ⌛ 导入文字转为markdown
- ⌛ 公众号文章封面图生成（2.35:1比例）
- ⌛ 支持图片拖拽、粘贴、上传
- ⌛ 支持动图和视频链接转卡片
- ⌛ 离线编辑功能
- ⌛ 大文件编辑支持

## 技术栈
🖥️ 前端 (Vite + React + TypeScript)
│
├── 编辑器区（Editor）
│   ├── CodeMirror 6 核心
│   ├── 快捷键支持（@codemirror/commands）
│   ├── 自动补全（@codemirror/autocomplete）
│   ├── 滚动同步逻辑（scroll event listener）
│
├── 预览器区（Preview）
│   ├── React Markdown
│   ├── remark-gfm（表格、任务列表）
│   ├── rehype-highlight（代码块高亮）
│   ├── remark-math + rehype-katex（数学公式）
│   ├── remark-toc（目录生成）
│
├── 状态管理区（State）
│   ├── Zustand / Jotai（管理编辑内容、主题模式）
│
├── 持久化存储区（Persistence）
│   ├── localForage（自动保存草稿，多版本备份）
│
├── UI 界面（UI）
│   ├── Tailwind CSS（统一主题）
│   ├── Headless UI（对话框、菜单等）
│   ├── ThemeContext（暗黑/亮色切换）
│   ├── Heroicons / Lucide（图标）
│
└── 工具支持（Utilities）
    ├── lodash.debounce（输入防抖自动保存）
    ├── 自定义 Hook（如 useMarkdownEditor、useScrollSync）
