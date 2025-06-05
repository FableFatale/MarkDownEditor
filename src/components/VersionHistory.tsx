import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  TextField,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Restore,
  Delete,
  Save,
  Close,
  History,
  Schedule,
  Description
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { SavedVersion } from '../hooks/useAutoSave';

interface VersionHistoryProps {
  open: boolean;
  onClose: () => void;
  versions: SavedVersion[];
  onRestoreVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSaveVersion: (title?: string) => void;
  currentContent: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  open,
  onClose,
  versions,
  onRestoreVersion,
  onDeleteVersion,
  onSaveVersion,
  currentContent
}) => {
  const theme = useTheme();
  const [newVersionTitle, setNewVersionTitle] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<SavedVersion | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 格式化时间显示
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  // 获取内容预览
  const getContentPreview = (content: string, maxLength = 100) => {
    const preview = content.replace(/\n/g, ' ').trim();
    return preview.length > maxLength 
      ? preview.substring(0, maxLength) + '...'
      : preview;
  };

  // 保存新版本
  const handleSaveVersion = async () => {
    try {
      await onSaveVersion(newVersionTitle || undefined);
      setNewVersionTitle('');
    } catch (error) {
      console.error('Failed to save version:', error);
    }
  };

  // 恢复版本
  const handleRestoreVersion = (versionId: string) => {
    onRestoreVersion(versionId);
    onClose();
  };

  // 删除版本
  const handleDeleteVersion = (versionId: string) => {
    onDeleteVersion(versionId);
    if (selectedVersion?.id === versionId) {
      setSelectedVersion(null);
      setShowPreview(false);
    }
  };

  // 预览版本
  const handlePreviewVersion = (version: SavedVersion) => {
    setSelectedVersion(version);
    setShowPreview(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History />
          <Typography variant="h6">版本历史</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* 保存新版本 */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" gutterBottom>
            保存当前版本
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="版本标题 (可选)"
              value={newVersionTitle}
              onChange={(e) => setNewVersionTitle(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveVersion}
              size="small"
            >
              保存版本
            </Button>
          </Box>
        </Box>

        {/* 版本列表 */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {versions.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <History sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                暂无版本历史
              </Typography>
              <Typography variant="body2" color="text.disabled">
                保存版本后将在此处显示
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {versions.map((version, index) => (
                <React.Fragment key={version.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                    onClick={() => handlePreviewVersion(version)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2">
                            {version.title}
                          </Typography>
                          {index === 0 && (
                            <Chip
                              label="最新"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Schedule fontSize="small" color="disabled" />
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(new Date(version.timestamp))}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              • {version.content.length} 字符
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {getContentPreview(version.content)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="恢复此版本">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreVersion(version.id);
                            }}
                          >
                            <Restore />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除版本">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteVersion(version.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < versions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* 版本预览 */}
        {showPreview && selectedVersion && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 预览头部 */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{selectedVersion.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(selectedVersion.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Restore />}
                    onClick={() => handleRestoreVersion(selectedVersion.id)}
                    size="small"
                  >
                    恢复此版本
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPreview(false)}
                    size="small"
                  >
                    返回
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* 预览内容 */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  预览版本内容 • {selectedVersion.content.length} 字符
                </Typography>
              </Alert>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 1,
                  p: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  maxHeight: '400px'
                }}
              >
                {selectedVersion.content}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          共 {versions.length} 个版本
        </Typography>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VersionHistory;
