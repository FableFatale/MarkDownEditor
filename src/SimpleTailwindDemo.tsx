import React from 'react';
import './styles/main.css';

const SimpleTailwindDemo: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            简单的Tailwind CSS测试
          </div>
          <h1 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
            这是一个简单的Tailwind CSS测试组件
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            如果你能看到这个组件的样式正确应用，说明Tailwind CSS配置成功。
          </p>
          <div className="mt-4 flex space-x-2">
            <button className="btn btn-primary">
              主要按钮
            </button>
            <button className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
              次要按钮
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-4 py-2 rounded-lg"
          onClick={() => document.documentElement.classList.toggle('dark')}
        >
          切换暗/亮模式
        </button>
      </div>
    </div>
  );
};

export default SimpleTailwindDemo;
