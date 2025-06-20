import React from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { Box, Typography } from '@mui/material';

export const MermaidTest: React.FC = () => {
  const testChart = `graph TD
    A[开始] --> B[结束]`;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mermaid测试组件
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        如果下面显示了一个简单的流程图，说明Mermaid功能正常工作。
      </Typography>
      <MermaidDiagram chart={testChart} />
    </Box>
  );
};

export default MermaidTest;
