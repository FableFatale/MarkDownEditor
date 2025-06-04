# 应用路由说明

## 默认路由

### 主页（单行工具栏编辑器）
- **URL**: `http://localhost:3002/`
- **组件**: SingleRowEditorDemo
- **描述**: 现代化的单行工具栏Markdown编辑器，包含所有格式化工具、标题样式选择、主题切换等功能

## 特殊路由

### 单行工具栏编辑器（显式访问）
- **URL**: `http://localhost:3002/?single-row`
- **组件**: SingleRowEditorDemo
- **描述**: 显式访问单行工具栏编辑器（与默认页面相同）

## 测试和开发路由

### 测试组件
- **URL**: `http://localhost:3002/?test`
- **组件**: TestComponent
- **描述**: 用于测试的基础组件

### 简单编辑器
- **URL**: `http://localhost:3002/?simple`
- **组件**: SimpleMarkdownEditor
- **描述**: 简化版的Markdown编辑器

### 基础编辑器
- **URL**: `http://localhost:3002/?basic`
- **组件**: BasicEditor
- **描述**: 基础版本的编辑器

### 现代编辑器
- **URL**: `http://localhost:3002/?modern`
- **组件**: ModernMarkdownEditor
- **描述**: 现代化设计的Markdown编辑器

### 文章管理系统
- **URL**: `http://localhost:3002/?article-manager`
- **组件**: ArticleManagementDemo
- **描述**: 文章分类管理系统演示

## Tailwind CSS 测试路由

### Tailwind 测试
- **URL**: `http://localhost:3002/?tailwind`
- **组件**: TailwindTest
- **描述**: Tailwind CSS 功能测试

### 简单 Tailwind 测试
- **URL**: `http://localhost:3002/?simple-tailwind`
- **组件**: SimpleTailwindTest
- **描述**: 简化的 Tailwind CSS 测试

### 最小 Tailwind 测试
- **URL**: `http://localhost:3002/?minimal-tailwind`
- **组件**: MinimalTailwindTest
- **描述**: 最小化的 Tailwind CSS 测试

### Tailwind 演示
- **URL**: `http://localhost:3002/?simple-tailwind-demo`
- **组件**: SimpleTailwindDemo
- **描述**: Tailwind CSS 功能演示

## 推荐使用

### 日常使用
推荐使用默认的单行工具栏编辑器：
```
http://localhost:3002/
```

### 功能特性
- ✅ 统一的单行工具栏设计
- ✅ 完整的格式化工具
- ✅ 6种标题样式可选
- ✅ 实时预览
- ✅ 主题切换（明暗模式）
- ✅ 全屏模式
- ✅ 多格式导出
- ✅ 字数统计
- ✅ 分屏调整



## 开发说明

### 添加新路由
要添加新的路由，需要在 `src/main.tsx` 中：

1. 添加URL参数检查：
```typescript
const showNewComponent = urlParams.has('new-component');
```

2. 添加条件渲染：
```typescript
} else if (showNewComponent) {
  componentToRender = <NewComponent />;
```

3. 更新控制台日志：
```typescript
showNewComponent ? 'NewComponent' :
```

### 修改默认路由
要修改默认显示的组件，更改 `main.tsx` 中的：
```typescript
let componentToRender = <YourDefaultComponent />;
```

## 历史记录

### 2024年更新
- **默认路由变更**: 从 `MarkdownEditorApp` 改为 `SingleRowEditorDemo`
- **简化路由**: 移除原始应用访问路径，专注于现代化编辑器
- **保留路由**: 所有现有的测试和开发路由保持不变

### 路由优先级
URL参数的检查顺序决定了路由的优先级：
1. `?test` - 测试组件
2. `?simple` - 简单编辑器
3. `?basic` - 基础编辑器
4. `?modern` - 现代编辑器
5. `?tailwind` - Tailwind测试
6. `?simple-tailwind` - 简单Tailwind测试
7. `?minimal-tailwind` - 最小Tailwind测试
8. `?simple-tailwind-demo` - Tailwind演示
9. `?single-row` - 单行工具栏编辑器
10. `?article-manager` - 文章管理系统
11. **默认** - 单行工具栏编辑器

## 注意事项

- 所有路由都在同一个端口（3002）上运行
- URL参数不区分大小写
- 可以通过浏览器的开发者工具控制台查看当前渲染的组件
- 刷新页面会保持当前的路由状态
