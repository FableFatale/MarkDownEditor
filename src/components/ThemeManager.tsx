import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ColorPicker } from 'material-ui-color';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../theme/ThemeContext';
import { ThemeMode } from '../types/theme';

const fontOptions = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Courier New',
  'Verdana',
  'Roboto',
  'system-ui',
];

export const ThemeManager: React.FC = () => {
  const { theme, updateTheme, toggleTheme } = useThemeContext();

  const handleModeChange = (mode: ThemeMode) => {
    updateTheme({ mode });
  };

  const handleFontSizeChange = (_: Event, value: number | number[]) => {
    updateTheme({ fontSize: value as number });
  };

  const handleLineHeightChange = (_: Event, value: number | number[]) => {
    updateTheme({ lineHeight: value as number });
  };

  const handlePrimaryColorChange = (color: any) => {
    updateTheme({ primaryColor: `#${color.hex}` });
  };

  return (
    <Paper elevation={3} sx={{
      p: 3,
      maxWidth: 600,
      margin: '20px auto',
      transition: 'all 0.3s ease-in-out',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">主题设置</Typography>
        <Tooltip title={theme.mode === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>主题模式</InputLabel>
        <Select
          value={theme.mode}
          onChange={(e) => handleModeChange(e.target.value as ThemeMode)}
          label="主题模式"
        >
          <MenuItem value="light">浅色</MenuItem>
          <MenuItem value="dark">深色</MenuItem>
          <MenuItem value="system">跟随系统</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>字体</InputLabel>
        <Select
          value={theme.fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value as string })}
          label="字体"
        >
          {fontOptions.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>字体大小</Typography>
        <Slider
          value={theme.fontSize}
          onChange={handleFontSizeChange}
          min={12}
          max={24}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>行高</Typography>
        <Slider
          value={theme.lineHeight}
          onChange={handleLineHeightChange}
          min={1}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>主题色</Typography>
        <ColorPicker
          value={theme.primaryColor.replace('#', '')}
          onChange={handlePrimaryColorChange}
        />
      </Box>
    </Paper>
  );
};