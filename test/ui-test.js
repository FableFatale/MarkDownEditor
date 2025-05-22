// UI测试脚本
// 用于测试ModernMarkdownEditor组件的UI问题修复

const { expect } = require('chai');
const puppeteer = require('puppeteer');

describe('ModernMarkdownEditor UI测试', function() {
  let browser;
  let page;

  // 测试超时时间设置为10秒
  this.timeout(10000);

  before(async function() {
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: false, // 设置为false以便观察测试过程
      args: ['--window-size=1280,800']
    });
    
    // 创建新页面
    page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewport({ width: 1280, height: 800 });
  });

  after(async function() {
    // 测试完成后关闭浏览器
    await browser.close();
  });

  it('应该正确加载编辑器', async function() {
    // 导航到编辑器页面
    await page.goto('http://localhost:5173/?modern=true');
    
    // 等待编辑器加载完成
    await page.waitForSelector('.editor-pane');
    
    // 检查编辑器是否存在
    const editorExists = await page.evaluate(() => {
      return document.querySelector('.editor-pane') !== null;
    });
    
    expect(editorExists).to.be.true;
  });

  it('应该正确显示预览区域', async function() {
    // 检查预览区域是否存在
    const previewExists = await page.evaluate(() => {
      return document.querySelector('.preview-pane') !== null;
    });
    
    expect(previewExists).to.be.true;
  });

  it('应该在桌面视图中显示分隔条', async function() {
    // 检查分隔条是否存在
    const resizerExists = await page.evaluate(() => {
      return document.querySelector('.resizer') !== null;
    });
    
    expect(resizerExists).to.be.true;
  });

  it('应该在移动视图中隐藏分隔条', async function() {
    // 设置移动设备视口
    await page.setViewport({ width: 375, height: 667 });
    
    // 检查分隔条是否可见
    const resizerVisible = await page.evaluate(() => {
      const resizer = document.querySelector('.resizer');
      if (!resizer) return false;
      
      const style = window.getComputedStyle(resizer);
      return style.display !== 'none';
    });
    
    expect(resizerVisible).to.be.false;
    
    // 恢复桌面视口
    await page.setViewport({ width: 1280, height: 800 });
  });

  it('应该在移动视图中正确堆叠编辑器和预览区域', async function() {
    // 设置移动设备视口
    await page.setViewport({ width: 375, height: 667 });
    
    // 检查布局是否为垂直堆叠
    const isVerticalLayout = await page.evaluate(() => {
      const container = document.querySelector('.flex-col');
      return container !== null;
    });
    
    expect(isVerticalLayout).to.be.true;
    
    // 恢复桌面视口
    await page.setViewport({ width: 1280, height: 800 });
  });

  it('应该能够切换主题', async function() {
    // 点击主题切换按钮
    await page.click('.toolbar-button[title*="主题"]');
    
    // 等待主题切换完成
    await page.waitForTimeout(500);
    
    // 检查是否切换到了深色主题
    const isDarkTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // 注意：这个测试可能会根据初始主题状态而失败，可以根据实际情况调整
    expect(isDarkTheme).to.be.true;
  });
});
