import { test, expect } from '@playwright/test';

test.describe('主程序功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主程序页面
    await page.goto('/');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('页面应该正确加载', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/Markdown编辑器|Markdown Editor/);

    // 检查编辑器区域是否存在
    await expect(page.locator('.editor-container')).toBeVisible();

    // 检查预览区域标题是否存在（更具体的选择器）
    await expect(page.locator('h6:has-text("预览区域")')).toBeVisible();

    // 检查工具栏按钮是否存在
    await expect(page.locator('button[aria-label*="主题"], button[title*="主题"]')).toBeVisible();
  });

  test('主题切换功能应该正常工作', async ({ page }) => {
    // 使用更具体的选择器查找主题切换按钮
    const themeButton = page.locator('button[title*="切换到深色模式"], button[aria-label*="切换到深色模式"]').first();
    await expect(themeButton).toBeVisible();

    // 点击主题切换按钮
    await themeButton.click();

    // 等待主题切换完成
    await page.waitForTimeout(1000);

    // 验证页面主题已改变（检查html的data-theme属性）
    const themeAttr = await page.locator('html').getAttribute('data-theme');
    expect(themeAttr).toBe('dark');

    // 验证按钮文本已更改
    await expect(page.locator('button[title*="切换到浅色模式"], button[aria-label*="切换到浅色模式"]')).toBeVisible();
  });

  test('全屏功能应该正常工作', async ({ page }) => {
    // 查找全屏按钮
    const fullscreenButton = page.getByRole('button', { name: /进入全屏/ });
    await expect(fullscreenButton).toBeVisible();

    // 点击全屏按钮
    await fullscreenButton.click();

    // 等待全屏状态改变
    await page.waitForTimeout(500);

    // 验证按钮文本已更改
    await expect(page.getByRole('button', { name: /退出全屏/ })).toBeVisible();

    // 退出全屏
    await page.getByRole('button', { name: /退出全屏/ }).click();
    await page.waitForTimeout(500);

    // 验证按钮文本恢复
    await expect(page.getByRole('button', { name: /进入全屏/ })).toBeVisible();
  });

  test('设置按钮应该打开设置菜单', async ({ page }) => {
    // 查找设置按钮
    const settingsButton = page.getByRole('button', { name: /设置/ });
    await expect(settingsButton).toBeVisible();

    // 点击设置按钮
    await settingsButton.click();

    // 等待菜单出现
    await page.waitForTimeout(300);

    // 验证设置菜单项出现
    await expect(page.getByText('主题设置')).toBeVisible();
    await expect(page.getByText('布局设置')).toBeVisible();

    // 点击页面其他地方关闭菜单
    await page.click('body', { position: { x: 100, y: 100 } });
    await page.waitForTimeout(300);
  });

  test('主题设置对话框应该正常工作', async ({ page }) => {
    // 打开设置菜单
    await page.getByRole('button', { name: /设置/ }).click();
    await page.waitForTimeout(300);

    // 点击主题设置
    await page.getByText('主题设置').click();

    // 等待对话框出现
    await page.waitForTimeout(500);

    // 验证对话框内容
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('主题设置')).toBeVisible();
    await expect(page.getByText('浅色模式')).toBeVisible();
    await expect(page.getByText('深色模式')).toBeVisible();

    // 测试主题切换
    await page.getByText('深色模式').click();

    // 点击保存按钮
    await page.getByRole('button', { name: '保存' }).click();

    // 等待成功消息出现
    await page.waitForTimeout(500);
    await expect(page.getByText('主题设置已保存')).toBeVisible();

    // 等待消息消失
    await page.waitForTimeout(3500);
  });

  test('布局设置对话框应该正常工作', async ({ page }) => {
    // 打开设置菜单
    await page.getByRole('button', { name: /设置/ }).click();
    await page.waitForTimeout(300);

    // 点击布局设置
    await page.getByText('布局设置').click();

    // 等待对话框出现
    await page.waitForTimeout(500);

    // 验证对话框内容
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('布局设置')).toBeVisible();
    await expect(page.getByText(/编辑器宽度:/)).toBeVisible();
    await expect(page.getByText('显示行号')).toBeVisible();
    await expect(page.getByText('自动换行')).toBeVisible();

    // 点击保存按钮
    await page.getByRole('button', { name: '保存' }).click();

    // 等待成功消息出现
    await page.waitForTimeout(500);
    await expect(page.getByText('布局设置已保存')).toBeVisible();

    // 等待消息消失
    await page.waitForTimeout(3500);
  });

  test('字数统计应该显示正确信息', async ({ page }) => {
    // 验证字数统计存在
    await expect(page.getByText(/字数/)).toBeVisible();
    await expect(page.getByText(/字符/)).toBeVisible();

    // 验证显示的是数字
    const wordCountText = await page.getByText(/字数/).textContent();
    expect(wordCountText).toMatch(/\d+/);
  });

  test('预览区域应该正确显示内容', async ({ page }) => {
    // 验证预览区域存在
    await expect(page.getByText('预览区域')).toBeVisible();

    // 验证预览内容存在
    await expect(page.getByText('欢迎使用 Markdown 编辑器')).toBeVisible();
  });

  test('深色模式下预览区域应该是深色背景', async ({ page }) => {
    // 切换到深色模式
    await page.getByRole('button', { name: /切换到深色模式/ }).click();
    await page.waitForTimeout(1000);

    // 检查预览区域的背景色
    const previewBgColor = await page.locator('.preview-content').evaluate((el) => {
      return window.getComputedStyle(el.closest('[data-theme="dark"]') || el).backgroundColor;
    });

    // 深色模式下背景应该不是白色
    expect(previewBgColor).not.toBe('rgb(255, 255, 255)');
  });
});
