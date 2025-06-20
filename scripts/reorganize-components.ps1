# 组件重组脚本
Write-Host "🔧 开始重组组件文件..." -ForegroundColor Green

# 定义组件分类映射
$componentMapping = @{
    # 核心编辑器组件
    "core" = @(
        "MarkdownEditor.tsx";
        "ModernMarkdownEditor.tsx";
        "SimpleMarkdownEditor.tsx"
    );

    # UI基础组件
    "ui" = @(
        "ModernCard.tsx";
        "ModernLoader.tsx";
        "ModernProgressBar.tsx";
        "EnhancedButton.tsx";
        "FloatingElements.tsx";
        "AnimatedTransition.tsx";
        "LazyContent.tsx";
        "LazyImage.tsx"
    );
    
    # 工具栏组件
    "toolbar" = @(
        "Toolbar.tsx",
        "EditorToolbar.tsx",
        "EditorFormatToolbar.tsx",
        "CombinedToolbar.tsx",
        "SingleRowToolbar.tsx",
        "TopToolbar.tsx",
        "UnifiedToolbar.tsx",
        "ModernToolbar.tsx"
    )
    
    # 对话框组件
    "dialogs" = @(
        "TailwindSettingsDialog.tsx",
        "TailwindVersionHistory.tsx",
        "ImageUploadDialog.tsx",
        "ThemeCustomizer.tsx"
    )
    
    # 导出功能
    "features/export" = @(
        "MultiFormatExporter.tsx",
        "PdfExporter.tsx",
        "WechatExporter.tsx",
        "DocumentConverter.tsx",
        "TextToMarkdownConverter.tsx"
    )
    
    # 媒体处理
    "features/media" = @(
        "ImageCompressor.tsx",
        "ImageUploader.tsx",
        "ImageUploadDialog.tsx",
        "ImagePreview.tsx",
        "ImageList.tsx",
        "VideoCard.tsx",
        "VideoLinkManager.tsx",
        "TailwindVideoCard.tsx",
        "TailwindVideoLinkManager.tsx",
        "CoverGenerator.tsx",
        "CoverImageGenerator.tsx"
    )
    
    # 分析功能
    "features/analysis" = @(
        "SpellChecker.tsx",
        "TailwindSpellChecker.tsx",
        "OutlineNavigator.tsx",
        "TailwindOutlineNavigator.tsx",
        "WordCounter.tsx"
    )
    
    # 布局组件
    "layout" = @(
        "ModernLayout.tsx",
        "TailwindSaveStatus.tsx",
        "SaveStatusIndicator.tsx",
        "PWAStatus.tsx"
    )
    
    # 开发测试组件
    "dev" = @(
        "MermaidTest.tsx",
        "SimpleMermaidTest.tsx",
        "MermaidParserTest.tsx",
        "ThemeTest.tsx",
        "EditorTest.tsx",
        "EditorThemeTest.tsx",
        "ReactFlowTest.tsx",
        "TestComponent.tsx",
        "TestPage.tsx",
        "SimpleTailwindTest.tsx",
        "TailwindTest.tsx",
        "MinimalTailwindTest.tsx"
    )
}

# 执行文件移动
foreach ($category in $componentMapping.Keys) {
    $targetDir = "src/components/$category"
    Write-Host "📁 处理分类: $category" -ForegroundColor Yellow
    
    foreach ($file in $componentMapping[$category]) {
        $sourcePath = "src/components/$file"
        if (Test-Path $sourcePath) {
            try {
                Move-Item -Path $sourcePath -Destination $targetDir -Force
                Write-Host "  ✅ 移动: $file" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ 移动失败: $file - $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️  文件不存在: $file" -ForegroundColor Gray
        }
    }
}

# 移动剩余的特殊组件
Write-Host "📁 处理特殊组件..." -ForegroundColor Yellow

# 版本管理相关
$versionComponents = @("VersionHistory.tsx", "VersionManager.tsx", "TailwindVersionHistory.tsx")
foreach ($file in $versionComponents) {
    $sourcePath = "src/components/$file"
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination "src/components/features/collaboration/" -Force
        Write-Host "  ✅ 移动到协作功能: $file" -ForegroundColor Green
    }
}

# 文章管理相关
$articleComponents = @("ArticleManager.tsx", "ArticleManagerDemo.tsx", "CategoryManager.tsx", "BackupManager.tsx")
foreach ($file in $articleComponents) {
    $sourcePath = "src/components/$file"
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination "src/components/features/collaboration/" -Force
        Write-Host "  ✅ 移动到协作功能: $file" -ForegroundColor Green
    }
}

# 主题相关
$themeComponents = @("ThemeManager.tsx", "CustomHeadingStyles.tsx")
foreach ($file in $themeComponents) {
    $sourcePath = "src/components/$file"
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination "src/components/ui/" -Force
        Write-Host "  ✅ 移动到UI组件: $file" -ForegroundColor Green
    }
}

Write-Host "🎉 组件重组完成!" -ForegroundColor Green
