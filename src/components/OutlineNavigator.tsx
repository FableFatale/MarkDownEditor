import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  FormatListBulleted as OutlineIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  line: number;
  children: HeadingItem[];
}

interface OutlineNavigatorProps {
  content: string;
  onHeadingClick?: (line: number) => void;
  className?: string;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onClose?: () => void;
}

export const OutlineNavigator: React.FC<OutlineNavigatorProps> = ({
  content,
  onHeadingClick,
  className = '',
  isVisible = true,
  onToggleVisibility,
  onClose
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 解析Markdown内容，提取标题
  const headings = useMemo(() => {
    const lines = content.split('\n');
    const headingItems: HeadingItem[] = [];
    const stack: HeadingItem[] = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = `heading-${index}-${level}`;
        
        const heading: HeadingItem = {
          id,
          level,
          text,
          line: index + 1,
          children: []
        };

        // 构建层级结构
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          headingItems.push(heading);
        } else {
          stack[stack.length - 1].children.push(heading);
        }

        stack.push(heading);
      }
    });

    return headingItems;
  }, [content]);

  // 自动展开所有项目
  useEffect(() => {
    const getAllIds = (items: HeadingItem[]): string[] => {
      const ids: string[] = [];
      items.forEach(item => {
        ids.push(item.id);
        if (item.children.length > 0) {
          ids.push(...getAllIds(item.children));
        }
      });
      return ids;
    };

    setExpandedItems(new Set(getAllIds(headings)));
  }, [headings]);

  const handleToggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleHeadingClick = (line: number) => {
    onHeadingClick?.(line);
  };

  const renderHeadingItem = (item: HeadingItem, depth = 0) => {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <React.Fragment key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: depth * 2,
            borderLeft: depth > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
            ml: depth > 0 ? 1 : 0
          }}
        >
          <ListItemButton
            onClick={() => handleHeadingClick(item.line)}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(item.id);
                }}
                sx={{ mr: 0.5, p: 0.25 }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`H${item.level}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: 32,
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: Math.max(0.75, 1 - item.level * 0.05) + 'rem',
                      fontWeight: item.level <= 2 ? 'bold' : 'normal',
                      color: item.level <= 2 ? 'text.primary' : 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderHeadingItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      className={className}
      sx={{
        width: 280,
        maxHeight: '70vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* 标题栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OutlineIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />
          <Typography variant="subtitle2" fontWeight="bold">
            文档大纲
          </Typography>
          <Chip
            label={headings.length}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {onToggleVisibility && (
            <Tooltip title="隐藏大纲">
              <IconButton
                size="small"
                onClick={onToggleVisibility}
                sx={{ p: 0.5 }}
              >
                <VisibilityOffIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          )}
          {onClose && (
            <Tooltip title="关闭大纲">
              <IconButton
                size="small"
                onClick={onClose}
                sx={{ p: 0.5 }}
              >
                <CloseIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* 大纲内容 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {headings.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            <OutlineIcon sx={{ fontSize: '2rem', mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">
              文档中没有找到标题
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              使用 # 标记创建标题
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ py: 1 }}>
            {headings.map(heading => renderHeadingItem(heading))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default OutlineNavigator;
