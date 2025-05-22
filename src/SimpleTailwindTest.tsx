import React from 'react';

const SimpleTailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Tailwind CSS 测试
          </div>
          <h1 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
            这是一个简单的Tailwind CSS测试组件
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            如果你能看到这个组件的样式正确应用，说明Tailwind CSS配置成功。
          </p>
          <div className="mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              切换暗/亮模式
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTailwindTest;
