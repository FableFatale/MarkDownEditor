import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  TextField
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Code as HtmlIcon,
  Description as WordIcon,
  GetApp as DownloadIcon,
  Close as CloseIcon,
  FileDownload as ExportIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  TextSnippet as TextIcon
} from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  extension: string;
  mimeType: string;
  available: boolean;
}

interface MultiFormatExporterProps {
  open: boolean;
  onClose: () => void;
  content: string;
  previewRef?: React.RefObject<HTMLElement>;
  className?: string;
}

export const MultiFormatExporter: React.FC<MultiFormatExporterProps> = ({
  open,
  onClose,
  content,
  previewRef,
  className = ''
}) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customFileName, setCustomFileName] = useState('document');

  // 导出格式配置
  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF文档',
      description: '便携式文档格式，适合打印和分享',
      icon: <PdfIcon />,
      extension: 'pdf',
      mimeType: 'application/pdf',
      available: true
    },
    {
      id: 'html',
      name: 'HTML网页',
      description: '超文本标记语言，可在浏览器中查看',
      icon: <HtmlIcon />,
      extension: 'html',
      mimeType: 'text/html',
      available: true
    },
    {
      id: 'docx',
      name: 'Word文档',
      description: 'Microsoft Word格式文档',
      icon: <WordIcon />,
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      available: false // 需要额外的库支持
    },
    {
      id: 'markdown',
      name: 'Markdown文件',
      description: '原始Markdown格式文件',
      icon: <TextIcon />,
      extension: 'md',
      mimeType: 'text/markdown',
      available: true
    },
    {
      id: 'txt',
      name: '纯文本',
      description: '去除格式的纯文本文件',
      icon: <TextIcon />,
      extension: 'txt',
      mimeType: 'text/plain',
      available: true
    },
    {
      id: 'image',
      name: '图片格式',
      description: '将内容转换为PNG图片',
      icon: <ImageIcon />,
      extension: 'png',
      mimeType: 'image/png',
      available: true
    }
  ];

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev => {
      if (prev.includes(formatId)) {
        return prev.filter(id => id !== formatId);
      } else {
        return [...prev, formatId];
      }
    });
  };

  const exportToPdf = async (): Promise<Blob> => {
    if (!previewRef?.current) {
      throw new Error('预览内容不可用');
    }

    const element = previewRef.current;
    const opt = {
      margin: 1,
      filename: `${customFileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    return new Promise((resolve, reject) => {
      html2pdf()
        .from(element)
        .set(opt)
        .outputPdf('blob')
        .then((pdfBlob: Blob) => resolve(pdfBlob))
        .catch(reject);
    });
  };

  const exportToHtml = (): Blob => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${customFileName}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
      color: #333;
    }
    pre { 
      background: #f4f4f4; 
      padding: 10px; 
      border-radius: 4px; 
      overflow-x: auto; 
      border-left: 4px solid #007acc;
    }
    code { 
      background: #f4f4f4; 
      padding: 2px 4px; 
      border-radius: 2px; 
      font-family: 'Courier New', monospace;
    }
    blockquote { 
      border-left: 4px solid #ddd; 
      margin: 0; 
      padding-left: 20px; 
      color: #666; 
      font-style: italic;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
  </style>
</head>
<body>
${previewRef?.current?.innerHTML || ''}
</body>
</html>`;
    return new Blob([htmlContent], { type: 'text/html' });
  };

  const exportToMarkdown = (): Blob => {
    return new Blob([content], { type: 'text/markdown' });
  };

  const exportToText = (): Blob => {
    const textContent = content.replace(/[#*`_\[\]()]/g, '').replace(/\n\s*\n/g, '\n\n');
    return new Blob([textContent], { type: 'text/plain' });
  };

  const exportToImage = async (): Promise<Blob> => {
    if (!previewRef?.current) {
      throw new Error('预览内容不可用');
    }

    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  };

  const handleExport = async () => {
    if (selectedFormats.length === 0) {
      setErrorMessage('请至少选择一种导出格式');
      setShowError(true);
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const totalFormats = selectedFormats.length;
      let completedFormats = 0;

      for (const formatId of selectedFormats) {
        const format = exportFormats.find(f => f.id === formatId);
        if (!format || !format.available) continue;

        let blob: Blob;
        const fileName = `${customFileName}.${format.extension}`;

        switch (formatId) {
          case 'pdf':
            blob = await exportToPdf();
            break;
          case 'html':
            blob = exportToHtml();
            break;
          case 'markdown':
            blob = exportToMarkdown();
            break;
          case 'txt':
            blob = exportToText();
            break;
          case 'image':
            blob = await exportToImage();
            break;
          default:
            continue;
        }

        saveAs(blob, fileName);
        completedFormats++;
        setExportProgress((completedFormats / totalFormats) * 100);

        // 添加小延迟以避免浏览器阻塞
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setShowSuccess(true);
      setSelectedFormats([]);
    } catch (error) {
      console.error('导出失败:', error);
      setErrorMessage(error instanceof Error ? error.message : '导出过程中发生错误');
      setShowError(true);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const selectAllAvailable = () => {
    const availableFormats = exportFormats.filter(f => f.available).map(f => f.id);
    setSelectedFormats(availableFormats);
  };

  const clearSelection = () => {
    setSelectedFormats([]);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={className}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ExportIcon color="primary" />
              <Typography variant="h6">多格式导出</Typography>
              {selectedFormats.length > 0 && (
                <Chip
                  label={`已选择 ${selectedFormats.length} 种格式`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="文件名"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              fullWidth
              size="small"
              helperText="不需要包含文件扩展名"
            />
          </Box>

          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={selectAllAvailable}
            >
              全选可用格式
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={clearSelection}
            >
              清空选择
            </Button>
          </Box>

          <List>
            {exportFormats.map((format) => (
              <ListItem key={format.id} disablePadding>
                <Paper
                  sx={{
                    width: '100%',
                    mb: 1,
                    border: selectedFormats.includes(format.id) ? 2 : 1,
                    borderColor: selectedFormats.includes(format.id) ? 'primary.main' : 'divider',
                    opacity: format.available ? 1 : 0.5
                  }}
                >
                  <ListItemButton
                    onClick={() => format.available && handleFormatToggle(format.id)}
                    disabled={!format.available}
                  >
                    <ListItemIcon>
                      {format.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {format.name}
                          </Typography>
                          {!format.available && (
                            <Chip label="即将推出" size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondary={format.description}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFormats.includes(format.id)}
                          disabled={!format.available}
                        />
                      }
                      label=""
                      sx={{ mr: 0 }}
                    />
                  </ListItemButton>
                </Paper>
              </ListItem>
            ))}
          </List>

          {isExporting && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                正在导出... {Math.round(exportProgress)}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={exportProgress}
                  size={20}
                />
                <Typography variant="caption" color="text.secondary">
                  请稍候，正在生成文件...
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isExporting}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={selectedFormats.length === 0 || isExporting}
            startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
          >
            {isExporting ? '导出中...' : `导出 (${selectedFormats.length})`}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          导出完成！文件已开始下载。
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage || '导出失败'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MultiFormatExporter;
