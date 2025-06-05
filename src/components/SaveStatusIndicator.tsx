import React from 'react';
import {
  Box,
  Chip,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Save,
  SaveAlt,
  CheckCircle,
  Error,
  Schedule,
  CloudDone
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { SaveState } from '../hooks/useAutoSave';

interface SaveStatusIndicatorProps {
  saveState: SaveState;
  onManualSave?: () => void;
  className?: string;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  saveState,
  onManualSave,
  className = ''
}) => {
  const theme = useTheme();
  const { isSaving, lastSaved, hasUnsavedChanges, error } = saveState;

  // 获取状态信息
  const getStatusInfo = () => {
    if (error) {
      return {
        icon: <Error color="error" />,
        label: '保存失败',
        color: 'error' as const,
        tooltip: `保存失败: ${error}`
      };
    }

    if (isSaving) {
      return {
        icon: <CircularProgress size={16} />,
        label: '保存中...',
        color: 'info' as const,
        tooltip: '正在保存文档'
      };
    }

    if (hasUnsavedChanges) {
      return {
        icon: <Schedule color="warning" />,
        label: '未保存',
        color: 'warning' as const,
        tooltip: '有未保存的更改'
      };
    }

    if (lastSaved) {
      return {
        icon: <CloudDone color="success" />,
        label: '已保存',
        color: 'success' as const,
        tooltip: `最后保存: ${lastSaved.toLocaleString()}`
      };
    }

    return {
      icon: <Save color="disabled" />,
      label: '未保存',
      color: 'default' as const,
      tooltip: '文档尚未保存'
    };
  };

  const statusInfo = getStatusInfo();

  // 格式化最后保存时间
  const formatLastSaved = (date: Date) => {
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

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 'fit-content'
      }}
    >
      {/* 状态指示器 */}
      <Tooltip title={statusInfo.tooltip} arrow>
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          size="small"
          color={statusInfo.color}
          variant={hasUnsavedChanges || error ? 'filled' : 'outlined'}
          sx={{
            height: 24,
            fontSize: '0.75rem',
            '& .MuiChip-icon': {
              fontSize: '1rem'
            }
          }}
        />
      </Tooltip>

      {/* 最后保存时间 */}
      {lastSaved && !isSaving && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: '0.7rem',
            whiteSpace: 'nowrap'
          }}
        >
          {formatLastSaved(lastSaved)}
        </Typography>
      )}

      {/* 手动保存按钮 */}
      {onManualSave && (
        <Tooltip title="手动保存 (Ctrl+S)" arrow>
          <IconButton
            size="small"
            onClick={onManualSave}
            disabled={isSaving || (!hasUnsavedChanges && !error)}
            sx={{
              width: 24,
              height: 24,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <SaveAlt fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

// 简化版本的保存状态指示器
export const SimpleSaveStatus: React.FC<{
  saveState: SaveState;
  showText?: boolean;
}> = ({ saveState, showText = true }) => {
  const { isSaving, hasUnsavedChanges, error } = saveState;

  if (error) {
    return (
      <Tooltip title={`保存失败: ${error}`}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Error color="error" fontSize="small" />
          {showText && (
            <Typography variant="caption" color="error">
              失败
            </Typography>
          )}
        </Box>
      </Tooltip>
    );
  }

  if (isSaving) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CircularProgress size={16} />
        {showText && (
          <Typography variant="caption" color="text.secondary">
            保存中
          </Typography>
        )}
      </Box>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Tooltip title="有未保存的更改">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule color="warning" fontSize="small" />
          {showText && (
            <Typography variant="caption" color="warning.main">
              未保存
            </Typography>
          )}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="所有更改已保存">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <CheckCircle color="success" fontSize="small" />
        {showText && (
          <Typography variant="caption" color="success.main">
            已保存
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default SaveStatusIndicator;
