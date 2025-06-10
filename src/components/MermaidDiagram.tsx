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

export const MermaidDiagram: React.FC<MermaidDiagramProps> = React.memo(({
  chart,
  className = ''
}) => {
  const theme = useTheme();
  const [showMiniMap, setShowMiniMap] = useState(true);

  // 解析Mermaid代码
  const flowData = useMemo(() => {
    try {
      const result = parseMermaidToFlow(chart);
      return result;
    } catch (error) {
      console.error('❌ Mermaid解析失败:', error);
      return null;
    }
  }, [chart]);

  // 直接从 flowData 计算 nodes 和 edges，避免状态同步问题
  const nodes = useMemo(() => {
    if (!flowData || !flowData.nodes) {
      return [];
    }

    // 简化验证逻辑，只检查必要字段
    const validNodes = flowData.nodes.filter(node => {
      return node && node.id && node.data && node.position;
    });

    return validNodes.length > 0 ? validNodes : flowData.nodes; // 如果验证失败，使用原始数据
  }, [flowData]);

  const edges = useMemo(() => {
    if (!flowData || !flowData.edges) {
      return [];
    }

    // 简化验证逻辑
    const validEdges = flowData.edges.filter(edge => {
      return edge && edge.id && edge.source && edge.target;
    });

    return validEdges.length > 0 ? validEdges : flowData.edges; // 如果验证失败，使用原始数据
  }, [flowData]);

  // 使用 ReactFlow 的 hooks 来管理状态变化
  const [, , onNodesChange] = useNodesState(nodes);
  const [, , onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Connection) => {
      // 由于我们使用的是只读模式，这里不需要实际处理连接
    },
    []
  );

  // 优化小地图切换函数
  const toggleMiniMap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMiniMap(prev => !prev);
  }, []);

  // 优化 MiniMap 样式计算
  const miniMapStyle = useMemo(() => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#27282B' : '#F7F8FA',
    border: `1px solid ${theme.palette.divider}`,
    width: 120,
    height: 80
  }), [theme.palette.mode, theme.palette.divider]);

  const miniMapNodeColor = useMemo(() =>
    theme.palette.mode === 'dark' ? '#5E6AD2' : '#1976d2'
  , [theme.palette.mode]);

  const miniMapMaskColor = useMemo(() =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  , [theme.palette.mode]);

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
              onClick={toggleMiniMap}
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
      <Box sx={{
        height: 'calc(100% - 48px)',
        minHeight: '400px',
        width: '100%',
        position: 'relative'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 2
          }}
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            animated: false,
            style: { strokeWidth: 2 }
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          selectNodesOnDrag={false}
          style={{ width: '100%', height: '100%' }}
          className="react-flow-mermaid"
        >
          <Controls />

          {/* 临时调试信息显示 */}
          {nodes.length === 0 && flowData && flowData.nodes.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #ff6b6b',
              zIndex: 1000,
              textAlign: 'center'
            }}>
              <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '10px' }}>
                ⚠️ ReactFlow 渲染问题
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                解析节点数: {flowData?.nodes?.length || 0}<br/>
                当前节点数: {nodes.length}<br/>
                解析边数: {flowData?.edges?.length || 0}<br/>
                当前边数: {edges.length}
              </div>
            </div>
          )}

          {showMiniMap && (
            <MiniMap
              style={miniMapStyle}
              position="bottom-right"
              nodeColor={miniMapNodeColor}
              maskColor={miniMapMaskColor}
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
}, (prevProps, nextProps) => {
  // 只有当 chart 内容真正改变时才重新渲染
  return prevProps.chart === nextProps.chart && prevProps.className === nextProps.className;
});

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
