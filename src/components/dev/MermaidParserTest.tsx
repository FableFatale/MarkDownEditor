import React from 'react';
import { parseMermaidToFlow } from '../utils/mermaidParser';

export const MermaidParserTest: React.FC = () => {
  const testChart = `graph TD
    A[开始] --> B[结束]`;

  console.log('🧪 测试 Mermaid 解析器');
  
  try {
    const result = parseMermaidToFlow(testChart);
    console.log('✅ 解析结果:', result);
    
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Mermaid 解析器测试</h3>
        <div style={{ marginBottom: '20px' }}>
          <h4>输入:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {testChart}
          </pre>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>解析结果:</h4>
          <div>节点数量: {result.nodes.length}</div>
          <div>边数量: {result.edges.length}</div>
          <div>方向: {result.direction}</div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>节点详情:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(result.nodes, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4>边详情:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(result.edges, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ 解析失败:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>解析失败</h3>
        <pre>{String(error)}</pre>
      </div>
    );
  }
};

export default MermaidParserTest;
