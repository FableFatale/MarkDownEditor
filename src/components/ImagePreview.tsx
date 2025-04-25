import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { ImageCompressOptions } from '../types/image';

interface ImagePreviewProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: ImageCompressOptions) => void;
  previewData: {
    originalSize: number;
    compressedSize: number;
    width: number;
    height: number;
    format: string;
    previewUrl: string;
  } | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  open,
  onClose,
  onConfirm,
  previewData,
}) => {
  const [options, setOptions] = React.useState<ImageCompressOptions>({
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'webp',
  });

  const handleQualityChange = (_event: Event, newValue: number | number[]) => {
    setOptions({ ...options, quality: (newValue as number) / 100 });
  };

  const handleFormatChange = (event: { target: { value: any } }) => {
    setOptions({ ...options, format: event.target.value });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!previewData) return null;

  const compressionRatio = ((1 - previewData.compressedSize / previewData.originalSize) * 100).toFixed(1);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>图片预览与压缩设置</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              src={previewData.previewUrl}
              alt="预览图"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                图片信息
              </Typography>
              <Typography variant="body2" color="text.secondary">
                原始大小：{formatSize(previewData.originalSize)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                压缩后：{formatSize(previewData.compressedSize)}
                （节省 {compressionRatio}%）
              </Typography>
              <Typography variant="body2" color="text.secondary">
                尺寸：{previewData.width} × {previewData.height}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                格式：{previewData.format}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                压缩质量
              </Typography>
              <Slider
                value={options.quality! * 100}
                onChange={handleQualityChange}
                aria-labelledby="quality-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={100}
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="format-select-label">输出格式</InputLabel>
              <Select
                labelId="format-select-label"
                value={options.format}
                label="输出格式"
                onChange={handleFormatChange}
              >
                <MenuItem value="webp">WebP（推荐）</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="png">PNG</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onConfirm(options)} variant="contained" color="primary">
          确认上传
        </Button>
      </DialogActions>
    </Dialog>
  );
};