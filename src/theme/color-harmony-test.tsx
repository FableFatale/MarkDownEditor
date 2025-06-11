import React from 'react';

/**
 * 颜色协调性测试组件
 * 用于验证所有颜色是否协调一致
 */
export const ColorHarmonyTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8 unified-theme">
      <h1 className="text-3xl font-bold text-primary">颜色协调性测试</h1>
      
      {/* 主色调展示 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">主色调 (Primary Colors)</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-100 rounded-lg border"></div>
            <p className="text-sm">Primary 100</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-300 rounded-lg border"></div>
            <p className="text-sm">Primary 300</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-500 rounded-lg border"></div>
            <p className="text-sm">Primary 500</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-700 rounded-lg border"></div>
            <p className="text-sm">Primary 700</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-primary-900 rounded-lg border"></div>
            <p className="text-sm">Primary 900</p>
          </div>
        </div>
      </section>

      {/* 辅助色调展示 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">辅助色调 (Secondary Colors)</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="w-20 h-20 bg-secondary-100 rounded-lg border"></div>
            <p className="text-sm">Secondary 100</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-secondary-300 rounded-lg border"></div>
            <p className="text-sm">Secondary 300</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-secondary-500 rounded-lg border"></div>
            <p className="text-sm">Secondary 500</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-secondary-700 rounded-lg border"></div>
            <p className="text-sm">Secondary 700</p>
          </div>
          <div className="space-y-2">
            <div className="w-20 h-20 bg-secondary-900 rounded-lg border"></div>
            <p className="text-sm">Secondary 900</p>
          </div>
        </div>
      </section>

      {/* 按钮样式测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">按钮样式测试</h2>
        <div className="flex space-x-4">
          <button className="btn-primary px-4 py-2 rounded-md">
            主要按钮
          </button>
          <button className="btn-secondary px-4 py-2 rounded-md">
            次要按钮
          </button>
          <button className="toolbar-button p-2 rounded-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>

      {/* 卡片样式测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">卡片样式测试</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">卡片标题</h3>
            <p className="text-secondary">这是一个测试卡片，用于验证颜色协调性。</p>
            <a href="#" className="link mt-2 inline-block">了解更多</a>
          </div>
          <div className="card p-4 rounded-lg">
            <h3 className="font-semibold mb-2">另一个卡片</h3>
            <p className="text-secondary">这是另一个测试卡片，确保样式一致。</p>
            <a href="#" className="link mt-2 inline-block">查看详情</a>
          </div>
        </div>
      </section>

      {/* 输入框样式测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">输入框样式测试</h2>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="普通输入框" 
            className="input-field w-full p-2 rounded-md"
          />
          <textarea 
            placeholder="文本区域" 
            className="input-field w-full p-2 rounded-md h-24 resize-none"
          />
        </div>
      </section>

      {/* 工具栏样式测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">工具栏样式测试</h2>
        <div className="toolbar p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <button className="toolbar-button p-2 rounded-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-button p-2 rounded-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="toolbar-button p-2 rounded-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 颜色变量展示 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">CSS 变量测试</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">主要颜色</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor: 'var(--color-primary-500)'}}></div>
                <span>--color-primary-500</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor: 'var(--color-primary-600)'}}></div>
                <span>--color-primary-600</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">背景颜色</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border" style={{backgroundColor: 'var(--bg-primary)'}}></div>
                <span>--bg-primary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border" style={{backgroundColor: 'var(--bg-secondary)'}}></div>
                <span>--bg-secondary</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ColorHarmonyTest;
