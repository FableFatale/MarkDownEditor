import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Compare as CompareIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Version, VersionMetadata } from '../types/version';

interface VersionManagerProps {
  articleId: string | null;
  currentContent: string;
  currentTitle: string;
  versions: Version[];
  onVersionCreate: (version: Omit<Version, 'id' | 'createdAt'>) => void;
  onVersionRestore: (version: Version) => void;
  onClose: () => void;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  articleId,
  currentContent,
  currentTitle,
  versions,
  onVersionCreate,
  onVersionRestore,
  onClose
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [versionDescription, setVersionDescription] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  const handleCreateVersion = () => {
    if (articleId && currentContent) {
      onVersionCreate({
        articleId,
        content: currentContent,
        title: currentTitle,
        description: versionDescription.trim() || undefined,
        wordCount: currentContent.split(/\s+/).length,
        charCount: currentContent.length
      });
      setVersionDescription('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRestoreVersion = (version: Version) => {
    if (window.confirm('确定要恢复到这个版本吗？当前未保存的内容将会丢失。')) {
      onVersionRestore(version);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">版本历史</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!articleId}
          >
            保存当前版本
          </Button>
          <IconButton
            onClick={onClose}
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <List>
        {versions.map((version) => (
          <React.Fragment key={version.id}>
            <ListItem>
              <ListItemText
                primary={version.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {version.description || '无描述'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      创建时间：{new Date(version.createdAt).toLocaleString()}
                      {' | '}
                      字数：{version.wordCount}
                      {' | '}
                      字符数：{version.charCount}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="恢复到此版本">
                  <IconButton
                    edge="end"
                    onClick={() => handleRestoreVersion(version)}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* 创建版本对话框 */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>保存当前版本</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="版本描述（可选）"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={versionDescription}
            onChange={(e) => setVersionDescription(e.target.value)}
            placeholder="描述这个版本的改动内容..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreateVersion} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};