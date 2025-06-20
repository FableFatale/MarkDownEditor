import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatQuote,
  Code,
  InsertLink,
  Image,
  TableChart,
  FormatListBulleted,
  FormatListNumbered,
  Fullscreen,
  FullscreenExit,
  DarkMode,
  LightMode,
} from '@mui/icons-material';

interface EditorToolbarProps {
  isDarkMode: boolean;
  isFullscreen: boolean;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onFormatText: (format: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isDarkMode,
  isFullscreen,
  onToggleTheme,
  onToggleFullscreen,
  onFormatText,
}) => {
  const theme = useTheme();

  const toolbarGroups = [
    {
      title: '文本格式',
      items: [
        { icon: <FormatBold />, tooltip: '粗体 (Ctrl+B)', format: 'bold' },
        { icon: <FormatItalic />, tooltip: '斜体 (Ctrl+I)', format: 'italic' },
      ],
    },
    {
      title: '插入元素',
      items: [
        { icon: <FormatQuote />, tooltip: '引用 (Ctrl+Q)', format: 'quote' },
        { icon: <Code />, tooltip: '代码块 (Ctrl+Alt+E)', format: 'code' },
        { icon: <InsertLink />, tooltip: '链接 (Ctrl+K)', format: 'link' },
        { icon: <Image />, tooltip: '图片 (Ctrl+Alt+I)', format: 'image' },
        { icon: <TableChart />, tooltip: '表格 (Ctrl+Alt+T)', format: 'table' },
      ],
    },
    {
      title: '列表',
      items: [
        { icon: <FormatListBulleted />, tooltip: '无序列表 (Ctrl+U)', format: 'bullet-list' },
        { icon: <FormatListNumbered />, tooltip: '有序列表 (Ctrl+O)', format: 'number-list' },
      ],
    },
  ];


  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-bottom-color', 'backdrop-filter'],
          { duration: 200 }
        ),
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(12px)',
          boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.08)}`,
        }
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{ 
          minHeight: 48,
          gap: 2,
          '& .MuiBox-root + .MuiBox-root::before': {
            content: '""',
            position: 'absolute',
            left: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '60%',
            width: 1,
            backgroundColor: theme.palette.divider,
          }
        }}
      >
        {toolbarGroups.map((group, groupIndex) => (
          <Box 
            key={groupIndex} 
            sx={{ 
              display: 'flex', 
              gap: 0.5,
              position: 'relative',
            }}
          >
            {group.items.map((item, itemIndex) => (
              <Tooltip 
                key={itemIndex} 
                title={item.tooltip} 
                arrow
                placement="bottom"
              >
                <IconButton
                  size="small"
                  onClick={() => onFormatText(item.format)}
                  sx={{
                    transition: theme.transitions.create(
                      ['background-color', 'transform', 'box-shadow'],
                      { duration: 200 }
                    ),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'scale(1.05)',
                      boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`,
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        ))}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={isDarkMode ? '切换浅色模式' : '切换深色模式'} arrow>
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
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? '退出全屏' : '进入全屏'} arrow>
            <IconButton
              size="small"
              onClick={onToggleFullscreen}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform']),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'scale(1.05)',
                },
              }}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};