# 📁 项目文件夹结构优化方案

## 🎯 优化目标

1. **清理根目录** - 移除临时文件和测试文件
2. **组件分类** - 按功能模块组织组件
3. **统一文档** - 集中管理项目文档
4. **规范测试** - 统一测试文件组织
5. **简化配置** - 合并重复配置文件

## 📊 当前问题分析

### 根目录问题 (需要清理的文件)
```
❌ 临时测试文件 (20+个)
❌ 重复配置文件 (5个)
❌ 分散的文档文件 (15+个)
❌ 开发调试文件 (10+个)
```

### 组件目录问题
```
❌ 70+个组件文件无分类
❌ 重复功能组件
❌ 测试组件混在生产组件中
❌ 样式文件分散
```

## 🏗️ 优化后的目录结构

```
MarkDownEditor/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 core/              # 核心编辑器组件
│   │   │   ├── MarkdownEditor.tsx
│   │   │   ├── TailwindMarkdownEditor.tsx
│   │   │   └── TailwindMarkdownPreview.tsx
│   │   ├── 📁 ui/                # UI基础组件
│   │   │   ├── ModernCard.tsx
│   │   │   ├── ModernLoader.tsx
│   │   │   ├── EnhancedButton.tsx
│   │   │   └── FloatingElements.tsx
│   │   ├── 📁 toolbar/           # 工具栏组件
│   │   │   ├── TailwindToolbar.tsx
│   │   │   ├── TailwindToolbarFixed.tsx
│   │   │   └── EditorFormatToolbar.tsx
│   │   ├── 📁 dialogs/           # 对话框组件
│   │   │   ├── TailwindSettingsDialog.tsx
│   │   │   ├── TailwindVersionHistory.tsx
│   │   │   ├── ImageUploadDialog.tsx
│   │   │   └── SEOAnalyzer.tsx
│   │   ├── 📁 features/          # 功能组件
│   │   │   ├── 📁 seo/
│   │   │   │   ├── SEOAnalyzer.tsx
│   │   │   │   ├── SEOErrorBoundary.tsx
│   │   │   │   └── SEOTestButton.tsx
│   │   │   ├── 📁 export/
│   │   │   │   ├── MultiFormatExporter.tsx
│   │   │   │   ├── PdfExporter.tsx
│   │   │   │   └── WechatExporter.tsx
│   │   │   ├── 📁 media/
│   │   │   │   ├── ImageCompressor.tsx
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   └── VideoLinkManager.tsx
│   │   │   ├── 📁 collaboration/
│   │   │   │   ├── VersionHistory.tsx
│   │   │   │   └── BackupManager.tsx
│   │   │   └── 📁 analysis/
│   │   │       ├── SpellChecker.tsx
│   │   │       └── OutlineNavigator.tsx
│   │   ├── 📁 layout/            # 布局组件
│   │   │   ├── ModernLayout.tsx
│   │   │   └── TailwindSaveStatus.tsx
│   │   └── 📁 dev/               # 开发测试组件
│   │       ├── MermaidTest.tsx
│   │       ├── ThemeTest.tsx
│   │       └── EditorTest.tsx
│   ├── 📁 hooks/
│   ├── 📁 services/
│   ├── 📁 types/
│   ├── 📁 utils/
│   ├── 📁 styles/
│   │   ├── 📁 components/        # 组件样式
│   │   ├── 📁 themes/           # 主题样式
│   │   └── 📁 base/             # 基础样式
│   └── 📁 assets/               # 静态资源
├── 📁 docs/                     # 项目文档
│   ├── 📁 development/          # 开发文档
│   ├── 📁 user-guide/          # 用户指南
│   ├── 📁 api/                 # API文档
│   └── 📁 changelog/           # 更新日志
├── 📁 tests/                   # 测试文件
│   ├── 📁 unit/                # 单元测试
│   ├── 📁 integration/         # 集成测试
│   ├── 📁 e2e/                 # 端到端测试
│   └── 📁 fixtures/            # 测试数据
├── 📁 scripts/                 # 构建脚本
├── 📁 public/                  # 公共资源
└── 📁 config/                  # 配置文件
```

## 🧹 清理计划

### 第一阶段：根目录清理
1. 移动文档文件到 `docs/` 目录
2. 移动测试文件到 `tests/` 目录
3. 删除临时和重复文件
4. 整理配置文件到 `config/` 目录

### 第二阶段：组件重构
1. 按功能分类组件
2. 合并重复组件
3. 移动开发测试组件到 `dev/` 目录
4. 整理样式文件

### 第三阶段：文档整理
1. 合并相关文档
2. 创建统一的README
3. 整理API文档
4. 更新项目指南

## 📋 具体执行步骤

### 步骤1：创建新目录结构
### 步骤2：移动和重组文件
### 步骤3：更新导入路径
### 步骤4：清理无用文件
### 步骤5：更新配置文件
