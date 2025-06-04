import { test, expect } from '@playwright/test';

test.describe('测试页面功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问测试页面
    await page.goto('/?test-page');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('测试页面应该正确加载', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/Markdown Editor/);
    
    // 检查测试页面特有的元素
    await expect(page.getByText('功能测试页面')).toBeVisible();
    await expect(page.getByText(/当前主题:/)).toBeVisible();
    await expect(page.getByText(/全屏状态:/)).toBeVisible();
  });

  test('测试页面主题切换功能', async ({ page }) => {
    // 验证初始状态
    await expect(page.getByText('当前主题: 浅色模式')).toBeVisible();
    
    // 点击工具栏的主题切换按钮
    await page.getByRole('button', { name: /切换到深色模式/ }).click();
    await page.waitForTimeout(500);
    
    // 验证状态更新
    await expect(page.getByText('当前主题: 深色模式')).toBeVisible();
    await expect(page.getByRole('button', { name: /切换到浅色模式/ })).toBeVisible();
    
    // 也可以通过测试页面的按钮切换
    await page.getByRole('button', { name: '切换主题' }).click();
    await page.waitForTimeout(500);
    
    // 验证切换回浅色模式
    await expect(page.getByText('当前主题: 浅色模式')).toBeVisible();
  });

  test('测试页面全屏功能', async ({ page }) => {
    // 验证初始状态
    await expect(page.getByText('全屏状态: 未开启')).toBeVisible();
    
    // 点击工具栏的全屏按钮
    await page.getByRole('button', { name: /进入全屏/ }).click();
    await page.waitForTimeout(500);
    
    // 验证状态更新
    await expect(page.getByText('全屏状态: 已开启')).toBeVisible();
    await expect(page.getByRole('button', { name: /退出全屏/ })).toBeVisible();
    
    // 退出全屏
    await page.getByRole('button', { name: /退出全屏/ }).click();
    await page.waitForTimeout(500);
    
    // 验证状态恢复
    await expect(page.getByText('全屏状态: 未开启')).toBeVisible();
  });

  test('测试页面设置对话框功能', async ({ page }) => {
    // 打开设置菜单
    await page.getByRole('button', { name: /设置/ }).click();
    await page.waitForTimeout(300);
    
    // 点击主题设置
    await page.getByText('主题设置').click();
    await page.waitForTimeout(500);
    
    // 验证主题设置对话框
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('主题设置')).toBeVisible();
    
    // 测试字体大小滑块
    const fontSizeSlider = page.locator('input[type="range"]').first();
    await fontSizeSlider.fill('16');
    
    // 测试行高滑块
    const lineHeightSlider = page.locator('input[type="range"]').nth(1);
    await lineHeightSlider.fill('1.8');
    
    // 测试自动保存开关
    await page.getByText('自动保存').click();
    
    // 保存设置
    await page.getByRole('button', { name: '保存' }).click();
    await page.waitForTimeout(500);
    
    // 验证成功消息
    await expect(page.getByText('主题设置已保存')).toBeVisible();
    await page.waitForTimeout(3500);
  });

  test('测试页面布局设置功能', async ({ page }) => {
    // 打开设置菜单
    await page.getByRole('button', { name: /设置/ }).click();
    await page.waitForTimeout(300);
    
    // 点击布局设置
    await page.getByText('布局设置').click();
    await page.waitForTimeout(500);
    
    // 验证布局设置对话框
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('布局设置')).toBeVisible();
    
    // 测试编辑器宽度滑块
    const editorWidthSlider = page.locator('input[type="range"]');
    await editorWidthSlider.fill('60');
    
    // 测试显示行号开关
    await page.getByText('显示行号').click();
    
    // 测试自动换行开关
    await page.getByText('自动换行').click();
    
    // 保存设置
    await page.getByRole('button', { name: '保存' }).click();
    await page.waitForTimeout(500);
    
    // 验证成功消息
    await expect(page.getByText('布局设置已保存')).toBeVisible();
    await page.waitForTimeout(3500);
  });

  test('测试页面编辑器功能', async ({ page }) => {
    // 验证编辑器和预览区域存在
    await expect(page.getByText('预览区域')).toBeVisible();
    
    // 验证测试内容存在
    await expect(page.getByText('测试页面')).toBeVisible();
    await expect(page.getByText('深色模式预览')).toBeVisible();
    await expect(page.getByText('全屏功能')).toBeVisible();
    await expect(page.getByText('设置按钮')).toBeVisible();
  });

  test('测试页面深色模式预览', async ({ page }) => {
    // 切换到深色模式
    await page.getByRole('button', { name: /切换到深色模式/ }).click();
    await page.waitForTimeout(1000);
    
    // 验证主题状态更新
    await expect(page.getByText('当前主题: 深色模式')).toBeVisible();
    
    // 检查预览区域在深色模式下的样式
    const previewArea = page.locator('.preview-content').first();
    await expect(previewArea).toBeVisible();
    
    // 验证深色模式下的背景色
    const bgColor = await previewArea.evaluate((el) => {
      const container = el.closest('[data-theme="dark"]');
      return container ? window.getComputedStyle(container).backgroundColor : null;
    });
    
    // 深色模式下背景应该不是白色
    if (bgColor) {
      expect(bgColor).not.toBe('rgb(255, 255, 255)');
    }
  });

  test('测试页面响应式设计', async ({ page }) => {
    // 测试不同屏幕尺寸
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    // 验证在大屏幕下元素仍然可见
    await expect(page.getByText('功能测试页面')).toBeVisible();
    await expect(page.getByRole('button', { name: /设置/ })).toBeVisible();
    
    // 测试中等屏幕
    await page.setViewportSize({ width: 768, height: 600 });
    await page.waitForTimeout(500);
    
    // 验证在中等屏幕下元素仍然可见
    await expect(page.getByText('功能测试页面')).toBeVisible();
    await expect(page.getByRole('button', { name: /设置/ })).toBeVisible();
  });

  test('测试页面所有按钮都可点击', async ({ page }) => {
    // 测试工具栏按钮
    const themeButton = page.getByRole('button', { name: /切换到深色模式/ });
    const fullscreenButton = page.getByRole('button', { name: /进入全屏/ });
    const settingsButton = page.getByRole('button', { name: /设置/ });
    
    await expect(themeButton).toBeVisible();
    await expect(fullscreenButton).toBeVisible();
    await expect(settingsButton).toBeVisible();
    
    // 测试测试页面的独立按钮
    const testThemeButton = page.getByRole('button', { name: '切换主题' });
    const testFullscreenButton = page.getByRole('button', { name: /进入全屏/ }).first();
    
    await expect(testThemeButton).toBeVisible();
    await expect(testFullscreenButton).toBeVisible();
    
    // 验证所有按钮都可以点击（不会抛出错误）
    await themeButton.click();
    await page.waitForTimeout(200);
    
    await testThemeButton.click();
    await page.waitForTimeout(200);
    
    await settingsButton.click();
    await page.waitForTimeout(200);
    
    // 点击其他地方关闭菜单
    await page.click('body', { position: { x: 100, y: 100 } });
  });
});
