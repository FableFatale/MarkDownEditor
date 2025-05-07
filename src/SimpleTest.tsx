import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>简单测试页面</h1>
      <p>这是一个简单的测试页面，用于确认React渲染是否正常工作。</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: 'blue', 
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

export default SimpleTest;
