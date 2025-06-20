import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider,
  Chip
} from '@mui/material';
import {
  Image as ImageIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Palette as PaletteIcon,
  TextFields as TextIcon,
  AspectRatio as RatioIcon
} from '@mui/icons-material';

interface CoverImageGeneratorProps {
  open: boolean;
  onClose: () => void;
  content: string;
  className?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cover-tabpanel-${index}`}
      aria-labelledby={`cover-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const CoverImageGenerator: React.FC<CoverImageGeneratorProps> = ({
  open,
  onClose,
  content,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 封面设置
  const [coverSettings, setCoverSettings] = useState({
    title: '',
    subtitle: '',
    author: '',
    backgroundColor: '#4F46E5',
    textColor: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'Arial, sans-serif',
    layout: 'center' as 'center' | 'left' | 'right',
    aspectRatio: '2.35:1' as '2.35:1' | '16:9' | '4:3' | '1:1',
    width: 1200,
    height: 510 // 2.35:1 比例
  });

  // 预设主题
  const themes = [
    { name: '科技蓝', bg: '#4F46E5', text: '#FFFFFF' },
    { name: '商务灰', bg: '#374151', text: '#FFFFFF' },
    { name: '活力橙', bg: '#F59E0B', text: '#FFFFFF' },
    { name: '自然绿', bg: '#10B981', text: '#FFFFFF' },
    { name: '优雅紫', bg: '#8B5CF6', text: '#FFFFFF' },
    { name: '简约白', bg: '#FFFFFF', text: '#1F2937' },
    { name: '深邃黑', bg: '#111827', text: '#FFFFFF' },
    { name: '温暖红', bg: '#EF4444', text: '#FFFFFF' }
  ];

  // 从内容中提取标题
  useEffect(() => {
    if (content && !coverSettings.title) {
      const lines = content.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      if (titleLine) {
        const title = titleLine.replace('# ', '').trim();
        setCoverSettings(prev => ({ ...prev, title }));
      }
    }
  }, [content, coverSettings.title]);

  // 更新画布尺寸
  useEffect(() => {
    const ratios = {
      '2.35:1': { width: 1200, height: 510 },
      '16:9': { width: 1200, height: 675 },
      '4:3': { width: 1200, height: 900 },
      '1:1': { width: 1200, height: 1200 }
    };
    const { width, height } = ratios[coverSettings.aspectRatio];
    setCoverSettings(prev => ({ ...prev, width, height }));
  }, [coverSettings.aspectRatio]);

  // 绘制封面
  const drawCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = coverSettings.width;
    canvas.height = coverSettings.height;

    // 绘制背景
    ctx.fillStyle = coverSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置文字样式
    ctx.fillStyle = coverSettings.textColor;
    ctx.textAlign = coverSettings.layout === 'center' ? 'center' : coverSettings.layout as CanvasTextAlign;
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const leftX = canvas.width * 0.1;
    const rightX = canvas.width * 0.9;
    const x = coverSettings.layout === 'center' ? centerX : 
              coverSettings.layout === 'left' ? leftX : rightX;

    // 绘制标题
    if (coverSettings.title) {
      ctx.font = `bold ${coverSettings.fontSize}px ${coverSettings.fontFamily}`;
      const titleY = canvas.height * 0.4;
      
      // 处理长标题换行
      const maxWidth = canvas.width * 0.8;
      const words = coverSettings.title.split(' ');
      let line = '';
      let y = titleY;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += coverSettings.fontSize * 1.2;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    // 绘制副标题
    if (coverSettings.subtitle) {
      ctx.font = `${coverSettings.fontSize * 0.6}px ${coverSettings.fontFamily}`;
      const subtitleY = canvas.height * 0.6;
      ctx.fillText(coverSettings.subtitle, x, subtitleY);
    }

    // 绘制作者
    if (coverSettings.author) {
      ctx.font = `${coverSettings.fontSize * 0.4}px ${coverSettings.fontFamily}`;
      const authorY = canvas.height * 0.8;
      ctx.fillText(`作者：${coverSettings.author}`, x, authorY);
    }

    // 添加装饰元素
    drawDecorations(ctx, canvas.width, canvas.height);
  };

  // 绘制装饰元素
  const drawDecorations = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    
    // 添加渐变效果
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 添加几何装饰
    ctx.strokeStyle = coverSettings.textColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    
    // 绘制装饰线条
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.2);
    ctx.lineTo(width * 0.9, height * 0.2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.9);
    ctx.lineTo(width * 0.9, height * 0.9);
    ctx.stroke();

    ctx.restore();
  };

  // 重新绘制
  useEffect(() => {
    if (open) {
      setTimeout(drawCover, 100);
    }
  }, [open, coverSettings]);

  // 下载封面
  const downloadCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cover-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setShowSuccess(true);
        }
      }, 'image/png');
    } catch (error) {
      setErrorMessage('下载失败，请重试');
      setShowError(true);
    }
  };

  // 应用主题
  const applyTheme = (theme: typeof themes[0]) => {
    setCoverSettings(prev => ({
      ...prev,
      backgroundColor: theme.bg,
      textColor: theme.text
    }));
  };

  // 重置设置
  const resetSettings = () => {
    setCoverSettings(prev => ({
      ...prev,
      title: '',
      subtitle: '',
      author: '',
      backgroundColor: '#4F46E5',
      textColor: '#FFFFFF',
      fontSize: 48,
      fontFamily: 'Arial, sans-serif',
      layout: 'center'
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className={className}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon color="primary" />
              <Typography variant="h6">封面图生成器</Typography>
              <Chip
                label={coverSettings.aspectRatio}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 3, height: '70vh' }}>
            {/* 左侧设置面板 */}
            <Box sx={{ width: 350, overflow: 'auto' }}>
              <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <Tab icon={<TextIcon />} label="文字" />
                <Tab icon={<PaletteIcon />} label="样式" />
                <Tab icon={<RatioIcon />} label="尺寸" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="标题"
                    value={coverSettings.title}
                    onChange={(e) => setCoverSettings(prev => ({ ...prev, title: e.target.value }))}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="副标题"
                    value={coverSettings.subtitle}
                    onChange={(e) => setCoverSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="作者"
                    value={coverSettings.author}
                    onChange={(e) => setCoverSettings(prev => ({ ...prev, author: e.target.value }))}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>文字对齐</InputLabel>
                    <Select
                      value={coverSettings.layout}
                      onChange={(e) => setCoverSettings(prev => ({ ...prev, layout: e.target.value as any }))}
                    >
                      <MenuItem value="left">左对齐</MenuItem>
                      <MenuItem value="center">居中</MenuItem>
                      <MenuItem value="right">右对齐</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle2">预设主题</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {themes.map((theme) => (
                      <Button
                        key={theme.name}
                        variant="outlined"
                        size="small"
                        onClick={() => applyTheme(theme)}
                        sx={{
                          backgroundColor: theme.bg,
                          color: theme.text,
                          '&:hover': {
                            backgroundColor: theme.bg,
                            opacity: 0.8
                          }
                        }}
                      >
                        {theme.name}
                      </Button>
                    ))}
                  </Box>
                  
                  <Divider />
                  
                  <TextField
                    label="背景颜色"
                    type="color"
                    value={coverSettings.backgroundColor}
                    onChange={(e) => setCoverSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="文字颜色"
                    type="color"
                    value={coverSettings.textColor}
                    onChange={(e) => setCoverSettings(prev => ({ ...prev, textColor: e.target.value }))}
                    fullWidth
                  />
                  <Box>
                    <Typography gutterBottom>字体大小: {coverSettings.fontSize}px</Typography>
                    <Slider
                      value={coverSettings.fontSize}
                      onChange={(_, value) => setCoverSettings(prev => ({ ...prev, fontSize: value as number }))}
                      min={24}
                      max={72}
                      step={2}
                    />
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>宽高比</InputLabel>
                    <Select
                      value={coverSettings.aspectRatio}
                      onChange={(e) => setCoverSettings(prev => ({ ...prev, aspectRatio: e.target.value as any }))}
                    >
                      <MenuItem value="2.35:1">2.35:1 (公众号封面)</MenuItem>
                      <MenuItem value="16:9">16:9 (宽屏)</MenuItem>
                      <MenuItem value="4:3">4:3 (标准)</MenuItem>
                      <MenuItem value="1:1">1:1 (正方形)</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary">
                    尺寸: {coverSettings.width} × {coverSettings.height} 像素
                  </Typography>
                </Box>
              </TabPanel>
            </Box>

            {/* 右侧预览区域 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                预览
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={resetSettings} startIcon={<RefreshIcon />}>
            重置
          </Button>
          <Button onClick={onClose}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={downloadCover}
            startIcon={<DownloadIcon />}
          >
            下载封面
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
          封面图已下载成功！
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {errorMessage || '生成封面失败'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoverImageGenerator;
