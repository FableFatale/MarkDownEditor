import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  useTheme,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  DarkMode,
  LightMode,
  Fullscreen,
  FullscreenExit,
  Settings,
  Palette,
  ViewCompact,
  PictureAsPdf,
  FormatBold,
  FormatItalic,
  FormatQuote,
  Code,
  InsertLink,
  Image,
  TableChart,
  FormatListBulleted,
  FormatListNumbered,
  GetApp
} from '@mui/icons-material';
import WordCounter from './WordCounter';
import PdfExporter from './PdfExporter';

interface ToolbarProps {
  content: string;
  themeMode?: 'light' | 'dark';
  isFullScreen?: boolean;
  onToggleTheme?: () => void;
  onToggleFullScreen?: () => void;
  onThemeSettings?: () => void;
  onLayoutSettings?: () => void;
  previewRef?: React.RefObject<HTMLDivElement>;
  onFormatText?: (format: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  content,
  themeMode = 'light',
  isFullScreen = false,
  onToggleTheme,
  onToggleFullScreen,
  onThemeSettings,
  onLayoutSettings,
  previewRef,
  onFormatText
}) => {
  const theme = useTheme();
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(settingsAnchorEl);
  const exportOpen = Boolean(exportAnchorEl);

  // 格式化工具栏定义
  const formatToolbarGroups = [
    {
      title: '文本格式',
      items: [
        { icon: <FormatBold />, tooltip: '粗体 (Ctrl+B)', format: 'bold' },
        { icon: <FormatItalic />, tooltip: '斜体 (Ctrl+I)', format: 'italic' },
        { icon: <FormatQuote />, tooltip: '引用', format: 'quote' },
      ],
    },
    {
      title: '插入元素',
      items: [
        { icon: <Code />, tooltip: '代码块', format: 'code' },
        { icon: <InsertLink />, tooltip: '链接 (Ctrl+K)', format: 'link' },
        { icon: <Image />, tooltip: '图片', format: 'image' },
        { icon: <TableChart />, tooltip: '表格', format: 'table' },
      ],
    },
    {
      title: '列表',
      items: [
        { icon: <FormatListBulleted />, tooltip: '无序列表', format: 'bullet-list' },
        { icon: <FormatListNumbered />, tooltip: '有序列表', format: 'number-list' },
      ],
    },
  ];

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format: string) => {
    switch (format) {
      case 'pdf':
        exportAsPDF();
        break;
      case 'html':
        exportAsHTML();
        break;
      case 'markdown':
        exportAsMarkdown();
        break;
      case 'txt':
        exportAsText();
        break;
    }
    handleExportClose();
  };

  const exportAsPDF = () => {
    if (previewRef?.current) {
      import('html2pdf.js').then((html2pdf) => {
        const element = previewRef.current;
        const opt = {
          margin: 1,
          filename: 'markdown-document.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf.default().set(opt).from(element).save();
      }).catch(() => {
        alert('PDF导出功能需要安装html2pdf.js库');
      });
    }
  };

  const exportAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 2px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
  </style>
</head>
<body>
${previewRef?.current?.innerHTML || ''}
</body>
</html>`;
    downloadFile(htmlContent, 'document.html', 'text/html');
  };

  const exportAsMarkdown = () => {
    downloadFile(content, 'document.md', 'text/markdown');
  };

  const exportAsText = () => {
    const textContent = content.replace(/[#*`_\[\]()]/g, '');
    downloadFile(textContent, 'document.txt', 'text/plain');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleThemeToggle = () => {
    onToggleTheme?.();
    handleSettingsClose();
  };

  const handleFullScreenToggle = () => {
    onToggleFullScreen?.();
    handleSettingsClose();
  };

  const handleThemeSettings = () => {
    onThemeSettings?.();
    handleSettingsClose();
  };

  const handleLayoutSettings = () => {
    onLayoutSettings?.();
    handleSettingsClose();
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        top: 0,
        backgroundColor: alpha(theme.palette.background.default, 0.85),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-bottom-color'],
          { duration: 200 }
        ),
        '&:hover': {
          backgroundColor: theme.palette.background.default,
          backdropFilter: 'blur(12px)',
        }
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 0.5, sm: 0.75 },
          px: { xs: 1, sm: 1.5, md: 2 },
          minHeight: 48,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />

        {/* 左侧格式化工具栏 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          {formatToolbarGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupIndex > 0 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    mx: 0.5,
                    height: 20,
                    borderColor: alpha(theme.palette.divider, 0.5)
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {group.items.map((item, itemIndex) => (
                  <Tooltip key={itemIndex} title={item.tooltip}>
                    <IconButton
                      size="small"
                      onClick={() => onFormatText?.(item.format)}
                      sx={{
                        width: 28,
                        height: 28,
                        transition: theme.transitions.create(['background-color', 'transform']),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </React.Fragment>
          ))}
        </Box>

        {/* 右侧工具栏按钮组 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WordCounter text={content} />

          {/* 导出按钮 */}
          <Tooltip title="导出文档">
            <IconButton
              size="small"
              onClick={handleExportClick}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform']),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <GetApp />
            </IconButton>
          </Tooltip>

          {/* 主题切换按钮 */}
          <Tooltip title={themeMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
            <IconButton
              size="small"
              onClick={onToggleTheme}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform']),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                },
              }}
            >
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* 全屏切换按钮 */}
          <Tooltip title={isFullScreen ? '退出全屏' : '进入全屏'}>
            <IconButton
              size="small"
              onClick={onToggleFullScreen}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform']),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                },
              }}
            >
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>

          {/* 设置按钮 */}
          <Tooltip title="设置">
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform']),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          {/* 设置菜单 */}
          <Menu
            anchorEl={settingsAnchorEl}
            open={settingsOpen}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <MenuItem onClick={handleThemeToggle}>
              <ListItemIcon>
                {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
              </ListItemIcon>
              <ListItemText>
                {themeMode === 'dark' ? '浅色模式' : '深色模式'}
              </ListItemText>
            </MenuItem>

            <MenuItem onClick={handleFullScreenToggle}>
              <ListItemIcon>
                {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
              </ListItemIcon>
              <ListItemText>
                {isFullScreen ? '退出全屏' : '全屏模式'}
              </ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleThemeSettings}>
              <ListItemIcon>
                <Palette />
              </ListItemIcon>
              <ListItemText>主题设置</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleLayoutSettings}>
              <ListItemIcon>
                <ViewCompact />
              </ListItemIcon>
              <ListItemText>布局设置</ListItemText>
            </MenuItem>
          </Menu>

          {/* 导出菜单 */}
          <Menu
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={handleExportClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 180,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <MenuItem onClick={() => handleExport('pdf')}>
              <ListItemIcon>
                <PictureAsPdf />
              </ListItemIcon>
              <ListItemText>导出为 PDF</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleExport('html')}>
              <ListItemIcon>
                <Code />
              </ListItemIcon>
              <ListItemText>导出为 HTML</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleExport('markdown')}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText>导出为 Markdown</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleExport('txt')}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText>导出为文本</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Toolbar;