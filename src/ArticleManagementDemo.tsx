import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import { ArticleManagerDemo } from './components/ArticleManagerDemo';

// 创建主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

/**
 * 文章管理演示页面
 * 这是一个独立的页面，用于测试文章分类管理功能
 */
function ArticleManagementDemo() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Markdown编辑器 - 文章管理系统
          </Typography>
          <ArticleManagerDemo />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ArticleManagementDemo;