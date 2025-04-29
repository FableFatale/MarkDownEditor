import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface WordCounterProps {
  text: string;
}

const WordCounter: React.FC<WordCounterProps> = ({ text }) => {
  const theme = useTheme();

  // 计算字数（中英文混合）
  const getWordCount = (text: string): number => {
    // 移除Markdown元素
    const cleanText = text
      // 移除代码块
      .replace(/```[\s\S]*?```/g, '')
      // 移除行内代码
      .replace(/`[^`]*`/g, '')
      // 移除图片
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // 移除链接
      .replace(/\[.*?\]\(.*?\)/g, '')
      // 移除HTML标签
      .replace(/<[^>]*>/g, '')
      // 移除标题标记
      .replace(/^#{1,6}\s/gm, '')
      // 移除列表标记
      .replace(/^[\-\*\+]\s/gm, '')
      // 移除数字列表
      .replace(/^\d+\.\s/gm, '')
      // 移除引用
      .replace(/^>\s/gm, '');

    // 匹配中文字符
    const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
    // 匹配英文单词（优化英文单词匹配规则）
    const englishWords = (cleanText.match(/[a-zA-Z]+(?:['''][a-zA-Z]+)*(?:-[a-zA-Z]+)*/g) || []).length;

    return chineseChars + englishWords;
  };

  // 计算字符数（不包括空格和换行符，排除Markdown语法字符）
  const getCharacterCount = (text: string): number => {
    const cleanText = text
      // 移除Markdown语法字符
      .replace(/[#*`_~\[\]()>\-+]/g, '')
      // 移除空白字符
      .replace(/\s/g, '')
      // 移除代码块
      .replace(/```[\s\S]*?```/g, '')
      // 移除HTML标签
      .replace(/<[^>]*>/g, '');
    return cleanText.length;
  };

  // 计算预计阅读时间（考虑中英文阅读速度差异）
  const getReadingTime = (text: string): string => {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+(?:['''][a-zA-Z]+)*(?:-[a-zA-Z]+)*/g) || []).length;
    
    // 中文阅读速度：300字/分钟，英文阅读速度：200词/分钟
    const minutes = Math.ceil((chineseChars / 300) + (englishWords / 200));
    return minutes < 1 ? '< 1分钟' : `${minutes}分钟`;
  };

  // 使用useMemo优化性能
  const stats = React.useMemo(() => {
    return {
      wordCount: getWordCount(text),
      characterCount: getCharacterCount(text),
      readingTime: getReadingTime(text)
    };
  }, [text]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        padding: { xs: '6px 12px', sm: '8px 16px' },
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Tooltip title="总字数（中英文）" arrow placement="top">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          字数：{stats.wordCount}
        </Typography>
      </Tooltip>

      <Box
        sx={{
          width: '1px',
          height: '1rem',
          backgroundColor: theme.palette.divider,
          mx: { xs: 0.5, sm: 1 }
        }}
      />

      <Tooltip title="字符数（不含空格和标记）" arrow placement="top">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          字符：{stats.characterCount}
        </Typography>
      </Tooltip>

      <Box
        sx={{
          width: '1px',
          height: '1rem',
          backgroundColor: theme.palette.divider,
          mx: { xs: 0.5, sm: 1 }
        }}
      />

      <Tooltip title="基于中文300字/分钟，英文200词/分钟的阅读速度" arrow placement="top">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          预计阅读：{stats.readingTime}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default WordCounter;