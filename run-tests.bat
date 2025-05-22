@echo off
echo 正在运行简单测试...
npx jest test\simple.test.js

echo.
echo 正在运行工具栏 UI 测试...
npx jest test\toolbar-ui.test.js

echo.
echo 正在运行工具栏位置测试...
npx jest test\toolbar-position.test.js

echo.
echo 正在运行编辑器工具栏布局测试...
npx jest test\editor-toolbar-layout.test.js

echo.
echo 正在运行统一工具栏测试...
npx jest test\unified-toolbar.test.js

pause
