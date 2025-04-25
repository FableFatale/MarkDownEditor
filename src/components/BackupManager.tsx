import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { backupService } from '../services/backupService';

interface BackupManagerProps {
  onBackupRestore: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ onBackupRestore }) => {
  const [open, setOpen] = useState(false);
  const [backups, setBackups] = useState<Array<{ timestamp: number; data: string }>>([]);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>(
    {open: false, message: '', severity: 'success'}
  );

  useEffect(() => {
    if (open) {
      loadBackups();
    }
  }, [open]);

  const loadBackups = () => {
    const allBackups = backupService.getAllBackups();
    setBackups(allBackups);
  };

  const handleRestore = (timestamp: number) => {
    if (backupService.restoreFromBackup(timestamp)) {
      setSnackbar({open: true, message: '备份恢复成功', severity: 'success'});
      onBackupRestore();
      setOpen(false);
    } else {
      setSnackbar({open: true, message: '备份恢复失败', severity: 'error'});
    }
  };

  const handleDelete = (timestamp: number) => {
    if (backupService.deleteBackup(timestamp)) {
      setSnackbar({open: true, message: '备份删除成功', severity: 'success'});
      loadBackups();
    } else {
      setSnackbar({open: true, message: '备份删除失败', severity: 'error'});
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        title="备份管理"
        size="small"
        color="primary"
      >
        <HistoryIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>备份管理</DialogTitle>
        <DialogContent>
          {backups.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              暂无备份记录
            </Typography>
          ) : (
            <List>
              {backups.map((backup, index) => (
                <React.Fragment key={backup.timestamp}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={formatDate(backup.timestamp)}
                      secondary={`备份大小: ${(backup.data.length / 1024).toFixed(2)} KB`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRestore(backup.timestamp)}
                        title="恢复此备份"
                        color="primary"
                      >
                        <RestoreIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(backup.timestamp)}
                        title="删除此备份"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>关闭</Button>
          <Button
            onClick={() => {
              if (backupService.createBackup()) {
                setSnackbar({open: true, message: '创建备份成功', severity: 'success'});
                loadBackups();
              } else {
                setSnackbar({open: true, message: '创建备份失败', severity: 'error'});
              }
            }}
            variant="contained"
            color="primary"
          >
            创建备份
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};