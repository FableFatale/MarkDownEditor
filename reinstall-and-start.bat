@echo off
echo 正在重新安装依赖并启动Markdown编辑器...
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
