# MarkDown编辑器项目结构设计

## 1. 目录结构

```
src/
├── components/           # UI组件
│   ├── editor/          # 编辑器核心组件
│   │   ├── core/        # 编辑器核心功能
│   │   ├── plugins/     # 编辑器插件
│   │   ├── toolbar/     # 工具栏组件
│   │   └── types.ts     # 类型定义
│   ├── preview/         # 预览相关组件
│   │   ├── renderer/    # Markdown渲染器
│   │   ├── plugins/     # 预览插件(数学公式、图表等)
│   │   └── types.ts     # 类型定义
│   └── common/          # 通用UI组件
├── features/            # 功能模块
│   ├── article/         # 文章管理
│   ├── category/        # 分类管理
│   ├── image/           # 图片管理
│   ├── export/          # 导出功能
│   └── sync/            # 同步功能
├── hooks/               # 自定义Hooks
├── services/            # 服务层
│   ├── api/             # API接口
│   ├── storage/         # 存储服务
│   └── utils/           # 工具函数
├── store/               # 状态管理
│   ├── editor/          # 编辑器状态
│   ├── theme/           # 主题状态
│   └── user/            # 用户状态
└── styles/              # 样式文件
    ├── themes/          # 主题样式
    └── components/      # 组件样式

## 2. 核心模块说明

### 2.1 编辑器核心 (components/editor)
- 基于CodeMirror 6实现
- 支持Markdown语法高亮
- 实现快捷键功能
- 支持实时预览

### 2.2 预览渲染 (components/preview)
- 使用react-markdown进行渲染
- 支持GFM语法
- 支持数学公式
- 支持Mermaid图表

### 2.3 功能模块 (features)
- 文章管理：分类、标签、搜索
- 图片管理：上传、压缩、预览
- 导出功能：PDF、HTML、Word格式
- 同步功能：多端数据同步

### 2.4 状态管理 (store)
- 使用Zustand管理全局状态
- 编辑器状态：内容、历史记录
- 主题状态：深色/浅色模式
- 用户状态：配置、偏好设置

## 3. 技术栈

- 前端框架：React + TypeScript
- 构建工具：Vite
- UI框架：TailwindCSS
- 编辑器：CodeMirror 6
- 状态管理：Zustand
- 持久化：IndexedDB/LocalStorage

## 4. 开发规范

### 4.1 命名规范
- 组件文件：PascalCase (如 MarkdownEditor.tsx)
- 工具函数：camelCase (如 convertToHtml.ts)
- 样式文件：kebab-case (如 editor-theme.css)

### 4.2 代码组织
- 相关功能放在同一目录下
- 共用组件放在common目录
- 类型定义集中管理
- 保持目录结构清晰

### 4.3 组件设计
- 遵循单一职责原则
- 合理拆分组件
- 使用TypeScript强类型
- 编写清晰的注释

### 4.4 状态管理
- 区分全局状态和局部状态
- 使用Zustand管理全局状态
- 合理使用React Context
- 避免状态冗余

## 5. 性能优化

### 5.1 编辑器优化
- 使用虚拟滚动
- 延迟加载非核心功能
- 优化重渲染逻辑

### 5.2 资源优化
- 图片懒加载
- 代码分割
- 缓存策略
- 按需加载