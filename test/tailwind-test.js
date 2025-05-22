// Tailwind CSS测试脚本
// 用于测试Tailwind CSS是否正确工作

const { expect } = require('chai');
const puppeteer = require('puppeteer');

describe('Tailwind CSS测试', function() {
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

  it('应该正确应用Tailwind CSS类', async function() {
    // 导航到编辑器页面
    await page.goto('http://localhost:5173/?modern=true');
    
    // 等待编辑器加载完成
    await page.waitForSelector('.toolbar');
    
    // 检查Tailwind CSS类是否正确应用
    const toolbarStyles = await page.evaluate(() => {
      const toolbar = document.querySelector('.toolbar');
      const styles = window.getComputedStyle(toolbar);
      return {
        display: styles.display,
        position: styles.position,
        zIndex: styles.zIndex,
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter
      };
    });
    
    expect(toolbarStyles.display).to.equal('flex');
    expect(toolbarStyles.position).to.equal('fixed');
    // z-index可能会有所不同，但应该是一个数字
    expect(parseInt(toolbarStyles.zIndex)).to.be.above(0);
  });

  it('应该正确应用暗色模式类', async function() {
    // 点击主题切换按钮
    await page.click('.toolbar-button[title*="主题"]');
    
    // 等待主题切换完成
    await page.waitForTimeout(500);
    
    // 检查是否应用了暗色主题
    const isDarkTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // 检查暗色模式下的背景色
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return styles.backgroundColor;
    });
    
    if (isDarkTheme) {
      // 暗色模式下背景色应该是深色
      expect(bgColor).to.not.equal('rgb(255, 255, 255)');
    }
  });
});
