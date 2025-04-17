import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './markdown-styles.css'
import './modern-fonts.css' // 引入现代字体样式

// 添加全局样式以实现平滑过渡效果
const style = document.createElement('style')
style.textContent = `
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  button, a {
    transition: all 0.2s ease-in-out;
  }
  
  button:hover, a:hover {
    transform: translateY(-2px);
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)