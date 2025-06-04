# Test info

- Name: 主程序功能测试 >> 布局设置对话框应该正常工作
- Location: D:\MarkDownEditor\e2e\main-app.spec.ts:117:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('布局设置')

    at D:\MarkDownEditor\e2e\main-app.spec.ts:123:34
```

# Page snapshot

```yaml
- button "粗体 (Ctrl+B)"
- button "斜体 (Ctrl+I)"
- button "引用"
- button "代码"
- button "链接"
- button "图片"
- button "无序列表"
- button "有序列表"
- button "表格"
- button "H1"
- button "H2"
- button "H3"
- text: 125 字 866 字符 阅读 1分钟
- button
- button "切换主题"
- button "全屏模式"
- button "设置"
- textbox
- text: 标题样式
- combobox: 默认样式
- heading "单行工具栏 Markdown 编辑器" [level=1]
- paragraph: 这是一个将所有工具栏功能合并到一行的现代化 Markdown 编辑器。
- heading "功能特性" [level=2]
- list:
  - listitem:
    - strong: 统一工具栏
    - text: ：所有功能都集中在顶部一行
  - listitem:
    - strong: 格式化工具
    - text: ：粗体、斜体、引用、代码等
  - listitem:
    - strong: 标题工具
    - text: ：H1、H2、H3 快速插入
  - listitem:
    - strong: 列表支持
    - text: ：有序和无序列表
  - listitem:
    - strong: 插入功能
    - text: ：链接、图片、表格
  - listitem:
    - strong: 导出选项
    - text: ：支持多种格式导出
  - listitem:
    - strong: 实时预览
    - text: ：左右分屏实时预览
  - listitem:
    - strong: 主题切换
    - text: ：支持明暗主题
  - listitem:
    - strong: 全屏模式
    - text: ：专注写作体验
  - listitem:
    - strong: 字数统计
    - text: ：实时显示字数、字符数和阅读时间
- heading "使用说明" [level=2]
- list:
  - listitem: 在左侧编辑器中输入 Markdown 内容
  - listitem: 右侧会实时显示预览效果
  - listitem: 使用顶部工具栏快速插入格式
  - listitem: 拖拽中间分隔条调整编辑器和预览区域大小
  - listitem: 点击导出按钮选择导出格式
- heading "快捷键" [level=2]
- list:
  - listitem:
    - strong: Ctrl+B
    - text: ：粗体
  - listitem:
    - strong: Ctrl+I
    - text: ：斜体
  - listitem:
    - strong: Ctrl+K
    - text: ：插入链接
  - listitem:
    - strong: Ctrl+Alt+Q
    - text: ：引用
  - listitem:
    - strong: Ctrl+Alt+U
    - text: ：无序列表
  - listitem:
    - strong: Ctrl+Alt+O
    - text: ：有序列表
- heading "代码示例" [level=2]
- code: "function hello() { console.log(\"Hello, World!\"); }"
- heading "表格示例" [level=2]
- table:
  - rowgroup:
    - row "功能 描述 状态":
      - cell "功能"
      - cell "描述"
      - cell "状态"
  - rowgroup:
    - row "格式化 文本格式化工具 ✅":
      - cell "格式化"
      - cell "文本格式化工具"
      - cell "✅"
    - row "预览 实时预览 ✅":
      - cell "预览"
      - cell "实时预览"
      - cell "✅"
    - row "导出 多格式导出 ✅":
      - cell "导出"
      - cell "多格式导出"
      - cell "✅"
    - row "主题 明暗主题切换 ✅":
      - cell "主题"
      - cell "明暗主题切换"
      - cell "✅"
- heading "数学公式" [level=2]
- paragraph:
  - text: 行内公式：
  - math: E=mc2
- paragraph: 块级公式：
- math: ∫−∞∞e−x2dx=π
- blockquote:
  - paragraph: 这是一个引用示例，展示了引用文本的样式。
- separator
- paragraph: 开始使用这个强大的 Markdown 编辑器吧！
```

# Test source

```ts
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
  107 |     await page.getByRole('button', { name: '保存' }).click();
  108 |
  109 |     // 等待成功消息出现
  110 |     await page.waitForTimeout(500);
  111 |     await expect(page.getByText('主题设置已保存')).toBeVisible();
  112 |
  113 |     // 等待消息消失
  114 |     await page.waitForTimeout(3500);
  115 |   });
  116 |
  117 |   test('布局设置对话框应该正常工作', async ({ page }) => {
  118 |     // 打开设置菜单
  119 |     await page.getByRole('button', { name: /设置/ }).click();
  120 |     await page.waitForTimeout(300);
  121 |
  122 |     // 点击布局设置
> 123 |     await page.getByText('布局设置').click();
      |                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  124 |
  125 |     // 等待对话框出现
  126 |     await page.waitForTimeout(500);
  127 |
  128 |     // 验证对话框内容
  129 |     await expect(page.getByRole('dialog')).toBeVisible();
  130 |     await expect(page.getByText('布局设置')).toBeVisible();
  131 |     await expect(page.getByText(/编辑器宽度:/)).toBeVisible();
  132 |     await expect(page.getByText('显示行号')).toBeVisible();
  133 |     await expect(page.getByText('自动换行')).toBeVisible();
  134 |
  135 |     // 点击保存按钮
  136 |     await page.getByRole('button', { name: '保存' }).click();
  137 |
  138 |     // 等待成功消息出现
  139 |     await page.waitForTimeout(500);
  140 |     await expect(page.getByText('布局设置已保存')).toBeVisible();
  141 |
  142 |     // 等待消息消失
  143 |     await page.waitForTimeout(3500);
  144 |   });
  145 |
  146 |   test('字数统计应该显示正确信息', async ({ page }) => {
  147 |     // 验证字数统计存在
  148 |     await expect(page.getByText(/字数/)).toBeVisible();
  149 |     await expect(page.getByText(/字符/)).toBeVisible();
  150 |
  151 |     // 验证显示的是数字
  152 |     const wordCountText = await page.getByText(/字数/).textContent();
  153 |     expect(wordCountText).toMatch(/\d+/);
  154 |   });
  155 |
  156 |   test('预览区域应该正确显示内容', async ({ page }) => {
  157 |     // 验证预览区域存在
  158 |     await expect(page.getByText('预览区域')).toBeVisible();
  159 |
  160 |     // 验证预览内容存在
  161 |     await expect(page.getByText('欢迎使用 Markdown 编辑器')).toBeVisible();
  162 |   });
  163 |
  164 |   test('深色模式下预览区域应该是深色背景', async ({ page }) => {
  165 |     // 切换到深色模式
  166 |     await page.getByRole('button', { name: /切换到深色模式/ }).click();
  167 |     await page.waitForTimeout(1000);
  168 |
  169 |     // 检查预览区域的背景色
  170 |     const previewBgColor = await page.locator('.preview-content').evaluate((el) => {
  171 |       return window.getComputedStyle(el.closest('[data-theme="dark"]') || el).backgroundColor;
  172 |     });
  173 |
  174 |     // 深色模式下背景应该不是白色
  175 |     expect(previewBgColor).not.toBe('rgb(255, 255, 255)');
  176 |   });
  177 | });
  178 |
```