import axios from 'axios';

interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
  platform: string;
  url: string;
}

interface VideoParseResult {
  success: boolean;
  video?: VideoInfo;
  error?: string;
}

class VideoService {
  private readonly platformPatterns = {
    bilibili: /bilibili\.com\/video\/([A-Za-z0-9]+)/,
    youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/
  };

  private readonly apiEndpoints = {
    bilibili: 'https://api.bilibili.com/x/web-interface/view',
    youtube: 'https://www.googleapis.com/youtube/v3/videos'
  };

  public async parseVideoUrl(url: string): Promise<VideoParseResult> {
    try {
      // 检测视频平台
      const platform = this.detectPlatform(url);
      if (!platform) {
        return {
          success: false,
          error: '不支持的视频平台'
        };
      }

      // 提取视频ID
      const videoId = this.extractVideoId(url, platform);
      if (!videoId) {
        return {
          success: false,
          error: '无效的视频链接'
        };
      }

      // 获取视频信息
      const videoInfo = await this.fetchVideoInfo(videoId, platform);
      return {
        success: true,
        video: videoInfo
      };
    } catch (error) {
      return {
        success: false,
        error: '视频信息获取失败'
      };
    }
  }

  private detectPlatform(url: string): string | null {
    for (const [platform, pattern] of Object.entries(this.platformPatterns)) {
      if (pattern.test(url)) {
        return platform;
      }
    }
    return null;
  }

  private extractVideoId(url: string, platform: string): string | null {
    const pattern = this.platformPatterns[platform as keyof typeof this.platformPatterns];
    const match = url.match(pattern);
    return match ? match[1] : null;
  }

  private async fetchVideoInfo(videoId: string, platform: string): Promise<VideoInfo> {
    switch (platform) {
      case 'bilibili':
        return this.fetchBilibiliInfo(videoId);
      case 'youtube':
        return this.fetchYoutubeInfo(videoId);
      default:
        throw new Error('不支持的平台');
    }
  }

  private async fetchBilibiliInfo(videoId: string): Promise<VideoInfo> {
    const response = await axios.get(`${this.apiEndpoints.bilibili}?bvid=${videoId}`);
    const data = response.data.data;

    return {
      title: data.title,
      thumbnail: data.pic,
      author: data.owner.name,
      platform: 'Bilibili',
      url: `https://www.bilibili.com/video/${videoId}`
    };
  }

  private async fetchYoutubeInfo(videoId: string): Promise<VideoInfo> {
    // 注意：需要配置 YouTube API Key
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(
      `${this.apiEndpoints.youtube}?id=${videoId}&key=${API_KEY}&part=snippet`
    );
    const data = response.data.items[0].snippet;

    return {
      title: data.title,
      thumbnail: data.thumbnails.high.url,
      author: data.channelTitle,
      platform: 'YouTube',
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
}

export const videoService = new VideoService();