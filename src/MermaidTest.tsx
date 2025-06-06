import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button, ButtonGroup } from '@mui/material';
import { MermaidDiagram } from './components/MermaidDiagram';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

// 简单测试 - 只使用基本功能
const simpleChart = `graph TD
    A[开始] --> B[结束]`;

// 三节点测试 - 线性结构（分行写）
const threeNodeChart = `graph TD
    A[开始] --> B[中间]
    B[中间] --> C[结束]`;

// 分支测试 - 简单分支
const branchChart = `graph TD
    A[开始] --> B[选择]
    B --> C[选项A]
    B --> D[选项B]`;

// 中等复杂度测试 - 包含中文和不同形状
const mediumChart = `graph TD
    A[开始] --> B{判断条件}
    B --> C[执行操作A]
    B --> D[执行操作B]
    C --> E[结束]
    D --> E`;

// 复杂测试 - 包含标签（可能有问题）
const complexChart = `graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E`;

// 当前使用的测试图表
const testChart = mediumChart;

const MermaidTest: React.FC = () => {
  const [currentChart, setCurrentChart] = useState<'simple' | 'three' | 'branch' | 'medium' | 'complex'>('simple');

  const getChart = () => {
    switch (currentChart) {
      case 'simple': return simpleChart;
      case 'three': return threeNodeChart;
      case 'branch': return branchChart;
      case 'medium': return mediumChart;
      case 'complex': return complexChart;
      default: return simpleChart;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mermaid 小地图测试
        </Typography>
        <Typography variant="body1" gutterBottom>
          这是一个专门用于测试 Mermaid 图表小地图功能的页面。
          请查看图表右上角的小地图切换按钮，点击眼睛图标来切换小地图的显示/隐藏。
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          请打开浏览器控制台查看调试信息。
        </Typography>

        {/* 测试图表切换按钮 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            选择测试图表：
          </Typography>
          <ButtonGroup variant="outlined" aria-label="chart selection">
            <Button
              variant={currentChart === 'simple' ? 'contained' : 'outlined'}
              onClick={() => setCurrentChart('simple')}
              size="small"
            >
              2节点
            </Button>
            <Button
              variant={currentChart === 'three' ? 'contained' : 'outlined'}
              onClick={() => setCurrentChart('three')}
              size="small"
            >
              3节点线性
            </Button>
            <Button
              variant={currentChart === 'branch' ? 'contained' : 'outlined'}
              onClick={() => setCurrentChart('branch')}
              size="small"
            >
              简单分支
            </Button>
            <Button
              variant={currentChart === 'medium' ? 'contained' : 'outlined'}
              onClick={() => setCurrentChart('medium')}
              size="small"
            >
              复杂分支
            </Button>
            <Button
              variant={currentChart === 'complex' ? 'contained' : 'outlined'}
              onClick={() => setCurrentChart('complex')}
              size="small"
            >
              带标签
            </Button>
          </ButtonGroup>
        </Box>

        <MermaidDiagram chart={getChart()} />
      </Box>
    </ThemeProvider>
  );
};

export default MermaidTest;
