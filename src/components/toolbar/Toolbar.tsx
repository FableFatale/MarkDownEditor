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
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button
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
  GridOn,
  FormatListBulleted,
  FormatListNumbered,
  GetApp,
  CloudUpload,
  PhotoCamera,
  History,
  FormatListBulleted as OutlineIcon,
  Folder as ArticleIcon,
  LibraryBooks as LibraryIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import WordCounter from './WordCounter';
import PdfExporter from './PdfExporter';
import { ImageUploadDialog } from './ImageUploadDialog';
import SaveStatusIndicator from './SaveStatusIndicator';
import OutlineNavigator from './OutlineNavigator';
import { ArticleManager } from './ArticleManager';
import MultiFormatExporter from './MultiFormatExporter';
import CoverImageGenerator from './CoverImageGenerator';
import UserGuide from './UserGuide';
import { SaveState } from '../hooks/useAutoSave';

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
  saveState?: SaveState;
  onManualSave?: () => void;
  onVersionHistory?: () => void;
  onToggleOutline?: () => void;
  onHeadingClick?: (line: number) => void;
  onArticleManage?: () => void;
  onArticleEdit?: (articleId: string) => void;
  onArticleCreate?: () => void;
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
  onFormatText,
  saveState,
  onManualSave,
  onVersionHistory,
  onToggleOutline,
  onHeadingClick,
  onArticleManage,
  onArticleEdit,
  onArticleCreate
}) => {
  const theme = useTheme();
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [pdfExportOpen, setPdfExportOpen] = useState(false);
  const [articleManagerOpen, setArticleManagerOpen] = useState(false);
  const [multiFormatExportOpen, setMultiFormatExportOpen] = useState(false);
  const [coverGeneratorOpen, setCoverGeneratorOpen] = useState(false);
  const [userGuideOpen, setUserGuideOpen] = useState(false);
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
        { icon: <CloudUpload />, tooltip: '上传图片', format: 'upload-image' },
        { icon: <GridOn />, tooltip: '表格', format: 'table' },
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
        // 使用完整的PDF导出组件
        setPdfExportOpen(true);
        break;
      case 'multi':
        // 使用多格式导出组件
        setMultiFormatExportOpen(true);
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

  // 处理图片上传
  const handleImageUpload = () => {
    setImageUploadOpen(true);
  };

  const handleImageUploadClose = () => {
    setImageUploadOpen(false);
  };

  const handleImageInsert = (imageUrl: string, altText?: string) => {
    // 插入图片到编辑器
    if ((window as any).editorFormatText) {
      // 使用编辑器的插入功能
      const success = (window as any).editorInsertImage?.(imageUrl, altText);
      if (!success) {
        // 回退到格式化文本方式
        onFormatText?.('custom-image', { imageUrl, altText });
      }
    } else {
      // 回退方案
      onFormatText?.('custom-image', { imageUrl, altText });
    }
  };

  // 处理格式化文本（包括图片上传）
  const handleFormatText = (format: string) => {
    if (format === 'upload-image') {
      handleImageUpload();
    } else {
      onFormatText?.(format);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        top: 0,
        backgroundColor: alpha(
          theme.palette.mode === 'dark' ? '#1A1B1E' : '#FFFFFF',
          0.85
        ),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-bottom-color'],
          { duration: 200 }
        ),
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? '#1A1B1E' : '#FFFFFF',
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
          py: { xs: 0.75, sm: 1 },
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: 56,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
            opacity: 0.6,
          }
        }}
      >

        {/* 左侧格式化工具栏 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          {formatToolbarGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.items.map((item, itemIndex) => (
                <Tooltip
                  key={`${groupIndex}-${itemIndex}`}
                  title={item.tooltip}
                  placement="bottom"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: alpha(theme.palette.grey[900], 0.9),
                        color: 'white',
                        fontSize: '0.75rem',
                        borderRadius: 1,
                        backdropFilter: 'blur(10px)',
                      }
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleFormatText(item.format)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      position: 'relative',
                      transition: theme.transitions.create([
                        'background-color',
                        'transform',
                        'box-shadow',
                        'color'
                      ], {
                        duration: 200,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                      }),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        transform: 'translateY(-1px) scale(1.05)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                        color: theme.palette.primary.main,
                        '& svg': {
                          transform: 'scale(1.1)',
                        }
                      },
                      '&:active': {
                        transform: 'translateY(0) scale(0.98)',
                        boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                      '& svg': {
                        fontSize: '1.1rem',
                        transition: theme.transitions.create(['transform', 'color'], {
                          duration: 200
                        })
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </React.Fragment>
          ))}
        </Box>

        {/* 右侧工具栏按钮组 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}>
          {/* 保存状态指示器 */}
          {saveState && (
            <SaveStatusIndicator
              saveState={saveState}
              onManualSave={onManualSave}
            />
          )}

          <WordCounter text={content} />

          {/* 大纲模式按钮 */}
          <Tooltip
            title="大纲模式"
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: alpha(theme.palette.grey[900], 0.9),
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  backdropFilter: 'blur(10px)',
                }
              }
            }}
          >
            <IconButton
              size="small"
              onClick={() => onToggleOutline?.()}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                transition: theme.transitions.create([
                  'background-color',
                  'transform',
                  'box-shadow',
                  'color'
                ], {
                  duration: 200,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px) scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  color: theme.palette.primary.main,
                  '& svg': {
                    transform: 'scale(1.1)',
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& svg': {
                  fontSize: '1.1rem',
                  transition: theme.transitions.create(['transform', 'color'], {
                    duration: 200
                  })
                }
              }}
            >
              <OutlineIcon />
            </IconButton>
          </Tooltip>

          {/* 文章管理按钮 */}
          <Tooltip
            title="文章管理"
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: alpha(theme.palette.grey[900], 0.9),
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  backdropFilter: 'blur(10px)',
                }
              }
            }}
          >
            <IconButton
              size="small"
              onClick={() => setArticleManagerOpen(true)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                transition: theme.transitions.create([
                  'background-color',
                  'transform',
                  'box-shadow',
                  'color'
                ], {
                  duration: 200,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px) scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  color: theme.palette.primary.main,
                  '& svg': {
                    transform: 'scale(1.1)',
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& svg': {
                  fontSize: '1.1rem',
                  transition: theme.transitions.create(['transform', 'color'], {
                    duration: 200
                  })
                }
              }}
            >
              <LibraryIcon />
            </IconButton>
          </Tooltip>

          {/* 版本历史按钮 */}
          {onVersionHistory && (
            <Tooltip
              title="版本历史"
              placement="bottom"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: alpha(theme.palette.grey[900], 0.9),
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: 1,
                    backdropFilter: 'blur(10px)',
                  }
                }
              }}
            >
              <IconButton
                size="small"
                onClick={onVersionHistory}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  transition: theme.transitions.create([
                    'background-color',
                    'transform',
                    'box-shadow',
                    'color'
                  ], {
                    duration: 200,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    transform: 'translateY(-1px) scale(1.05)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                    color: theme.palette.primary.main,
                    '& svg': {
                      transform: 'scale(1.1)',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(0) scale(0.98)',
                    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                  '& svg': {
                    fontSize: '1.1rem',
                    transition: theme.transitions.create(['transform', 'color'], {
                      duration: 200
                    })
                  }
                }}
              >
                <History />
              </IconButton>
            </Tooltip>
          )}

          {/* 主题切换按钮 */}
          <Tooltip
            title={themeMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: alpha(theme.palette.grey[900], 0.9),
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  backdropFilter: 'blur(10px)',
                }
              }
            }}
          >
            <IconButton
              size="small"
              onClick={onToggleTheme}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                transition: theme.transitions.create([
                  'background-color',
                  'transform',
                  'box-shadow',
                  'color'
                ], {
                  duration: 200,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px) scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  color: theme.palette.primary.main,
                  '& svg': {
                    transform: 'scale(1.1)',
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& svg': {
                  fontSize: '1.1rem',
                  transition: theme.transitions.create(['transform', 'color'], {
                    duration: 200
                  })
                }
              }}
            >
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* 导出按钮 */}
          <Tooltip
            title="导出文档"
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: alpha(theme.palette.grey[900], 0.9),
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  backdropFilter: 'blur(10px)',
                }
              }
            }}
          >
            <IconButton
              size="small"
              onClick={handleExportClick}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                transition: theme.transitions.create([
                  'background-color',
                  'transform',
                  'box-shadow',
                  'color'
                ], {
                  duration: 200,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px) scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  color: theme.palette.primary.main,
                  '& svg': {
                    transform: 'scale(1.1)',
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& svg': {
                  fontSize: '1.1rem',
                  transition: theme.transitions.create(['transform', 'color'], {
                    duration: 200
                  })
                }
              }}
            >
              <GetApp />
            </IconButton>
          </Tooltip>



          {/* 设置按钮 */}
          <Tooltip
            title="设置"
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: alpha(theme.palette.grey[900], 0.9),
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: 1,
                  backdropFilter: 'blur(10px)',
                }
              }
            }}
          >
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                transition: theme.transitions.create([
                  'background-color',
                  'transform',
                  'box-shadow',
                  'color'
                ], {
                  duration: 200,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'translateY(-1px) scale(1.05)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  color: theme.palette.primary.main,
                  '& svg': {
                    transform: 'scale(1.1)',
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& svg': {
                  fontSize: '1.1rem',
                  transition: theme.transitions.create(['transform', 'color'], {
                    duration: 200
                  })
                }
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

            <Divider />

            <MenuItem onClick={() => { setCoverGeneratorOpen(true); handleSettingsClose(); }}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText>封面生成</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={() => { setUserGuideOpen(true); handleSettingsClose(); }}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText>使用说明</ListItemText>
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
            <MenuItem onClick={() => handleExport('multi')}>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText>多格式导出</ListItemText>
            </MenuItem>

            <Divider />

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

          {/* 图片上传对话框 */}
          <ImageUploadDialog
            open={imageUploadOpen}
            onClose={handleImageUploadClose}
            onImageInsert={handleImageInsert}
          />

          {/* PDF导出对话框 */}
          {pdfExportOpen && previewRef?.current && (
            <Dialog
              open={pdfExportOpen}
              onClose={() => setPdfExportOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogContent sx={{ p: 0 }}>
                <PdfExporter
                  contentRef={previewRef}
                  fileName="markdown-document"
                  buttonText="导出PDF"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPdfExportOpen(false)}>
                  关闭
                </Button>
              </DialogActions>
            </Dialog>
          )}



          {/* 文章管理对话框 */}
          <Dialog
            open={articleManagerOpen}
            onClose={() => setArticleManagerOpen(false)}
            maxWidth="lg"
            fullWidth
            sx={{ '& .MuiDialog-paper': { height: '80vh' } }}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LibraryIcon color="primary" />
                  <Typography variant="h6">文章管理</Typography>
                </Box>
                <IconButton onClick={() => setArticleManagerOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <ArticleManager
                onArticleEdit={(articleId) => {
                  onArticleEdit?.(articleId);
                  setArticleManagerOpen(false);
                }}
                onArticleCreate={() => {
                  onArticleCreate?.();
                  setArticleManagerOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* 多格式导出对话框 */}
          <MultiFormatExporter
            open={multiFormatExportOpen}
            onClose={() => setMultiFormatExportOpen(false)}
            content={content}
            previewRef={previewRef}
          />

          {/* 封面图生成器对话框 */}
          <CoverImageGenerator
            open={coverGeneratorOpen}
            onClose={() => setCoverGeneratorOpen(false)}
            content={content}
          />

          {/* 使用说明对话框 */}
          <UserGuide
            open={userGuideOpen}
            onClose={() => setUserGuideOpen(false)}
          />
        </Box>
      </Container>
    </AppBar>
  );
};

export default Toolbar;