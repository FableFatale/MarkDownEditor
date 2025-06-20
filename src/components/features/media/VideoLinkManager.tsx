import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { VideoCard } from './VideoCard';
import { videoService } from '../services/videoService';

interface VideoLinkManagerProps {
  onVideoLinkInsert: (markdown: string) => void;
  onClose: () => void;
}

export const VideoLinkManager: React.FC<VideoLinkManagerProps> = ({
  onVideoLinkInsert,
  onClose
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const handleUrlSubmit = async () => {
    if (!videoUrl.trim()) {
      setError('请输入视频链接');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await videoService.parseVideoUrl(videoUrl);
      if (result.success && result.video) {
        setVideoInfo(result.video);
        setError(null);
      } else {
        setError(result.error || '视频信息获取失败');
        setVideoInfo(null);
      }
    } catch (err) {
      setError('视频链接解析失败');
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (markdown: string) => {
    onVideoLinkInsert(markdown);
    setSnackbar({open: true, message: 'Markdown 链接已插入', severity: 'success'});
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        视频链接转换
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="输入视频链接"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="支持 Bilibili、YouTube 等平台的视频链接"
          error={!!error}
          helperText={error}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleUrlSubmit}
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} /> : '解析链接'}
        </Button>
      </Box>

      {videoInfo && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <VideoCard
              video={videoInfo}
              onCopy={handleCopy}
            />
          </Grid>
        </Grid>
      )}

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