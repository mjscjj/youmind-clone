import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 移除 StrictMode 避免双重渲染问题
const root = createRoot(document.getElementById('root')!)
root.render(<App />)

// 错误处理
window.onerror = (msg, url, line) => {
  console.error('Error:', msg, url, line)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `<div style="color: red; padding: 20px; background: #1a1a1a; margin: 20px; border-radius: 8px;">
      <h2>❌ 渲染错误</h2>
      <p>${msg}</p>
      <p>行号：${line}</p>
    </div>`
  }
}
