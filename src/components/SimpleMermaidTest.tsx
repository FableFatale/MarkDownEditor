import React, { useCallback } from 'react';
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

// 硬编码的测试数据，模拟 mermaidParser 的输出
const testNodes: Node[] = [
  {
    id: 'A',
    type: 'default',
    position: { x: 0, y: 0 },
    data: { label: '开始' },
    style: {
      backgroundColor: '#e1f5fe',
      border: '2px solid #0277bd',
      borderRadius: '6px',
      padding: '12px 16px',
      minWidth: '80px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500'
    }
  },
  {
    id: 'B',
    type: 'default',
    position: { x: 250, y: 0 },
    data: { label: '结束' },
    style: {
      backgroundColor: '#e1f5fe',
      border: '2px solid #0277bd',
      borderRadius: '6px',
      padding: '12px 16px',
      minWidth: '80px',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500'
    }
  }
];

const testEdges: Edge[] = [
  {
    id: 'A-B',
    source: 'A',
    target: 'B',
    type: 'default',
    style: {
      strokeWidth: 2,
      stroke: '#666'
    }
  }
];

export const SimpleMermaidTest: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(testNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(testEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  console.log('🧪 SimpleMermaidTest 渲染');
  console.log('📊 节点:', nodes);
  console.log('🔗 边:', edges);

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <h3 style={{ margin: '10px', color: '#333' }}>简单 Mermaid 测试 (硬编码数据)</h3>
      <div style={{ width: '100%', height: '550px' }}>
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
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          selectNodesOnDrag={false}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SimpleMermaidTest;
