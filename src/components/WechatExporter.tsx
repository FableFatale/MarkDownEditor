import React, { useState, useRef } from 'react';
import { convertMarkdownToWechatHTML, WechatStyleOptions, defaultWechatStyles, getWechatSupportInfo } from '../services/wechatExportService';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  WechatOutlined as WechatIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';

interface WechatExporterProps {
  markdown: string;
  buttonText?: string;
  className?: string;
  id?: string;
  sx?: React.CSSProperties | any;
  onClose?: () => void;
}

/**
 * 微信公众号文章导出组件
 * 将Markdown内容转换为符合微信公众号格式要求的HTML
 */
export const WechatExporter: React.FC<WechatExporterProps> = ({
  markdown,
  buttonText = '导出到微信公众号',
  className = '',
  id,
  sx,
  onClose,
}) => {
  // 当组件通过父组件状态控制显示时，默认打开对话框
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'info'}>(
    {open: false, message: '', severity: 'success'}
  );
  const [isConverting, setIsConverting] = useState(false);
  const htmlContentRef = useRef<HTMLDivElement>(null);
  
  // 自定义样式选项
  const [customStyles, setCustomStyles] = useState<WechatStyleOptions>(defaultWechatStyles);

  // 处理样式变更
  const handleStyleChange = (field: string, value: string | boolean) => {
    setCustomStyles({
      ...customStyles,
      [field]: value,
    });
  };

  // 转换Markdown为微信兼容的HTML
  const convertToWechatHTML = () => {
    setIsConverting(true);
    
    try {
      // 使用服务进行转换
      const html = convertMarkdownToWechatHTML(markdown, customStyles);
      
      setIsConverting(false);
      return html;
    } catch (error) {
      console.error('转换失败:', error);
      setSnackbar({
        open: true,
        message: '转换失败，请检查Markdown内容',
        severity: 'error'
      });
      setIsConverting(false);
      return '';
    }
  };

  // 复制HTML到剪贴板
  const copyToClipboard = () => {
    if (!htmlContentRef.current) return;
    
    const html = htmlContentRef.current.innerHTML;
    navigator.clipboard.writeText(html)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'HTML已复制到剪贴板',
          severity: 'success'
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: '复制失败，请手动复制',
          severity: 'error'
        });
      });
  };

  // 处理对话框打开
  const handleOpen = () => {
    setOpen(true);
  };

  // 处理对话框关闭
  const handleClose = () => {
    setOpen(false);
    // 如果提供了onClose回调，则调用它
    if (onClose) {
      onClose();
    }
  };

  // 处理标签页切换
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 渲染微信公众号格式指南
  const renderWechatGuide = () => {
    const supportInfo = getWechatSupportInfo();
    
    return (
      <Box sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>微信公众号HTML/CSS支持说明</Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>支持的HTML标签</Typography>
        <Typography variant="body2" paragraph>
          {supportInfo.supportedTags.map((group, index) => (
            <React.Fragment key={`tags-${index}`}>
              {group.name}：{group.tags.map(tag => `&lt;${tag}&gt;`).join(', ')}<br />
            </React.Fragment>
          ))}
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>支持的CSS样式</Typography>
        <Typography variant="body2" paragraph>
          {supportInfo.supportedStyles.map((group, index) => (
            <React.Fragment key={`styles-${index}`}>
              {group.name}：{group.styles.join(', ')}<br />
            </React.Fragment>
          ))}
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>不支持的功能</Typography>
        <Typography variant="body2" paragraph>
          {supportInfo.unsupportedFeatures.map((group, index) => (
            <React.Fragment key={`unsupported-${index}`}>
              {group.name}：{group.features.join(', ')}<br />
            </React.Fragment>
          ))}
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>使用建议</Typography>
        <Typography variant="body2">
          {supportInfo.recommendations.map((recommendation, index) => (
            <React.Fragment key={`recommendation-${index}`}>
              {index + 1}. {recommendation}<br />
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      {/* 当通过父组件状态控制显示时，不需要显示按钮 */}
      {!onClose && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<WechatIcon />}
          onClick={handleOpen}
          className={className}
          size="medium"
          id={id}
          sx={sx}
        >
          {buttonText}
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          导出到微信公众号
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Tooltip title="查看微信公众号格式说明">
            <IconButton
              aria-label="help"
              onClick={() => setShowGuide(!showGuide)}
              sx={{ position: 'absolute', right: 48, top: 8 }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        {showGuide && (
          <Box sx={{ px: 3, pb: 2 }}>
            {renderWechatGuide()}
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="export tabs">
            <Tab label="预览" />
            <Tab label="HTML源码" />
            <Tab label="样式设置" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>预览（仅供参考，实际效果以微信显示为准）</Typography>
                <Box
                  ref={htmlContentRef}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    p: 2,
                    mt: 1,
                    maxHeight: '400px',
                    overflow: 'auto',
                    backgroundColor: '#fff',
                  }}
                  dangerouslySetInnerHTML={{ __html: convertToWechatHTML() }}
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">HTML源码（复制后粘贴到微信公众号编辑器）</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={copyToClipboard}
                  >
                    复制HTML
                  </Button>
                </Box>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  variant="outlined"
                  value={convertToWechatHTML()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  提示：在微信公众号编辑器中，点击"..."菜单，选择"插入代码"，然后粘贴此HTML代码
                </Typography>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="标题颜色"
                  type="text"
                  value={customStyles.titleColor}
                  onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="标题大小"
                  type="text"
                  value={customStyles.titleSize}
                  onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="副标题颜色"
                  type="text"
                  value={customStyles.subtitleColor}
                  onChange={(e) => handleStyleChange('subtitleColor', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="副标题大小"
                  type="text"
                  value={customStyles.subtitleSize}
                  onChange={(e) => handleStyleChange('subtitleSize', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="正文颜色"
                  type="text"
                  value={customStyles.textColor}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="正文大小"
                  type="text"
                  value={customStyles.textSize}
                  onChange={(e) => handleStyleChange('textSize', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="行高"
                  type="text"
                  value={customStyles.lineHeight}
                  onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="链接颜色"
                  type="text"
                  value={customStyles.linkColor}
                  onChange={(e) => handleStyleChange('linkColor', e.target.value)}
                  size="small"
                  fullWidth
                />
                <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={customStyles.useRoundedImages}
                        onChange={(e) => handleStyleChange('useRoundedImages', e.target.checked)}
                      />
                    }
                    label="图片圆角"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={customStyles.useImageShadow}
                        onChange={(e) => handleStyleChange('useImageShadow', e.target.checked)}
                      />
                    }
                    label="图片阴影"
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};