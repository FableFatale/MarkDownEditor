import React, { useCallback, useMemo, useState } from 'react';
import { Box, Typography, useTheme, Alert, IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { parseMermaidToFlow } from '../utils/mermaidParser';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  className = ''
}) => {
  console.log('🚀 ReactFlow版本的MermaidDiagram开始渲染，chart:', chart?.substring(0, 50));

  const theme = useTheme();
  const [showMiniMap, setShowMiniMap] = useState(true);

  console.log('🗺️ MiniMap状态:', showMiniMap);

  // 解析Mermaid代码
  const flowData = useMemo(() => {
    try {
      console.log('🔍 开始解析Mermaid代码...');
      const result = parseMermaidToFlow(chart);
      console.log('✅ 解析成功:', result);
      return result;
    } catch (error) {
      console.error('❌ 解析失败:', error);
      return null;
    }
  }, [chart]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData?.edges || []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 如果解析失败，显示错误信息
  if (!flowData) {
    return (
      <Box className={className} sx={{ my: 2 }}>
        <Alert severity="error">
          <Typography variant="subtitle2" gutterBottom>
            ❌ 图表解析失败
          </Typography>
          <Typography variant="body2" component="pre" sx={{
            fontFamily: 'monospace',
            fontSize: '12px',
            backgroundColor: theme.palette.grey[100],
            p: 1,
            borderRadius: 1,
            mt: 1,
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {chart}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // 如果没有节点，显示提示
  if (flowData.nodes.length === 0) {
    return (
      <Box className={className} sx={{ my: 2 }}>
        <Alert severity="info">
          <Typography variant="subtitle2">
            📊 空图表
          </Typography>
          <Typography variant="body2">
            请添加节点和连接线来创建图表
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        my: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        height: '500px', // 固定高度
        position: 'relative'
      }}
    >
      {/* 标题栏 */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>🎯</span>
          <Typography variant="subtitle2" fontWeight="bold">
            React Flow 图表 ({flowData.nodes.length} 节点, {flowData.edges.length} 连接)
          </Typography>
        </Box>

        {/* MiniMap 切换按钮 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.primary.contrastText,
              opacity: 0.8,
              fontSize: '12px'
            }}
          >
            小地图:
          </Typography>
          <Tooltip title={showMiniMap ? "隐藏小地图" : "显示小地图"}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 切换MiniMap状态:', showMiniMap, '->', !showMiniMap);
                setShowMiniMap(!showMiniMap);
              }}
              sx={{
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {showMiniMap ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* React Flow 图表 */}
      <Box sx={{ height: 'calc(100% - 48px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            animated: false,
            style: { strokeWidth: 2 }
          }}
        >
          <Controls />
          {showMiniMap && (
            <MiniMap
              style={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                width: 120,
                height: 80
              }}
              position="bottom-right"
            />
          )}
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color={theme.palette.divider}
          />
        </ReactFlow>
      </Box>
    </Box>
  );


};

// 用于检测是否为Mermaid代码块的工具函数
const isMermaidCode = (language: string): boolean => {
  const mermaidLanguages = [
    'mermaid',
    'mmd',
    'flowchart',
    'sequence',
    'sequenceDiagram',
    'gantt',
    'classDiagram',
    'stateDiagram',
    'journey',
    'gitgraph',
    'pie',
    'requirement',
    'er',
    'erDiagram'
  ];

  return mermaidLanguages.includes(language.toLowerCase());
};

export { isMermaidCode };

export default MermaidDiagram;
