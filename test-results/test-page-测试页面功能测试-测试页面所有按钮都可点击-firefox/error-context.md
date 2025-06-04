# Test info

- Name: 测试页面功能测试 >> 测试页面所有按钮都可点击
- Location: D:\MarkDownEditor\e2e\test-page.spec.ts:179:3

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByRole('button', { name: /进入全屏/ }) resolved to 3 elements:
    1) <button tabindex="0" type="button" class="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorPrimary MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-colorPrimary css-uwrw3p-MuiButtonBase-root-MuiButton-root">…</button> aka getByText('进入全屏')
    2) <button tabindex="0" type="button" aria-label="进入全屏" data-mui-internal-clone-element="true" class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-1pgk47-MuiButtonBase-root-MuiIconButton-root">…</button> aka getByRole('banner').filter({ hasText: '字数：195字符：300预计阅读：1分钟' }).getByLabel('进入全屏')
    3) <button tabindex="0" type="button" aria-label="进入全屏" data-mui-internal-clone-element="true" class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-1pgk47-MuiButtonBase-root-MuiIconButton-root">…</button> aka getByRole('banner').filter({ hasText: /^$/ }).getByLabel('进入全屏')

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('button', { name: /进入全屏/ })

    at D:\MarkDownEditor\e2e\test-page.spec.ts:186:36
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
  114 |     // 测试自动换行开关
  115 |     await page.getByText('自动换行').click();
  116 |     
  117 |     // 保存设置
  118 |     await page.getByRole('button', { name: '保存' }).click();
  119 |     await page.waitForTimeout(500);
  120 |     
  121 |     // 验证成功消息
  122 |     await expect(page.getByText('布局设置已保存')).toBeVisible();
  123 |     await page.waitForTimeout(3500);
  124 |   });
  125 |
  126 |   test('测试页面编辑器功能', async ({ page }) => {
  127 |     // 验证编辑器和预览区域存在
  128 |     await expect(page.getByText('预览区域')).toBeVisible();
  129 |     
  130 |     // 验证测试内容存在
  131 |     await expect(page.getByText('测试页面')).toBeVisible();
  132 |     await expect(page.getByText('深色模式预览')).toBeVisible();
  133 |     await expect(page.getByText('全屏功能')).toBeVisible();
  134 |     await expect(page.getByText('设置按钮')).toBeVisible();
  135 |   });
  136 |
  137 |   test('测试页面深色模式预览', async ({ page }) => {
  138 |     // 切换到深色模式
  139 |     await page.getByRole('button', { name: /切换到深色模式/ }).click();
  140 |     await page.waitForTimeout(1000);
  141 |     
  142 |     // 验证主题状态更新
  143 |     await expect(page.getByText('当前主题: 深色模式')).toBeVisible();
  144 |     
  145 |     // 检查预览区域在深色模式下的样式
  146 |     const previewArea = page.locator('.preview-content').first();
  147 |     await expect(previewArea).toBeVisible();
  148 |     
  149 |     // 验证深色模式下的背景色
  150 |     const bgColor = await previewArea.evaluate((el) => {
  151 |       const container = el.closest('[data-theme="dark"]');
  152 |       return container ? window.getComputedStyle(container).backgroundColor : null;
  153 |     });
  154 |     
  155 |     // 深色模式下背景应该不是白色
  156 |     if (bgColor) {
  157 |       expect(bgColor).not.toBe('rgb(255, 255, 255)');
  158 |     }
  159 |   });
  160 |
  161 |   test('测试页面响应式设计', async ({ page }) => {
  162 |     // 测试不同屏幕尺寸
  163 |     await page.setViewportSize({ width: 1200, height: 800 });
  164 |     await page.waitForTimeout(500);
  165 |     
  166 |     // 验证在大屏幕下元素仍然可见
  167 |     await expect(page.getByText('功能测试页面')).toBeVisible();
  168 |     await expect(page.getByRole('button', { name: /设置/ })).toBeVisible();
  169 |     
  170 |     // 测试中等屏幕
  171 |     await page.setViewportSize({ width: 768, height: 600 });
  172 |     await page.waitForTimeout(500);
  173 |     
  174 |     // 验证在中等屏幕下元素仍然可见
  175 |     await expect(page.getByText('功能测试页面')).toBeVisible();
  176 |     await expect(page.getByRole('button', { name: /设置/ })).toBeVisible();
  177 |   });
  178 |
  179 |   test('测试页面所有按钮都可点击', async ({ page }) => {
  180 |     // 测试工具栏按钮
  181 |     const themeButton = page.getByRole('button', { name: /切换到深色模式/ });
  182 |     const fullscreenButton = page.getByRole('button', { name: /进入全屏/ });
  183 |     const settingsButton = page.getByRole('button', { name: /设置/ });
  184 |     
  185 |     await expect(themeButton).toBeVisible();
> 186 |     await expect(fullscreenButton).toBeVisible();
      |                                    ^ Error: expect.toBeVisible: Error: strict mode violation: getByRole('button', { name: /进入全屏/ }) resolved to 3 elements:
  187 |     await expect(settingsButton).toBeVisible();
  188 |     
  189 |     // 测试测试页面的独立按钮
  190 |     const testThemeButton = page.getByRole('button', { name: '切换主题' });
  191 |     const testFullscreenButton = page.getByRole('button', { name: /进入全屏/ }).first();
  192 |     
  193 |     await expect(testThemeButton).toBeVisible();
  194 |     await expect(testFullscreenButton).toBeVisible();
  195 |     
  196 |     // 验证所有按钮都可以点击（不会抛出错误）
  197 |     await themeButton.click();
  198 |     await page.waitForTimeout(200);
  199 |     
  200 |     await testThemeButton.click();
  201 |     await page.waitForTimeout(200);
  202 |     
  203 |     await settingsButton.click();
  204 |     await page.waitForTimeout(200);
  205 |     
  206 |     // 点击其他地方关闭菜单
  207 |     await page.click('body', { position: { x: 100, y: 100 } });
  208 |   });
  209 | });
  210 |
```