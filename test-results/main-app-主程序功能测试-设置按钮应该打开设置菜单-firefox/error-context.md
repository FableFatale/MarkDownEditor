# Test info

- Name: 主程序功能测试 >> 设置按钮应该打开设置菜单
- Location: D:\MarkDownEditor\e2e\main-app.spec.ts:66:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3003/", waiting until "load"

    at D:\MarkDownEditor\e2e\main-app.spec.ts:6:16
```

# Page snapshot

```yaml
- heading "Unable to connect" [level=1]
- paragraph: Firefox can’t establish a connection to the server at localhost:3003.
- paragraph
- list:
  - listitem: The site could be temporarily unavailable or too busy. Try again in a few moments.
  - listitem: If you are unable to load any pages, check your computer’s network connection.
  - listitem: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
- button "Try Again"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('主程序功能测试', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // 访问主程序页面
>  6 |     await page.goto('/');
     |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
   7 |     // 等待页面加载完成
   8 |     await page.waitForLoadState('networkidle');
   9 |   });
   10 |
   11 |   test('页面应该正确加载', async ({ page }) => {
   12 |     // 检查页面标题
   13 |     await expect(page).toHaveTitle(/Markdown编辑器|Markdown Editor/);
   14 |
   15 |     // 检查编辑器区域是否存在
   16 |     await expect(page.locator('.editor-container')).toBeVisible();
   17 |
   18 |     // 检查预览区域标题是否存在（更具体的选择器）
   19 |     await expect(page.locator('h6:has-text("预览区域")')).toBeVisible();
   20 |
   21 |     // 检查工具栏按钮是否存在
   22 |     await expect(page.locator('button[aria-label*="主题"], button[title*="主题"]')).toBeVisible();
   23 |   });
   24 |
   25 |   test('主题切换功能应该正常工作', async ({ page }) => {
   26 |     // 使用更具体的选择器查找主题切换按钮
   27 |     const themeButton = page.locator('button[title*="切换到深色模式"], button[aria-label*="切换到深色模式"]').first();
   28 |     await expect(themeButton).toBeVisible();
   29 |
   30 |     // 点击主题切换按钮
   31 |     await themeButton.click();
   32 |
   33 |     // 等待主题切换完成
   34 |     await page.waitForTimeout(1000);
   35 |
   36 |     // 验证页面主题已改变（检查html的data-theme属性）
   37 |     const themeAttr = await page.locator('html').getAttribute('data-theme');
   38 |     expect(themeAttr).toBe('dark');
   39 |
   40 |     // 验证按钮文本已更改
   41 |     await expect(page.locator('button[title*="切换到浅色模式"], button[aria-label*="切换到浅色模式"]')).toBeVisible();
   42 |   });
   43 |
   44 |   test('全屏功能应该正常工作', async ({ page }) => {
   45 |     // 查找全屏按钮
   46 |     const fullscreenButton = page.getByRole('button', { name: /进入全屏/ });
   47 |     await expect(fullscreenButton).toBeVisible();
   48 |
   49 |     // 点击全屏按钮
   50 |     await fullscreenButton.click();
   51 |
   52 |     // 等待全屏状态改变
   53 |     await page.waitForTimeout(500);
   54 |
   55 |     // 验证按钮文本已更改
   56 |     await expect(page.getByRole('button', { name: /退出全屏/ })).toBeVisible();
   57 |
   58 |     // 退出全屏
   59 |     await page.getByRole('button', { name: /退出全屏/ }).click();
   60 |     await page.waitForTimeout(500);
   61 |
   62 |     // 验证按钮文本恢复
   63 |     await expect(page.getByRole('button', { name: /进入全屏/ })).toBeVisible();
   64 |   });
   65 |
   66 |   test('设置按钮应该打开设置菜单', async ({ page }) => {
   67 |     // 查找设置按钮
   68 |     const settingsButton = page.getByRole('button', { name: /设置/ });
   69 |     await expect(settingsButton).toBeVisible();
   70 |
   71 |     // 点击设置按钮
   72 |     await settingsButton.click();
   73 |
   74 |     // 等待菜单出现
   75 |     await page.waitForTimeout(300);
   76 |
   77 |     // 验证设置菜单项出现
   78 |     await expect(page.getByText('主题设置')).toBeVisible();
   79 |     await expect(page.getByText('布局设置')).toBeVisible();
   80 |
   81 |     // 点击页面其他地方关闭菜单
   82 |     await page.click('body', { position: { x: 100, y: 100 } });
   83 |     await page.waitForTimeout(300);
   84 |   });
   85 |
   86 |   test('主题设置对话框应该正常工作', async ({ page }) => {
   87 |     // 打开设置菜单
   88 |     await page.getByRole('button', { name: /设置/ }).click();
   89 |     await page.waitForTimeout(300);
   90 |
   91 |     // 点击主题设置
   92 |     await page.getByText('主题设置').click();
   93 |
   94 |     // 等待对话框出现
   95 |     await page.waitForTimeout(500);
   96 |
   97 |     // 验证对话框内容
   98 |     await expect(page.getByRole('dialog')).toBeVisible();
   99 |     await expect(page.getByText('主题设置')).toBeVisible();
  100 |     await expect(page.getByText('浅色模式')).toBeVisible();
  101 |     await expect(page.getByText('深色模式')).toBeVisible();
  102 |
  103 |     // 测试主题切换
  104 |     await page.getByText('深色模式').click();
  105 |
  106 |     // 点击保存按钮
```