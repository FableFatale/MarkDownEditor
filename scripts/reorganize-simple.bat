@echo off
echo 🔧 开始重组组件文件...

REM 创建必要的子目录
mkdir "src\components\features\collaboration" 2>nul

REM 移动核心编辑器组件
echo 📁 移动核心编辑器组件...
if exist "src\components\MarkdownEditor.tsx" move "src\components\MarkdownEditor.tsx" "src\components\core\"
if exist "src\components\ModernMarkdownEditor.tsx" move "src\components\ModernMarkdownEditor.tsx" "src\components\core\"
if exist "src\components\SimpleMarkdownEditor.tsx" move "src\components\SimpleMarkdownEditor.tsx" "src\components\core\"

REM 移动UI组件
echo 📁 移动UI组件...
if exist "src\components\ModernCard.tsx" move "src\components\ModernCard.tsx" "src\components\ui\"
if exist "src\components\ModernLoader.tsx" move "src\components\ModernLoader.tsx" "src\components\ui\"
if exist "src\components\ModernProgressBar.tsx" move "src\components\ModernProgressBar.tsx" "src\components\ui\"
if exist "src\components\EnhancedButton.tsx" move "src\components\EnhancedButton.tsx" "src\components\ui\"
if exist "src\components\FloatingElements.tsx" move "src\components\FloatingElements.tsx" "src\components\ui\"
if exist "src\components\AnimatedTransition.tsx" move "src\components\AnimatedTransition.tsx" "src\components\ui\"

REM 移动工具栏组件
echo 📁 移动工具栏组件...
if exist "src\components\Toolbar.tsx" move "src\components\Toolbar.tsx" "src\components\toolbar\"
if exist "src\components\EditorToolbar.tsx" move "src\components\EditorToolbar.tsx" "src\components\toolbar\"
if exist "src\components\EditorFormatToolbar.tsx" move "src\components\EditorFormatToolbar.tsx" "src\components\toolbar\"
if exist "src\components\CombinedToolbar.tsx" move "src\components\CombinedToolbar.tsx" "src\components\toolbar\"
if exist "src\components\SingleRowToolbar.tsx" move "src\components\SingleRowToolbar.tsx" "src\components\toolbar\"
if exist "src\components\TopToolbar.tsx" move "src\components\TopToolbar.tsx" "src\components\toolbar\"
if exist "src\components\UnifiedToolbar.tsx" move "src\components\UnifiedToolbar.tsx" "src\components\toolbar\"
if exist "src\components\ModernToolbar.tsx" move "src\components\ModernToolbar.tsx" "src\components\toolbar\"

REM 移动对话框组件
echo 📁 移动对话框组件...
if exist "src\components\TailwindSettingsDialog.tsx" move "src\components\TailwindSettingsDialog.tsx" "src\components\dialogs\"
if exist "src\components\TailwindVersionHistory.tsx" move "src\components\TailwindVersionHistory.tsx" "src\components\dialogs\"
if exist "src\components\ImageUploadDialog.tsx" move "src\components\ImageUploadDialog.tsx" "src\components\dialogs\"
if exist "src\components\ThemeCustomizer.tsx" move "src\components\ThemeCustomizer.tsx" "src\components\dialogs\"

REM 移动导出功能组件
echo 📁 移动导出功能组件...
if exist "src\components\MultiFormatExporter.tsx" move "src\components\MultiFormatExporter.tsx" "src\components\features\export\"
if exist "src\components\PdfExporter.tsx" move "src\components\PdfExporter.tsx" "src\components\features\export\"
if exist "src\components\WechatExporter.tsx" move "src\components\WechatExporter.tsx" "src\components\features\export\"
if exist "src\components\DocumentConverter.tsx" move "src\components\DocumentConverter.tsx" "src\components\features\export\"
if exist "src\components\TextToMarkdownConverter.tsx" move "src\components\TextToMarkdownConverter.tsx" "src\components\features\export\"

REM 移动媒体处理组件
echo 📁 移动媒体处理组件...
if exist "src\components\ImageCompressor.tsx" move "src\components\ImageCompressor.tsx" "src\components\features\media\"
if exist "src\components\ImageUploader.tsx" move "src\components\ImageUploader.tsx" "src\components\features\media\"
if exist "src\components\ImagePreview.tsx" move "src\components\ImagePreview.tsx" "src\components\features\media\"
if exist "src\components\ImageList.tsx" move "src\components\ImageList.tsx" "src\components\features\media\"
if exist "src\components\VideoCard.tsx" move "src\components\VideoCard.tsx" "src\components\features\media\"
if exist "src\components\VideoLinkManager.tsx" move "src\components\VideoLinkManager.tsx" "src\components\features\media\"
if exist "src\components\TailwindVideoCard.tsx" move "src\components\TailwindVideoCard.tsx" "src\components\features\media\"
if exist "src\components\TailwindVideoLinkManager.tsx" move "src\components\TailwindVideoLinkManager.tsx" "src\components\features\media\"
if exist "src\components\CoverGenerator.tsx" move "src\components\CoverGenerator.tsx" "src\components\features\media\"
if exist "src\components\CoverImageGenerator.tsx" move "src\components\CoverImageGenerator.tsx" "src\components\features\media\"

REM 移动分析功能组件
echo 📁 移动分析功能组件...
if exist "src\components\SpellChecker.tsx" move "src\components\SpellChecker.tsx" "src\components\features\analysis\"
if exist "src\components\TailwindSpellChecker.tsx" move "src\components\TailwindSpellChecker.tsx" "src\components\features\analysis\"
if exist "src\components\OutlineNavigator.tsx" move "src\components\OutlineNavigator.tsx" "src\components\features\analysis\"
if exist "src\components\TailwindOutlineNavigator.tsx" move "src\components\TailwindOutlineNavigator.tsx" "src\components\features\analysis\"
if exist "src\components\WordCounter.tsx" move "src\components\WordCounter.tsx" "src\components\features\analysis\"

REM 移动布局组件
echo 📁 移动布局组件...
if exist "src\components\ModernLayout.tsx" move "src\components\ModernLayout.tsx" "src\components\layout\"
if exist "src\components\TailwindSaveStatus.tsx" move "src\components\TailwindSaveStatus.tsx" "src\components\layout\"
if exist "src\components\SaveStatusIndicator.tsx" move "src\components\SaveStatusIndicator.tsx" "src\components\layout\"
if exist "src\components\PWAStatus.tsx" move "src\components\PWAStatus.tsx" "src\components\layout\"

REM 移动开发测试组件
echo 📁 移动开发测试组件...
if exist "src\components\MermaidTest.tsx" move "src\components\MermaidTest.tsx" "src\components\dev\"
if exist "src\components\SimpleMermaidTest.tsx" move "src\components\SimpleMermaidTest.tsx" "src\components\dev\"
if exist "src\components\MermaidParserTest.tsx" move "src\components\MermaidParserTest.tsx" "src\components\dev\"
if exist "src\components\ThemeTest.tsx" move "src\components\ThemeTest.tsx" "src\components\dev\"
if exist "src\components\EditorTest.tsx" move "src\components\EditorTest.tsx" "src\components\dev\"
if exist "src\components\EditorThemeTest.tsx" move "src\components\EditorThemeTest.tsx" "src\components\dev\"
if exist "src\components\ReactFlowTest.tsx" move "src\components\ReactFlowTest.tsx" "src\components\dev\"
if exist "src\components\TestComponent.tsx" move "src\components\TestComponent.tsx" "src\components\dev\"
if exist "src\components\TestPage.tsx" move "src\components\TestPage.tsx" "src\components\dev\"

REM 移动协作功能组件
echo 📁 移动协作功能组件...
if exist "src\components\VersionHistory.tsx" move "src\components\VersionHistory.tsx" "src\components\features\collaboration\"
if exist "src\components\VersionManager.tsx" move "src\components\VersionManager.tsx" "src\components\features\collaboration\"
if exist "src\components\ArticleManager.tsx" move "src\components\ArticleManager.tsx" "src\components\features\collaboration\"
if exist "src\components\BackupManager.tsx" move "src\components\BackupManager.tsx" "src\components\features\collaboration\"

echo 🎉 组件重组完成!
pause
