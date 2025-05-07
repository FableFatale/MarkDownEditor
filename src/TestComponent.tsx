import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginTop: '50px'
    }}>
      <h1 style={{ color: '#333' }}>测试组件</h1>
      <p>这是一个简单的测试组件，用于确认React渲染是否正常工作。</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('按钮点击成功！')}
      >
        点击我
      </button>
    </div>
  );
};

export default TestComponent;
