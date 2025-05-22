import React from 'react';

const TailwindTest: React.FC = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Tailwind CSS 测试
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            这个组件用于测试Tailwind CSS是否正确工作。如果你能看到样式正确应用，说明Tailwind CSS配置成功。
          </p>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full bg-green-500"></div>
              <div className="w-8 h-8 rounded-full bg-red-500"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded transition-colors">
                主要按钮
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded transition-colors">
                次要按钮
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tailwind CSS v3.4.1 + Typography Plugin
          </p>
        </div>
      </div>

      <div className="mt-8 prose dark:prose-invert">
        <h2>Typography 插件测试</h2>
        <p>这段文字应该使用 Typography 插件的样式。</p>
        <ul>
          <li>列表项 1</li>
          <li>列表项 2</li>
          <li>列表项 3</li>
        </ul>
        <blockquote>
          这是一个引用块，应该有特殊的样式。
        </blockquote>
        <pre>
          <code>
            {`// 这是一段代码
function test() {
  console.log("Hello, Tailwind!");
}`}
          </code>
        </pre>
      </div>

      <div className="mt-8">
        <button
          className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-4 py-2 rounded-lg"
          onClick={toggleDarkMode}
        >
          切换暗/亮模式
        </button>
      </div>
    </div>
  );
};

export default TailwindTest;
