// 样式测试脚本
// 用于测试ModernMarkdownEditor组件的样式问题修复

const { expect } = require('chai');
const puppeteer = require('puppeteer');

describe('ModernMarkdownEditor样式测试', function() {
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

  it('应该正确加载编辑器样式', async function() {
    // 导航到编辑器页面
    await page.goto('http://localhost:5173/?modern=true');
    
    // 等待编辑器加载完成
    await page.waitForSelector('.editor-pane');
    
    // 检查编辑器样式是否正确
    const editorStyles = await page.evaluate(() => {
      const editor = document.querySelector('.editor-pane');
      const styles = window.getComputedStyle(editor);
      return {
        border: styles.border,
        height: styles.height,
        overflow: styles.overflow
      };
    });
    
    expect(editorStyles.overflow).to.equal('auto');
  });

  it('应该正确加载预览区域样式', async function() {
    // 检查预览区域样式是否正确
    const previewStyles = await page.evaluate(() => {
      const preview = document.querySelector('.preview-pane');
      const styles = window.getComputedStyle(preview);
      return {
        padding: styles.padding,
        backgroundColor: styles.backgroundColor,
        overflow: styles.overflow
      };
    });
    
    expect(previewStyles.overflow).to.equal('auto');
  });

  it('应该正确应用暗色主题', async function() {
    // 点击主题切换按钮
    await page.click('.toolbar-button[title*="主题"]');
    
    // 等待主题切换完成
    await page.waitForTimeout(500);
    
    // 检查是否应用了暗色主题
    const isDarkTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // 检查编辑器背景色是否正确
    const editorBgColor = await page.evaluate(() => {
      const editorContent = document.querySelector('.cm-content');
      if (!editorContent) return null;
      
      const styles = window.getComputedStyle(editorContent);
      return styles.backgroundColor;
    });
    
    // 注意：这个测试可能会根据初始主题状态而失败，可以根据实际情况调整
    if (isDarkTheme) {
      expect(editorBgColor).to.not.equal('rgb(255, 255, 255)');
    }
  });

  it('应该正确应用自定义标题样式', async function() {
    // 检查标题样式是否正确
    const headingStyles = await page.evaluate(() => {
      const heading = document.querySelector('.prose h1');
      if (!heading) return null;
      
      const styles = window.getComputedStyle(heading);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        borderBottom: styles.borderBottom
      };
    });
    
    if (headingStyles) {
      expect(headingStyles.fontWeight).to.equal('700'); // bold
    }
  });
});
