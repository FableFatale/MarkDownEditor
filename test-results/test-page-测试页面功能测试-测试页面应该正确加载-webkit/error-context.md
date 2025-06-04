# Test info

- Name: 测试页面功能测试 >> 测试页面应该正确加载
- Location: D:\MarkDownEditor\e2e\test-page.spec.ts:11:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)

Locator: locator(':root')
Expected pattern: /Markdown Editor/
Received string:  "Markdown编辑器"
Call log:
  - expect.toHaveTitle with timeout 5000ms
  - waiting for locator(':root')
    5 × locator resolved to <html lang="zh-CN" data-theme="light">…</html>
      - unexpected value "Markdown编辑器"

    at D:\MarkDownEditor\e2e\test-page.spec.ts:13:24
```

# Page snapshot

```yaml
- heading "功能测试页面" [level=6]
- paragraph: "当前主题: 浅色模式 | 全屏状态: 未开启"
- button "切换主题"
- button "进入全屏"
- banner:
  - paragraph: 字数：195
  - paragraph: 字符：300
  - paragraph: 预计阅读：1分钟
  - button "切换到深色模式"
  - button "进入全屏"
  - button "设置"
- button "导出PDF"
- button "设置"
- banner:
  - button "粗体 (Ctrl+B)"
  - button "斜体 (Ctrl+I)"
  - button "引用 (Ctrl+Q)"
  - button "代码块 (Ctrl+Alt+E)"
  - button "链接 (Ctrl+K)"
  - button "图片 (Ctrl+Alt+I)"
  - button "表格 (Ctrl+Alt+T)"
  - button "无序列表 (Ctrl+U)"
  - button "有序列表 (Ctrl+O)"
  - button "切换深色模式"
  - button "进入全屏"
- textbox
- text: 预览区域
- heading "标题样式设置" [level=6]
- text: 标题样式
- combobox: 默认样式
- heading "测试页面" [level=1]
- paragraph: 这是一个测试页面，用于验证以下功能：
- heading "1. 深色模式预览" [level=2]
- paragraph: 切换到深色模式，预览区域应该也变成深色背景。
- heading "2. 全屏功能" [level=2]
- paragraph: 点击全屏按钮，应该能够进入和退出全屏模式。
- heading "3. 设置按钮" [level=2]
- paragraph: 点击齿轮图标，应该显示设置菜单。
- heading "测试内容" [level=2]
- heading "代码块测试" [level=3]
- code: "function test() { console.log('Hello World'); }"
- heading "表格测试" [level=3]
- table:
  - rowgroup:
    - row "功能 状态 备注":
      - cell "功能"
      - cell "状态"
      - cell "备注"
  - rowgroup:
    - row "深色模式 ✅ 预览区域正确响应主题":
      - cell "深色模式"
      - cell "✅"
      - cell "预览区域正确响应主题"
    - row "全屏模式 ✅ 按钮功能正常":
      - cell "全屏模式"
      - cell "✅"
      - cell "按钮功能正常"
    - row "设置菜单 ✅ 齿轮按钮有反应":
      - cell "设置菜单"
      - cell "✅"
      - cell "齿轮按钮有反应"
- heading "引用测试" [level=3]
- blockquote:
  - paragraph: 这是一个引用块，用于测试深色模式下的样式。
- heading "列表测试" [level=3]
- list:
  - listitem: 项目 1
  - listitem:
    - text: 项目 2
    - list:
      - listitem: 子项目 2.1
      - listitem: 子项目 2.2
  - listitem: 项目 3
- list:
  - listitem: 有序列表项 1
  - listitem: 有序列表项 2
  - listitem: 有序列表项 3
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('测试页面功能测试', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // 访问测试页面
   6 |     await page.goto('/?test-page');
   7 |     // 等待页面加载完成
   8 |     await page.waitForLoadState('networkidle');
   9 |   });
   10 |
   11 |   test('测试页面应该正确加载', async ({ page }) => {
   12 |     // 检查页面标题
>  13 |     await expect(page).toHaveTitle(/Markdown Editor/);
      |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)
   14 |     
   15 |     // 检查测试页面特有的元素
   16 |     await expect(page.getByText('功能测试页面')).toBeVisible();
   17 |     await expect(page.getByText(/当前主题:/)).toBeVisible();
   18 |     await expect(page.getByText(/全屏状态:/)).toBeVisible();
   19 |   });
   20 |
   21 |   test('测试页面主题切换功能', async ({ page }) => {
   22 |     // 验证初始状态
   23 |     await expect(page.getByText('当前主题: 浅色模式')).toBeVisible();
   24 |     
   25 |     // 点击工具栏的主题切换按钮
   26 |     await page.getByRole('button', { name: /切换到深色模式/ }).click();
   27 |     await page.waitForTimeout(500);
   28 |     
   29 |     // 验证状态更新
   30 |     await expect(page.getByText('当前主题: 深色模式')).toBeVisible();
   31 |     await expect(page.getByRole('button', { name: /切换到浅色模式/ })).toBeVisible();
   32 |     
   33 |     // 也可以通过测试页面的按钮切换
   34 |     await page.getByRole('button', { name: '切换主题' }).click();
   35 |     await page.waitForTimeout(500);
   36 |     
   37 |     // 验证切换回浅色模式
   38 |     await expect(page.getByText('当前主题: 浅色模式')).toBeVisible();
   39 |   });
   40 |
   41 |   test('测试页面全屏功能', async ({ page }) => {
   42 |     // 验证初始状态
   43 |     await expect(page.getByText('全屏状态: 未开启')).toBeVisible();
   44 |     
   45 |     // 点击工具栏的全屏按钮
   46 |     await page.getByRole('button', { name: /进入全屏/ }).click();
   47 |     await page.waitForTimeout(500);
   48 |     
   49 |     // 验证状态更新
   50 |     await expect(page.getByText('全屏状态: 已开启')).toBeVisible();
   51 |     await expect(page.getByRole('button', { name: /退出全屏/ })).toBeVisible();
   52 |     
   53 |     // 退出全屏
   54 |     await page.getByRole('button', { name: /退出全屏/ }).click();
   55 |     await page.waitForTimeout(500);
   56 |     
   57 |     // 验证状态恢复
   58 |     await expect(page.getByText('全屏状态: 未开启')).toBeVisible();
   59 |   });
   60 |
   61 |   test('测试页面设置对话框功能', async ({ page }) => {
   62 |     // 打开设置菜单
   63 |     await page.getByRole('button', { name: /设置/ }).click();
   64 |     await page.waitForTimeout(300);
   65 |     
   66 |     // 点击主题设置
   67 |     await page.getByText('主题设置').click();
   68 |     await page.waitForTimeout(500);
   69 |     
   70 |     // 验证主题设置对话框
   71 |     await expect(page.getByRole('dialog')).toBeVisible();
   72 |     await expect(page.getByText('主题设置')).toBeVisible();
   73 |     
   74 |     // 测试字体大小滑块
   75 |     const fontSizeSlider = page.locator('input[type="range"]').first();
   76 |     await fontSizeSlider.fill('16');
   77 |     
   78 |     // 测试行高滑块
   79 |     const lineHeightSlider = page.locator('input[type="range"]').nth(1);
   80 |     await lineHeightSlider.fill('1.8');
   81 |     
   82 |     // 测试自动保存开关
   83 |     await page.getByText('自动保存').click();
   84 |     
   85 |     // 保存设置
   86 |     await page.getByRole('button', { name: '保存' }).click();
   87 |     await page.waitForTimeout(500);
   88 |     
   89 |     // 验证成功消息
   90 |     await expect(page.getByText('主题设置已保存')).toBeVisible();
   91 |     await page.waitForTimeout(3500);
   92 |   });
   93 |
   94 |   test('测试页面布局设置功能', async ({ page }) => {
   95 |     // 打开设置菜单
   96 |     await page.getByRole('button', { name: /设置/ }).click();
   97 |     await page.waitForTimeout(300);
   98 |     
   99 |     // 点击布局设置
  100 |     await page.getByText('布局设置').click();
  101 |     await page.waitForTimeout(500);
  102 |     
  103 |     // 验证布局设置对话框
  104 |     await expect(page.getByRole('dialog')).toBeVisible();
  105 |     await expect(page.getByText('布局设置')).toBeVisible();
  106 |     
  107 |     // 测试编辑器宽度滑块
  108 |     const editorWidthSlider = page.locator('input[type="range"]');
  109 |     await editorWidthSlider.fill('60');
  110 |     
  111 |     // 测试显示行号开关
  112 |     await page.getByText('显示行号').click();
  113 |     
```