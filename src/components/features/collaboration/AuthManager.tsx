import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import { SyncState, SyncResult, SyncConflict } from '../types/sync';
import { authService } from '../services/authService';
import { syncService } from '../services/syncService';

interface AuthManagerProps {
  onSync: () => Promise<void>;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ onSync }) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [syncState, setSyncState] = useState<SyncState>(syncService.getSyncState());

  // 登录表单状态
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // 注册表单状态
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(loginData);
      setUser(response.user);
      setIsLoginDialogOpen(false);
      // 登录成功后自动同步数据
      await onSync();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (registerData.password !== registerData.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      setIsLoading(true);
      setError(null);
      const response = await authService.register(registerData);
      setUser(response.user);
      setIsRegisterDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      await onSync();
      setSyncState(syncService.getSyncState());
    } catch (err) {
      setError(err instanceof Error ? err.message : '同步失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* 工具栏按钮 */}
      <Box 
        display="flex" 
        alignItems="center"
        justifyContent="flex-end"
        gap={1.5} 
        sx={{ 
          p: 1.5,
          borderRadius: 3,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 32, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 2px 8px rgba(0,0,0,0.2)' 
            : '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(16px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '100%',
          '&:hover': {
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 16px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.08)',
            bgcolor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(26, 32, 39, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            transform: 'translateY(-1px)'
          }
        }}
      >
        {!user ? (
          <>
            <Tooltip title="登录">
              <IconButton 
                onClick={() => setIsLoginDialogOpen(true)} 
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(45, 55, 72, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 2px 6px rgba(0,0,0,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.04)',
                  '& .MuiSvgIcon-root': {
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    '& .MuiSvgIcon-root': {
                      color: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                      transform: 'scale(1.15)'
                    }
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 2px 4px rgba(0,0,0,0.2)'
                      : '0 2px 4px rgba(0,0,0,0.04)'
                  }
                }}
              >
                <LoginIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="注册">
              <IconButton 
                onClick={() => setIsRegisterDialogOpen(true)} 
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(45, 55, 72, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 2px 6px rgba(0,0,0,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.04)',
                  '& .MuiSvgIcon-root': {
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    '& .MuiSvgIcon-root': {
                      color: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                      transform: 'scale(1.15)'
                    }
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 2px 4px rgba(0,0,0,0.2)'
                      : '0 2px 4px rgba(0,0,0,0.04)'
                  }
                }}
              >
                <RegisterIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="同步">
              <IconButton
                onClick={handleSync}
                disabled={isLoading || syncState.isSyncing}
                size="small"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(45, 55, 72, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 2px 6px rgba(0,0,0,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.04)',
                  '& .MuiSvgIcon-root': {
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    '& .MuiSvgIcon-root': {
                      color: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                      transform: 'scale(1.15)'
                    }
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 2px 4px rgba(0,0,0,0.2)'
                      : '0 2px 4px rgba(0,0,0,0.04)'
                  },
                  '&.Mui-disabled': {
                    opacity: 0.6,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                <SyncIcon sx={{ 
                  fontSize: 20,
                  animation: syncState.isSyncing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': {
                      transform: 'rotate(0deg)'
                    },
                    '100%': {
                      transform: 'rotate(360deg)'
                    }
                  }
                }}/>
              </IconButton>
            </Tooltip>
            <Tooltip title="退出登录">
              <IconButton 
                onClick={handleLogout} 
                size="small"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  '&:hover': {
                    bgcolor: 'error.light',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255,0,0,0.08)',
                    '& .MuiSvgIcon-root': {
                      color: 'error.main',
                      transform: 'scale(1.15)'
                    }
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: '0 2px 4px rgba(255,0,0,0.04)'
                  }
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            {/* 显示用户名 */}
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1,
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              {user.username}
            </Typography>
          </>
        )}
      </Box>
      {/* 登录对话框 */}
      <Dialog 
        open={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>登录</DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': {
                  color: 'error.main',
                  fontWeight: 500
                }
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="邮箱"
            type="email"
            fullWidth
            variant="outlined"
            size="medium"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="密码"
            type="password"
            fullWidth
            variant="outlined"
            size="medium"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setIsLoginDialogOpen(false)}
            sx={{ mr: 1 }}
          >
            取消
          </Button>
          <Button
            onClick={handleLogin}
            variant="contained"
            disabled={isLoading}
            sx={{
              minWidth: 100,
              position: 'relative'
            }}
          >
            {isLoading ? (
              <CircularProgress 
                size={24} 
                sx={{
                  position: 'absolute',
                  color: 'primary.light'
                }}
              />
            ) : '登录'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 注册对话框 */}
      <Dialog 
        open={isRegisterDialogOpen} 
        onClose={() => setIsRegisterDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>注册</DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': {
                  color: 'error.main',
                  fontWeight: 500
                }
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="用户名"
            type="text"
            fullWidth
            variant="outlined"
            size="medium"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="邮箱"
            type="email"
            fullWidth
            variant="outlined"
            size="medium"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="密码"
            type="password"
            fullWidth
            variant="outlined"
            size="medium"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="确认密码"
            type="password"
            fullWidth
            variant="outlined"
            size="medium"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setIsRegisterDialogOpen(false)}
            sx={{ mr: 1 }}
          >
            取消
          </Button>
          <Button
            onClick={handleRegister}
            variant="contained"
            disabled={isLoading}
            sx={{
              minWidth: 100,
              position: 'relative'
            }}
          >
            {isLoading ? (
              <CircularProgress 
                size={24} 
                sx={{
                  position: 'absolute',
                  color: 'primary.light'
                }}
              />
            ) : '注册'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 同步状态显示 */}
      {syncState.isSyncing && (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Alert severity="info" icon={<CircularProgress size={20} />}>
            正在同步数据...
          </Alert>
        </Box>
      )}

      {syncState.error && (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Alert severity="error" onClose={() => setSyncState({ ...syncState, error: null })}>
            {syncState.error}
          </Alert>
        </Box>
      )}
    </Box>
  );
};