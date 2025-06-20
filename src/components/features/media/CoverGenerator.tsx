import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  FormatColorFill as ColorIcon,
  TextFields as TextIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import html2canvas from 'html2canvas';

interface CoverTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
}

interface CoverGeneratorProps {
  onSave: (coverUrl: string) => void;
  onClose: () => void;
}

const defaultTemplates: CoverTemplate[] = [
  {
    id: 'template1',
    name: '标准模板',
    width: 900,
    height: 383,
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    fontSize: 36,
    fontFamily: 'Arial'
  },
  {
    id: 'template2',
    name: '简约模板',
    width: 900,
    height: 383,
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    fontSize: 32,
    fontFamily: 'Helvetica'
  },
  // 可以添加更多预设模板
];

export const CoverGenerator: React.FC<CoverGeneratorProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CoverTemplate>(defaultTemplates[0]);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(selectedTemplate.fontSize);
  const [textColor, setTextColor] = useState(selectedTemplate.textColor);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFontSize(selectedTemplate.fontSize);
    setTextColor(selectedTemplate.textColor);
  }, [selectedTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomBackground(null);
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2, // 提高导出图片质量
          useCORS: true // 允许加载跨域图片
        });
        const coverUrl = canvas.toDataURL('image/png');
        onSave(coverUrl);
      } catch (error) {
        console.error('封面图生成失败:', error);
      }
    }
  };

  return (
    <Dialog open maxWidth="lg" fullWidth onClose={onClose}>
      <DialogTitle>生成文章封面</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* 左侧编辑区 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>模板选择</Typography>
              <FormControl fullWidth>
                <InputLabel>选择模板</InputLabel>
                <Select
                  value={selectedTemplate.id}
                  onChange={(e) => handleTemplateChange(e.target.value as string)}
                  label="选择模板"
                >
                  {defaultTemplates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>文字内容</Typography>
              <TextField
                fullWidth
                label="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="副标题"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                margin="normal"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>字体设置</Typography>
              <Typography gutterBottom>字体大小</Typography>
              <Slider
                value={fontSize}
                onChange={(_, value) => setFontSize(value as number)}
                min={12}
                max={72}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
              <Box sx={{ mt: 2 }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '100%', height: '40px' }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>背景设置</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="background-image-input"
                type="file"
                onChange={handleBackgroundImageChange}
              />
              <label htmlFor="background-image-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  上传背景图片
                </Button>
              </label>
            </Box>
          </Grid>

          {/* 右侧预览区 */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>预览</Typography>
            <Paper
              ref={previewRef}
              sx={{
                width: selectedTemplate.width,
                height: selectedTemplate.height,
                backgroundColor: customBackground ? 'transparent' : selectedTemplate.backgroundColor,
                backgroundImage: customBackground ? `url(${customBackground})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                mx: 'auto'
              }}
            >
              <Typography
                variant="h3"
                align="center"
                sx={{
                  color: textColor,
                  fontSize: fontSize,
                  fontFamily: selectedTemplate.fontFamily,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  wordBreak: 'break-word'
                }}
              >
                {title || '输入文章标题'}
              </Typography>
              {subtitle && (
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    color: textColor,
                    fontSize: fontSize * 0.6,
                    fontFamily: selectedTemplate.fontFamily,
                    mt: 2,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    wordBreak: 'break-word'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          生成封面
        </Button>
      </DialogActions>
    </Dialog>
  );
};