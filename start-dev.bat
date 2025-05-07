@echo off
chcp 65001 >nul
echo 正在启动 Markdown 编辑器开发服务器...
echo 将自动查找可用端口...

echo.
npm run dev

echo.
echo 按任意键关闭服务器...
pause >nul