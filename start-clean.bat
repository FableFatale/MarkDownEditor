@echo off
echo 正在清除缓存并启动Markdown编辑器...
rmdir /s /q node_modules\.vite
npm run dev -- --force
