import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  Close,
  ContentPaste,
  DragIndicator
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onImageInsert: (imageUrl: string, altText?: string) => void;
}

export const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onImageInsert
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // 处理文件选择
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('图片文件大小不能超过 10MB');
      return;
    }

    setError(null);
    setFileName(file.name);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 模拟上传过程
    simulateUpload(file);
  }, []);

  // 模拟上传过程（实际项目中应该调用真实的上传API）
  const simulateUpload = useCallback((file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // 处理粘贴
  const handlePaste = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], `pasted-image-${Date.now()}.png`, { type });
            const fileList = new DataTransfer();
            fileList.items.add(file);
            handleFileSelect(fileList.files);
            return;
          }
        }
      }
      setError('剪贴板中没有找到图片');
    } catch (err) {
      setError('无法访问剪贴板，请手动选择文件');
    }
  }, [handleFileSelect]);

  // 插入图片
  const handleInsert = useCallback(() => {
    if (previewUrl) {
      // 在实际项目中，这里应该是上传后的URL
      // 现在使用base64作为演示
      const altText = fileName.replace(/\.[^/.]+$/, ''); // 移除文件扩展名作为alt text
      onImageInsert(previewUrl, altText);
      handleClose();
    }
  }, [previewUrl, fileName, onImageInsert]);

  // 关闭对话框
  const handleClose = useCallback(() => {
    setPreviewUrl(null);
    setFileName('');
    setError(null);
    setUploading(false);
    setUploadProgress(0);
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          上传图片
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 拖拽上传区域 */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragOver 
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.background.default, 0.5),
            transition: theme.transitions.create(['border-color', 'background-color']),
            cursor: 'pointer',
            mb: 2
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <DragIndicator sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            拖拽图片到此处
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            或点击选择文件
          </Typography>
          <Chip
            icon={<CloudUpload />}
            label="选择文件"
            variant="outlined"
            color="primary"
          />
        </Box>

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            startIcon={<PhotoCamera />}
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            fullWidth
          >
            选择文件
          </Button>
          <Button
            startIcon={<ContentPaste />}
            variant="outlined"
            onClick={handlePaste}
            fullWidth
          >
            粘贴图片
          </Button>
        </Box>

        {/* 上传进度 */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              上传中... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        {/* 图片预览 */}
        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                预览
              </Typography>
            </Divider>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 1,
                mb: 1
              }}
            >
              <img
                src={previewUrl}
                alt="预览"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: theme.shape.borderRadius
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {fileName}
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          取消
        </Button>
        <Button
          onClick={handleInsert}
          variant="contained"
          disabled={!previewUrl || uploading}
        >
          插入图片
        </Button>
      </DialogActions>
    </Dialog>
  );
};
