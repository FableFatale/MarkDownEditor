import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ColorPicker } from 'material-ui-color';

interface ThemeSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
  isDarkMode: boolean;
}

const defaultTheme: ThemeSettings = {
  fontFamily: 'Arial',
  fontSize: 16,
  lineHeight: 1.5,
  textColor: '#000000',
  backgroundColor: '#ffffff',
  accentColor: '#1976d2',
  isDarkMode: false,
};

const fontOptions = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Courier New',
  'Verdana',
  'Roboto',
];

export const ThemeManager: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultTheme);
  const [previewText, setPreviewText] = useState('预览文本效果');
  const theme = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme) {
      setSettings(JSON.parse(savedTheme));
    }
  }, []);

  const handleSettingChange = (key: keyof ThemeSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('editorTheme', JSON.stringify(newSettings));

    // 应用主题设置到全局样式
    document.documentElement.style.setProperty('--editor-font-family', newSettings.fontFamily);
    document.documentElement.style.setProperty('--editor-font-size', `${newSettings.fontSize}px`);
    document.documentElement.style.setProperty('--editor-line-height', String(newSettings.lineHeight));
    document.documentElement.style.setProperty('--editor-text-color', newSettings.textColor);
    document.documentElement.style.setProperty('--editor-background-color', newSettings.backgroundColor);
    document.documentElement.style.setProperty('--editor-accent-color', newSettings.accentColor);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        主题设置
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.isDarkMode}
              onChange={(e) => handleSettingChange('isDarkMode', e.target.checked)}
            />
          }
          label="深色模式"
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>字体</InputLabel>
        <Select
          value={settings.fontFamily}
          onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
          label="字体"
        >
          {fontOptions.map((font) => (
            <MenuItem key={font} value={font}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>字体大小: {settings.fontSize}px</Typography>
        <Slider
          value={settings.fontSize}
          onChange={(_, value) => handleSettingChange('fontSize', value)}
          min={12}
          max={24}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>行高: {settings.lineHeight}</Typography>
        <Slider
          value={settings.lineHeight}
          onChange={(_, value) => handleSettingChange('lineHeight', value)}
          min={1}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>文本颜色</Typography>
        <ColorPicker
          value={settings.textColor}
          onChange={(color) => handleSettingChange('textColor', color.css.backgroundColor)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>背景颜色</Typography>
        <ColorPicker
          value={settings.backgroundColor}
          onChange={(color) => handleSettingChange('backgroundColor', color.css.backgroundColor)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>强调色</Typography>
        <ColorPicker
          value={settings.accentColor}
          onChange={(color) => handleSettingChange('accentColor', color.css.backgroundColor)}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>预览</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          sx={{
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
            lineHeight: settings.lineHeight,
            color: settings.textColor,
            backgroundColor: settings.backgroundColor,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: settings.accentColor,
              },
            },
          }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={() => {
          setSettings(defaultTheme);
          localStorage.setItem('editorTheme', JSON.stringify(defaultTheme));
        }}
        sx={{ mr: 1 }}
      >
        重置默认
      </Button>
    </Paper>
  );
};

export default ThemeManager;