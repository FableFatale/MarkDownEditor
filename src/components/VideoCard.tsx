import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
  platform: string;
  url: string;
}

interface VideoCardProps {
  video: VideoInfo;
  onCopy: (markdown: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onCopy }) => {
  const handleCopy = () => {
    // 生成视频的 Markdown 链接
    const markdown = `[${video.title}](${video.url})`;
    onCopy(markdown);
  };

  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={video.thumbnail}
        alt={video.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          作者: {video.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          平台: {video.platform}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Link href={video.url} target="_blank" rel="noopener noreferrer">
            <IconButton size="small" color="primary">
              <PlayIcon />
            </IconButton>
          </Link>
          <Tooltip title="复制 Markdown 链接">
            <IconButton size="small" onClick={handleCopy}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};