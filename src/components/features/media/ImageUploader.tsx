import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { BackupManager } from './BackupManager';
import { imageService } from '../services/imageService';
import { Image, ImageCompressOptions } from '../types/image';
import { ImagePreview } from './ImagePreview';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    originalSize: number;
    compressedSize: number;
    width: number;
    height: number;
    format: string;
    previewUrl: string;
  } | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImages(imageService.getAllImages());

    // 添加粘贴事件监听
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            await handleFiles([file]);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 如果图片大于 1920px，按比例缩小
          if (width > 1920) {
            height = Math.round((height * 1920) / width);
            width = 1920;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

const handleFiles = async (files: File[]) => {
    try {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setCurrentFile(file);
        const previewInfo = await imageService.getImagePreview(file);
        setPreviewData(previewInfo);
        setPreviewDialogOpen(true);
      }
    } catch (error) {
      setSnackbar({open: true, message: '图片处理失败', severity: 'error'});
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setPreviewDialogOpen(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`![${selectedImage?.name || 'image'}](${url})`);
    onImageUpload(url);
  };

  const handleDelete = (id: string) => {
    if (imageService.deleteImage(id)) {
      setImages(imageService.getAllImages());
      setSnackbar({open: true, message: '图片删除成功', severity: 'success'});
    } else {
      setSnackbar({open: true, message: '图片删除失败', severity: 'error'});
    }
  };

  const handleConfirmUpload = async (options: ImageCompressOptions) => {
    if (!currentFile) return;
    
    setIsUploading(true);
    try {
      const response = await imageService.saveImage(currentFile, options);
      if (response.success && response.imageUrl) {
        setImages(imageService.getAllImages());
        setSnackbar({open: true, message: '图片上传成功', severity: 'success'});
      } else {
        setSnackbar({open: true, message: response.error || '图片上传失败', severity: 'error'});
      }
    } catch (error) {
      setSnackbar({open: true, message: '图片处理失败', severity: 'error'});
    } finally {
      setIsUploading(false);
      setPreviewDialogOpen(false);
      setPreviewData(null);
      setCurrentFile(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BackupManager onBackupRestore={() => setImages(imageService.getAllImages())} />
      </Box>

      <Box
        ref={editorRef}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        {
          isUploading ? (
            <CircularProgress size={48} sx={{ mb: 2 }} />
          ) : (
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          )
        }
        <Typography variant="h6" gutterBottom>
          拖拽图片到此处或点击上传
        </Typography>
        <Typography variant="body2" color="text.secondary">
          支持 JPG、PNG、GIF 等常见图片格式
        </Typography>
      </Box>

      <ImageList
        images={images}
        onImageClick={handleImageClick}
        onImageDelete={handleDelete}
        onImageCopy={handleCopyUrl}
        onImagesReorder={(reorderedImages) => {
          setImages(reorderedImages);
          localStorage.setItem(imageService.STORAGE_KEY, JSON.stringify(reorderedImages));
        }}
      />

      <ImagePreview
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setPreviewData(null);
          setCurrentFile(null);
        }}
        onConfirm={handleConfirmUpload}
        previewData={previewData}
      />

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>图片详情</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                文件名：{selectedImage.name}
                <br />
                原始大小：{(selectedImage.originalSize || 0 / 1024).toFixed(2)} KB
                <br />
                压缩后大小：{(selectedImage.size / 1024).toFixed(2)} KB
                <br />
                尺寸：{selectedImage.width} × {selectedImage.height}
                <br />
                格式：{selectedImage.format}
                <br />
                上传时间：{new Date(selectedImage.uploadTime).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>关闭</Button>
          {selectedImage && (
            <>
              <Button
                onClick={() => handleDelete(selectedImage.id)}
                color="error"
                startIcon={<DeleteIcon />}
              >
                删除
              </Button>
              <Button
                onClick={() => handleCopyUrl(selectedImage.url)}
                color="primary"
                variant="contained"
                startIcon={<CopyIcon />}
              >
                复制链接
              </Button>
            </>
          )}
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
    </Box>
  );
};