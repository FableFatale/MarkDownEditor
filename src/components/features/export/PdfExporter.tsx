import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import { PictureAsPdfRounded, SettingsRounded, CloseRounded } from '@mui/icons-material';

interface PdfExporterProps {
  contentRef: React.RefObject<HTMLElement>;
  fileName?: string;
  buttonText?: string;
  className?: string;
}

export const PdfExporter: React.FC<PdfExporterProps> = ({
  contentRef,
  fileName = 'document.pdf',
  buttonText = '导出PDF',
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // PDF设置
  const [pdfSettings, setPdfSettings] = useState({
    filename: fileName,
    margin: 10,
    pageSize: 'A4',
    orientation: 'portrait',
    enableLinks: true,
    includeImages: true,
    customCSS: '',
  });
  
  // 处理设置变更
  const handleSettingChange = (field: string, value: any) => {
    setPdfSettings({
      ...pdfSettings,
      [field]: value,
    });
  };
  
  // 导出PDF
  const exportToPdf = async () => {
    if (!contentRef.current) {
      setErrorMessage('无法找到要导出的内容');
      setShowError(true);
      return;
    }
    
    try {
      setIsExporting(true);
      
      // 克隆内容以便应用自定义样式而不影响原始内容
      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(contentClone);
      
      // 应用自定义CSS
      if (pdfSettings.customCSS) {
        const styleElement = document.createElement('style');
        styleElement.textContent = pdfSettings.customCSS;
        tempContainer.appendChild(styleElement);
      }
      
      // 配置html2pdf选项
      const options = {
        margin: pdfSettings.margin,
        filename: pdfSettings.filename.endsWith('.pdf') 
          ? pdfSettings.filename 
          : `${pdfSettings.filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          imageTimeout: 15000,
          removeContainer: true,
        },
        jsPDF: {
          unit: 'mm',
          format: pdfSettings.pageSize,
          orientation: pdfSettings.orientation,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      
      // 执行PDF导出
      await html2pdf().from(tempContainer).set(options).save();
      
      setShowSuccess(true);
    } catch (error) {
      console.error('PDF导出失败:', error);
      setErrorMessage(error instanceof Error ? error.message : '导出过程中发生错误');
      setShowError(true);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <>
      <Box className={className} sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfRounded />}
          onClick={exportToPdf}
          disabled={isExporting}
          size="small"
        >
          {buttonText}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<SettingsRounded />}
          onClick={() => setShowSettings(true)}
          size="small"
        >
          设置
        </Button>
      </Box>
      
      {/* 设置对话框 */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          PDF导出设置
          <IconButton
            aria-label="close"
            onClick={() => setShowSettings(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="文件名"
              value={pdfSettings.filename}
              onChange={(e) => handleSettingChange('filename', e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              helperText="如果不包含.pdf后缀，将自动添加"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>页面大小</InputLabel>
                <Select
                  value={pdfSettings.pageSize}
                  onChange={(e) => handleSettingChange('pageSize', e.target.value)}
                  label="页面大小"
                >
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="A5">A5</MenuItem>
                  <MenuItem value="letter">Letter</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>方向</InputLabel>
                <Select
                  value={pdfSettings.orientation}
                  onChange={(e) => handleSettingChange('orientation', e.target.value)}
                  label="方向"
                >
                  <MenuItem value="portrait">纵向</MenuItem>
                  <MenuItem value="landscape">横向</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="页边距 (mm)"
              type="number"
              value={pdfSettings.margin}
              onChange={(e) => handleSettingChange('margin', Number(e.target.value))}
              fullWidth
              variant="outlined"
              size="small"
              inputProps={{ min: 0, max: 50 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={pdfSettings.enableLinks}
                    onChange={(e) => handleSettingChange('enableLinks', e.target.checked)}
                  />
                }
                label="保留链接"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={pdfSettings.includeImages}
                    onChange={(e) => handleSettingChange('includeImages', e.target.checked)}
                  />
                }
                label="包含图片"
              />
            </Box>
            
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                自定义CSS（可选）
              </Typography>
              <TextField
                value={pdfSettings.customCSS}
                onChange={(e) => handleSettingChange('customCSS', e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                multiline
                rows={4}
                placeholder="@page { size: A4; margin: 10mm; } h1 { color: blue; }"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} color="primary">
            取消
          </Button>
          <Button 
            onClick={() => {
              setShowSettings(false);
              exportToPdf();
            }} 
            color="primary" 
            variant="contained"
          >
            导出
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 通知消息 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          PDF导出成功
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage || 'PDF导出失败'}
        </Alert>
      </Snackbar>
    </>
  );
};

// 辅助组件
const IconButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button
    {...props}
    sx={{
      minWidth: 'auto',
      width: 32,
      height: 32,
      borderRadius: '50%',
      p: 0,
      ...props.sx,
    }}
  >
    {children}
  </Button>
);

export default PdfExporter;
