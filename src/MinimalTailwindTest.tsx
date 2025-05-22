import React from 'react';

const MinimalTailwindTest = () => (
  <div className="p-4 bg-blue-100">
    <h1 className="text-2xl font-bold text-blue-800">Tailwind CSS 测试</h1>
    <p className="text-gray-600">这是一个最小化的Tailwind CSS测试组件</p>
    <button 
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      onClick={() => alert('Tailwind CSS 工作正常!')}
    >
      点击测试
    </button>
  </div>
);

export default MinimalTailwindTest;
