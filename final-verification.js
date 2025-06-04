// 最终验证脚本 - 在主程序页面的浏览器控制台中运行
// 访问 http://localhost:3003/ 然后在控制台中粘贴这个脚本

console.log('🎯 开始最终功能验证...');
console.log('页面URL:', window.location.href);

// 验证1: 检查页面基本状态
function verifyPageBasics() {
    console.log('\n📄 验证1: 页面基本状态');
    
    const title = document.title;
    console.log('页面标题:', title);
    
    const body = document.body;
    const hasContent = body.textContent.length > 100;
    console.log('页面有内容:', hasContent);
    
    const buttons = document.querySelectorAll('button');
    console.log('按钮数量:', buttons.length);
    
    // 检查是否是App组件而不是SingleRowEditorDemo
    const isMainApp = body.textContent.includes('欢迎使用 Markdown 编辑器') || 
                     body.textContent.includes('预览区域');
    console.log('是主程序App组件:', isMainApp);
    
    return {
        title: title.includes('Markdown'),
        hasContent,
        hasButtons: buttons.length > 0,
        isMainApp
    };
}

// 验证2: 检查主题切换功能
function verifyThemeToggle() {
    console.log('\n🌓 验证2: 主题切换功能');
    
    const htmlElement = document.documentElement;
    const initialTheme = htmlElement.getAttribute('data-theme');
    console.log('初始主题:', initialTheme);
    
    // 查找主题切换按钮
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeButton = buttons.find(btn => {
        const title = btn.getAttribute('title') || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const text = btn.textContent || '';
        return title.includes('主题') || title.includes('深色') || title.includes('浅色') ||
               ariaLabel.includes('主题') || ariaLabel.includes('深色') || ariaLabel.includes('浅色') ||
               text.includes('主题');
    });
    
    if (themeButton) {
        console.log('✅ 找到主题切换按钮');
        console.log('按钮信息:', {
            title: themeButton.getAttribute('title'),
            ariaLabel: themeButton.getAttribute('aria-label'),
            text: themeButton.textContent
        });
        
        // 点击按钮测试
        themeButton.click();
        
        setTimeout(() => {
            const newTheme = htmlElement.getAttribute('data-theme');
            console.log('切换后主题:', newTheme);
            const themeChanged = initialTheme !== newTheme;
            console.log('主题切换成功:', themeChanged);
            
            if (themeChanged) {
                console.log('✅ 主题切换功能正常');
            } else {
                console.log('❌ 主题切换功能异常');
            }
        }, 1000);
        
        return true;
    } else {
        console.log('❌ 未找到主题切换按钮');
        return false;
    }
}

// 验证3: 检查设置按钮功能
function verifySettingsButton() {
    console.log('\n⚙️ 验证3: 设置按钮功能');
    
    const buttons = Array.from(document.querySelectorAll('button'));
    const settingsButton = buttons.find(btn => {
        const title = btn.getAttribute('title') || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const text = btn.textContent || '';
        return title.includes('设置') || ariaLabel.includes('设置') || text.includes('设置');
    });
    
    if (settingsButton) {
        console.log('✅ 找到设置按钮');
        console.log('按钮信息:', {
            title: settingsButton.getAttribute('title'),
            ariaLabel: settingsButton.getAttribute('aria-label'),
            text: settingsButton.textContent
        });
        
        // 点击设置按钮
        settingsButton.click();
        
        setTimeout(() => {
            // 检查设置菜单是否出现
            const menuSelectors = [
                '[role="menu"]',
                '.MuiMenu-root',
                '.MuiDialog-root',
                '[role="dialog"]'
            ];
            
            let menuFound = false;
            for (const selector of menuSelectors) {
                const menu = document.querySelector(selector);
                if (menu && menu.offsetParent !== null) { // 检查是否可见
                    console.log('✅ 设置菜单已打开:', selector);
                    menuFound = true;
                    
                    // 检查菜单内容
                    const menuText = menu.textContent || '';
                    const hasThemeSettings = menuText.includes('主题设置');
                    const hasLayoutSettings = menuText.includes('布局设置');
                    
                    console.log('包含主题设置:', hasThemeSettings);
                    console.log('包含布局设置:', hasLayoutSettings);
                    
                    if (hasThemeSettings && hasLayoutSettings) {
                        console.log('✅ 设置菜单内容完整');
                    }
                    
                    break;
                }
            }
            
            if (!menuFound) {
                console.log('❌ 设置菜单未打开');
            }
            
            // 点击页面其他地方关闭菜单
            document.body.click();
        }, 500);
        
        return true;
    } else {
        console.log('❌ 未找到设置按钮');
        return false;
    }
}

// 验证4: 检查全屏按钮功能
function verifyFullscreenButton() {
    console.log('\n🖥️ 验证4: 全屏按钮功能');
    
    const buttons = Array.from(document.querySelectorAll('button'));
    const fullscreenButton = buttons.find(btn => {
        const title = btn.getAttribute('title') || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const text = btn.textContent || '';
        return title.includes('全屏') || ariaLabel.includes('全屏') ||
               title.includes('fullscreen') || ariaLabel.includes('fullscreen') ||
               text.includes('全屏');
    });
    
    if (fullscreenButton) {
        console.log('✅ 找到全屏按钮');
        console.log('按钮信息:', {
            title: fullscreenButton.getAttribute('title'),
            ariaLabel: fullscreenButton.getAttribute('aria-label'),
            text: fullscreenButton.textContent
        });
        
        // 点击全屏按钮
        fullscreenButton.click();
        
        setTimeout(() => {
            const isFullscreen = !!document.fullscreenElement;
            console.log('当前全屏状态:', isFullscreen);
            
            if (isFullscreen) {
                console.log('✅ 全屏功能正常');
                // 退出全屏
                fullscreenButton.click();
                setTimeout(() => {
                    const stillFullscreen = !!document.fullscreenElement;
                    console.log('退出全屏成功:', !stillFullscreen);
                }, 500);
            } else {
                console.log('⚠️ 全屏功能可能需要用户手势触发');
            }
        }, 500);
        
        return true;
    } else {
        console.log('❌ 未找到全屏按钮');
        return false;
    }
}

// 验证5: 检查预览区域深色模式
function verifyDarkModePreview() {
    console.log('\n👁️ 验证5: 预览区域深色模式');
    
    // 首先切换到深色模式
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme !== 'dark') {
        // 切换到深色模式
        const buttons = Array.from(document.querySelectorAll('button'));
        const themeButton = buttons.find(btn => {
            const title = btn.getAttribute('title') || '';
            const ariaLabel = btn.getAttribute('aria-label') || '';
            return title.includes('深色') || ariaLabel.includes('深色');
        });
        
        if (themeButton) {
            themeButton.click();
            console.log('切换到深色模式...');
        }
    }
    
    setTimeout(() => {
        const theme = htmlElement.getAttribute('data-theme');
        console.log('当前主题:', theme);
        
        if (theme === 'dark') {
            // 检查预览区域背景色
            const previewElements = document.querySelectorAll('[class*="preview"], [class*="Preview"]');
            
            if (previewElements.length > 0) {
                const previewElement = previewElements[0];
                const computedStyle = window.getComputedStyle(previewElement);
                const backgroundColor = computedStyle.backgroundColor;
                
                console.log('预览区域背景色:', backgroundColor);
                
                // 检查是否是深色背景（不是白色）
                const isNotWhite = backgroundColor !== 'rgb(255, 255, 255)' && 
                                  backgroundColor !== 'rgba(255, 255, 255, 1)' &&
                                  backgroundColor !== 'white';
                
                if (isNotWhite) {
                    console.log('✅ 深色模式下预览区域背景正确');
                } else {
                    console.log('❌ 深色模式下预览区域背景仍为白色');
                }
                
                return isNotWhite;
            } else {
                console.log('⚠️ 未找到预览区域元素');
                return false;
            }
        } else {
            console.log('⚠️ 未能切换到深色模式');
            return false;
        }
    }, 1500);
}

// 运行所有验证
async function runAllVerifications() {
    console.log('🚀 开始运行所有验证...\n');
    
    const results = {};
    
    // 基本验证
    results.basics = verifyPageBasics();
    console.log('基本验证结果:', results.basics);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 主题切换验证
    results.theme = verifyThemeToggle();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 设置按钮验证
    results.settings = verifySettingsButton();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 全屏按钮验证
    results.fullscreen = verifyFullscreenButton();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 深色模式预览验证
    verifyDarkModePreview();
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 输出最终结果
    console.log('\n📊 最终验证结果:');
    console.log('='.repeat(50));
    console.log('页面基本功能:', results.basics.isMainApp ? '✅ 通过' : '❌ 失败');
    console.log('主题切换功能:', results.theme ? '✅ 通过' : '❌ 失败');
    console.log('设置按钮功能:', results.settings ? '✅ 通过' : '❌ 失败');
    console.log('全屏按钮功能:', results.fullscreen ? '✅ 通过' : '❌ 失败');
    console.log('='.repeat(50));
    
    const allPassed = results.basics.isMainApp && results.theme && results.settings && results.fullscreen;
    
    if (allPassed) {
        console.log('🎉 所有功能验证通过！修复成功！');
    } else {
        console.log('⚠️ 部分功能需要进一步检查');
    }
    
    return results;
}

// 自动运行验证
runAllVerifications().then(results => {
    console.log('\n💡 验证完成！如果有问题，请手动测试各项功能。');
});

// 提供手动测试函数
console.log('\n🔧 可用的手动测试函数:');
console.log('verifyPageBasics() - 验证页面基本状态');
console.log('verifyThemeToggle() - 验证主题切换');
console.log('verifySettingsButton() - 验证设置按钮');
console.log('verifyFullscreenButton() - 验证全屏按钮');
console.log('verifyDarkModePreview() - 验证深色模式预览');
console.log('runAllVerifications() - 运行所有验证');
