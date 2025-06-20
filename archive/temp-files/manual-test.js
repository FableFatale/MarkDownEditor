// 手动测试脚本 - 在浏览器控制台中运行
// 打开 http://localhost:3003/ 然后在控制台中粘贴这个脚本

console.log('🚀 开始功能测试...');

// 测试1: 验证页面基本加载
function testPageLoad() {
  console.log('📄 测试1: 页面基本加载');
  
  const title = document.title;
  console.log('页面标题:', title);
  
  const editorContainer = document.querySelector('.editor-container');
  console.log('编辑器容器存在:', !!editorContainer);
  
  const buttons = document.querySelectorAll('button');
  console.log('按钮数量:', buttons.length);
  
  return {
    title: title.includes('Markdown'),
    editorContainer: !!editorContainer,
    hasButtons: buttons.length > 0
  };
}

// 测试2: 验证主题切换功能
function testThemeToggle() {
  console.log('🌓 测试2: 主题切换功能');
  
  const htmlElement = document.documentElement;
  const initialTheme = htmlElement.getAttribute('data-theme');
  console.log('初始主题:', initialTheme);
  
  // 查找主题切换按钮
  const buttons = Array.from(document.querySelectorAll('button'));
  const themeButton = buttons.find(btn => {
    const title = btn.getAttribute('title') || '';
    const ariaLabel = btn.getAttribute('aria-label') || '';
    return title.includes('主题') || title.includes('深色') || title.includes('浅色') ||
           ariaLabel.includes('主题') || ariaLabel.includes('深色') || ariaLabel.includes('浅色');
  });
  
  if (themeButton) {
    console.log('找到主题切换按钮:', themeButton.getAttribute('title') || themeButton.getAttribute('aria-label'));
    
    // 点击按钮
    themeButton.click();
    
    setTimeout(() => {
      const newTheme = htmlElement.getAttribute('data-theme');
      console.log('切换后主题:', newTheme);
      console.log('主题切换成功:', initialTheme !== newTheme);
    }, 1000);
    
    return true;
  } else {
    console.log('❌ 未找到主题切换按钮');
    return false;
  }
}

// 测试3: 验证设置按钮功能
function testSettingsButton() {
  console.log('⚙️ 测试3: 设置按钮功能');
  
  const buttons = Array.from(document.querySelectorAll('button'));
  const settingsButton = buttons.find(btn => {
    const title = btn.getAttribute('title') || '';
    const ariaLabel = btn.getAttribute('aria-label') || '';
    return title.includes('设置') || ariaLabel.includes('设置');
  });
  
  if (settingsButton) {
    console.log('找到设置按钮');
    
    // 点击设置按钮
    settingsButton.click();
    
    setTimeout(() => {
      const menu = document.querySelector('[role="menu"], .MuiMenu-root, .MuiDialog-root');
      console.log('设置菜单已打开:', !!menu);
      
      if (menu) {
        // 查找主题设置和布局设置选项
        const themeSettings = Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent && el.textContent.includes('主题设置')
        );
        const layoutSettings = Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent && el.textContent.includes('布局设置')
        );
        
        console.log('主题设置选项存在:', !!themeSettings);
        console.log('布局设置选项存在:', !!layoutSettings);
        
        // 点击页面其他地方关闭菜单
        document.body.click();
      }
    }, 500);
    
    return true;
  } else {
    console.log('❌ 未找到设置按钮');
    return false;
  }
}

// 测试4: 验证全屏按钮功能
function testFullscreenButton() {
  console.log('🖥️ 测试4: 全屏按钮功能');
  
  const buttons = Array.from(document.querySelectorAll('button'));
  const fullscreenButton = buttons.find(btn => {
    const title = btn.getAttribute('title') || '';
    const ariaLabel = btn.getAttribute('aria-label') || '';
    return title.includes('全屏') || ariaLabel.includes('全屏') ||
           title.includes('fullscreen') || ariaLabel.includes('fullscreen');
  });
  
  if (fullscreenButton) {
    console.log('找到全屏按钮:', fullscreenButton.getAttribute('title') || fullscreenButton.getAttribute('aria-label'));
    
    // 点击全屏按钮
    fullscreenButton.click();
    
    setTimeout(() => {
      console.log('全屏状态:', !!document.fullscreenElement);
      
      // 如果进入了全屏，再次点击退出
      if (document.fullscreenElement) {
        fullscreenButton.click();
        setTimeout(() => {
          console.log('退出全屏成功:', !document.fullscreenElement);
        }, 500);
      }
    }, 500);
    
    return true;
  } else {
    console.log('❌ 未找到全屏按钮');
    return false;
  }
}

// 测试5: 验证预览区域
function testPreviewArea() {
  console.log('👁️ 测试5: 预览区域');
  
  // 查找预览相关元素
  const previewElements = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent && (el.textContent.includes('预览') || el.textContent.includes('preview'))
  );
  
  console.log('预览相关元素数量:', previewElements.length);
  
  // 查找Markdown内容
  const markdownContent = Array.from(document.querySelectorAll('*')).find(el => 
    el.textContent && el.textContent.includes('欢迎使用')
  );
  
  console.log('Markdown内容存在:', !!markdownContent);
  
  return {
    previewElements: previewElements.length > 0,
    markdownContent: !!markdownContent
  };
}

// 测试6: 验证字数统计
function testWordCount() {
  console.log('📊 测试6: 字数统计');
  
  const wordCountElements = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent && (el.textContent.includes('字数') || el.textContent.includes('字符'))
  );
  
  console.log('字数统计元素数量:', wordCountElements.length);
  
  if (wordCountElements.length > 0) {
    wordCountElements.forEach((el, index) => {
      console.log(`字数统计 ${index + 1}:`, el.textContent.trim());
    });
  }
  
  return wordCountElements.length > 0;
}

// 运行所有测试
async function runAllTests() {
  console.log('🧪 开始运行所有测试...\n');
  
  const results = {};
  
  results.pageLoad = testPageLoad();
  console.log('✅ 页面加载测试完成\n');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.themeToggle = testThemeToggle();
  console.log('✅ 主题切换测试完成\n');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  results.settingsButton = testSettingsButton();
  console.log('✅ 设置按钮测试完成\n');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  results.fullscreenButton = testFullscreenButton();
  console.log('✅ 全屏按钮测试完成\n');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.previewArea = testPreviewArea();
  console.log('✅ 预览区域测试完成\n');
  
  results.wordCount = testWordCount();
  console.log('✅ 字数统计测试完成\n');
  
  // 输出测试总结
  console.log('📋 测试总结:');
  console.log('='.repeat(50));
  console.log('页面加载:', results.pageLoad.title && results.pageLoad.editorContainer ? '✅ 通过' : '❌ 失败');
  console.log('主题切换:', results.themeToggle ? '✅ 通过' : '❌ 失败');
  console.log('设置按钮:', results.settingsButton ? '✅ 通过' : '❌ 失败');
  console.log('全屏按钮:', results.fullscreenButton ? '✅ 通过' : '❌ 失败');
  console.log('预览区域:', results.previewArea.previewElements ? '✅ 通过' : '❌ 失败');
  console.log('字数统计:', results.wordCount ? '✅ 通过' : '❌ 失败');
  console.log('='.repeat(50));
  
  return results;
}

// 自动运行测试
runAllTests().then(results => {
  console.log('🎉 所有测试完成！');
  console.log('详细结果:', results);
});

// 也可以单独运行测试
console.log('💡 您也可以单独运行测试:');
console.log('testPageLoad() - 测试页面加载');
console.log('testThemeToggle() - 测试主题切换');
console.log('testSettingsButton() - 测试设置按钮');
console.log('testFullscreenButton() - 测试全屏按钮');
console.log('testPreviewArea() - 测试预览区域');
console.log('testWordCount() - 测试字数统计');
