# MarkDownEditor 项目结构说明

## 目录结构

```
MarkDownEditor/
├── docs/                    # 项目文档
│   ├── project-structure.md # 项目结构说明
│   └── PRD.md              # 产品需求文档
├── src/                    # 源代码
│   ├── components/         # React组件
│   │   ├── editor/        # 编辑器相关组件
│   │   ├── preview/       # 预览相关组件
│   │   ├── toolbar/       # 工具栏组件
│   │   └── common/        # 通用组件
│   ├── hooks/             # 自定义Hooks
│   ├── services/          # 业务服务
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── theme/             # 主题配置
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── public/                 # 静态资源
└── tests/                  # 测试文件
```

## 核心模块说明

### 1. 编辑器核心 (src/components/editor)
- MarkdownEditor：基于CodeMirror 6的编辑器核心组件
- EditorToolbar：编辑器工具栏，包含常用操作按钮
- KeyboardShortcuts：快捷键管理器

### 2. 预览渲染 (src/components/preview)
- MarkdownPreview：基于react-markdown的预览组件
- CustomRenderers：自定义渲染器（标题、代码块等）
- SyncScroll：编辑器与预览区域同步滚动

### 3. 文档管理 (src/services)
- DocumentService：文档CRUD操作
- CategoryService：分类管理
- StorageService：本地存储服务
- SyncService：多端同步服务

### 4. 媒体处理 (src/services)
- ImageService：图片上传、管理
- VideoService：视频链接处理
- CoverService：封面图生成

### 5. 状态管理 (src/store)
- documentStore：文档内容状态
- themeStore：主题配置状态
- userStore：用户偏好设置

### 6. 工具函数 (src/utils)
- markdownUtils：Markdown格式转换
- exportUtils：文档导出（PDF、HTML等）
- statisticsUtils：字数统计等

### 7. 主题系统 (src/theme)
- ThemeProvider：主题上下文提供者
- themeConfigs：主题配置对象
- darkMode：深色模式支持

## 技术栈详情

### 前端框架
- Vite：构建工具
- React + TypeScript：核心框架
- TailwindCSS：样式解决方案

### 编辑器相关
- CodeMirror 6：编辑器核心
- react-markdown：Markdown渲染
- remark/rehype：Markdown扩展

### 状态管理
- Zustand/Jotai：轻量级状态管理
- localForage：本地存储

### UI组件
- Headless UI：无样式组件库
- Heroicons：图标库
- framer-motion：动画效果

### 工具库
- lodash：工具函数集
- date-fns：日期处理
- browser-image-compression：图片压缩

## 开发规范

### 代码风格
- 使用TypeScript编写
- 遵循ESLint规则
- 使用Prettier格式化

### 组件开发
- 采用函数式组件
- 使用React Hooks
- 遵循组件设计原则

### 样式管理
- 使用TailwindCSS工具类
- 遵循响应式设计原则
- 支持深色模式

### 性能优化
- 组件懒加载
- 资源按需加载
- 合理的缓存策略