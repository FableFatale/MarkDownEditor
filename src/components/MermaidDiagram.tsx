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

  // 添加useEffect来监听状态变化
  React.useEffect(() => {
    console.log('🔄 MiniMap状态变化:', showMiniMap);
  }, [showMiniMap]);

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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 当flowData变化时，手动更新nodes和edges
  React.useEffect(() => {
    if (flowData) {
      console.log('🎯 ReactFlow接收到的节点数据:', flowData.nodes);
      console.log('🎯 ReactFlow接收到的边数据:', flowData.edges);

      // 手动设置节点和边
      setNodes(flowData.nodes);
      setEdges(flowData.edges);

      console.log('🔄 手动更新ReactFlow状态');
    }
  }, [flowData, setNodes, setEdges]);

  // 调试当前状态
  React.useEffect(() => {
    console.log('🎯 当前nodes状态:', nodes);
    console.log('🎯 当前edges状态:', edges);
  }, [nodes, edges]);

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
                console.log('🔄 按钮被点击！当前状态:', showMiniMap, '即将切换到:', !showMiniMap);
                const newState = !showMiniMap;
                setShowMiniMap(newState);
                console.log('✅ setShowMiniMap 已调用，新状态:', newState);

                // 延迟检查状态是否真的更新了
                setTimeout(() => {
                  console.log('⏰ 延迟检查 - 期望状态:', newState);
                }, 100);
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
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          selectNodesOnDrag={false}
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
          {/* 调试信息 */}
          {console.log('🎯 渲染时 MiniMap 显示状态:', showMiniMap, showMiniMap ? '应该显示' : '应该隐藏')}
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
