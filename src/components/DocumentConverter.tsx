import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

interface DocumentConverterProps {
  onConvert: (markdown: string) => void;
}

export const DocumentConverter: React.FC<DocumentConverterProps> = ({ onConvert }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>(
    {open: false, message: '', severity: 'success'}
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // 检查文件类型
    const fileType = file.type;
    if (![
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/html',
      'text/plain'
    ].includes(fileType)) {
      setSnackbar({
        open: true,
        message: '不支持的文件格式，请上传Word文档(.docx)、HTML或纯文本文件',
        severity: 'error'
      });
      return;
    }

    setIsConverting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        let markdown = '';

        // 根据文件类型进行相应的转换
        switch (fileType) {
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            // TODO: 实现Word到Markdown的转换
            markdown = await convertWordToMarkdown(content);
            break;
          case 'text/html':
            markdown = await convertHtmlToMarkdown(content);
            break;
          case 'text/plain':
            markdown = content; // 纯文本直接作为Markdown
            break;
        }

        onConvert(markdown);
        setSnackbar({open: true, message: '文档转换成功', severity: 'success'});
      };

      reader.onerror = () => {
        setSnackbar({open: true, message: '文件读取失败', severity: 'error'});
      };

      if (fileType === 'text/plain' || fileType === 'text/html') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      setSnackbar({open: true, message: '文档转换失败', severity: 'error'});
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Word文档转Markdown
  const convertWordToMarkdown = async (content: string): Promise<string> => {
    // TODO: 使用mammoth.js或其他库实现Word到Markdown的转换
    return content;
  };

  // HTML转Markdown
  const convertHtmlToMarkdown = async (content: string): Promise<string> => {
    // TODO: 使用turndown或其他库实现HTML到Markdown的转换
    return content;
  };

  return (
    <Box>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          bgcolor: (theme) => dragActive 
            ? theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'action.hover'
            : theme.palette.mode === 'dark'
              ? 'rgba(18, 18, 18, 0.5)'
              : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.03)' 
              : 'action.hover'
          }
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('document-input')?.click()}
      >
        <input
          type="file"
          id="document-input"
          accept=".docx,text/html,text/plain"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        {
          isConverting ? (
            <CircularProgress size={48} sx={{ mb: 2 }} />
          ) : (
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          )
        }
        <Typography variant="h6" gutterBottom>
          拖拽文档到此处或点击上传
        </Typography>
        <Typography variant="body2" color="text.secondary">
          支持Word文档(.docx)、HTML和纯文本文件
        </Typography>
      </Box>

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