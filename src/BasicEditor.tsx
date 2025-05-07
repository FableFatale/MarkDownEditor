import React from 'react';
import './BasicEditor.css';

const BasicEditor: React.FC = () => {
  const handleReturn = () => {
    window.history.back();
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1>Markdown编辑器</h1>
      </div>
      <div className="editor-content">
        <p>如果您看到此内容，说明React应用已正确加载。</p>
        <button className="return-button" onClick={handleReturn}>
          返回页面
        </button>
      </div>
    </div>
  );
};

export default BasicEditor;
