🏗️ 1. 编辑器功能相关（基础+扩展）

功能	技术选型	备注
Markdown 编辑器内核	CodeMirror 6（+ @codemirror/lang-markdown）	支持大文件、扩展性好
语法高亮	@codemirror/highlight + 自定义 HighlightStyle	轻量精准，支持自定义
快捷键支持	@codemirror/commands + 自定义快捷键映射	完整支持你的快捷键清单
图片上传	react-dropzone + 自定义 Upload API	支持拖拽、粘贴上传
动图支持	使用支持 WebP/APNG 的渲染器	兼容动图展示
文字转 Markdown	Turndown.js	把 HTML/纯文本自动转为 Markdown
导出 PDF	html2pdf.js（简易版） 或 puppeteer（复杂版，Node 后端）	看你是否需要生成高质量的 PDF
多格式导出	使用 showdown.js 转 HTML，jszip 封装 Word/Zip 等格式	方便一键打包
页面划分图片生成	html2canvas + 自定义 Canvas Layout	2.35:1 比例封面图生成
📖 2. 预览与渲染相关（体验）

功能	技术选型	备注
Markdown 渲染	react-markdown	
GFM 支持（表格、任务列表）	remark-gfm	
数学公式	remark-math + rehype-katex	
Mermaid 流程图	mermaid-js/mermaid + React Wrapper	
自定义标题样式	Tailwind 自定义组件 or rehype plugins	
SEO优化（字数、关键词）	动态 meta 生成 + 字数统计函数	
字数统计	实时监听 Markdown 文本，统计文字数量
🗂️ 3. 内容管理与扩展

功能	技术选型	备注
文章分类、管理	Zustand / Jotai 管理状态，结合 IndexedDB 持久化	
多端同步	Firebase / Supabase（推荐轻量同步）	
历史版本管理	基于 localForage 保存版本快照	
协作编辑	Yjs + WebRTC / WebSocket	
主题切换	Tailwind + ThemeContext	
图片管理	AWS S3 / 自建 OSS，或者本地 IndexedDB，目前先实现本地
功能	技术选型	备注
样式系统	TailwindCSS 3+（CDN版可）	
深浅模式切换	Tailwind dark: 机制	
组件	Headless UI +自定义 Tailwind Components	
图标	Heroicons / Lucide Icons（比 FontAwesome 更轻）	
微交互	framer-motion（动效库，极轻巧）	
响应式布局	Tailwind Flex/Grid 体系，完美支持手机平板	
全屏/专注模式	Tailwind 自定义布局 + screenfull.js（全屏切换库）	
自定义主题	Tailwind config.js 动态切换颜色、字体	
多种布局	自定义 Editor、Preview 分栏，支持调整大小（react-resizable）

🚀 5. 性能与优化

功能	技术选型	备注
大文件优化	CodeMirror 流式编辑机制	
离线编辑	PWA（Progressive Web App）支持	
内容懒加载	react-lazyload / Intersection Observer API	
图片压缩优化	browser-image-compression	
资源压缩	vite-plugin-compression（gzip压缩打包）	
自动保存备份	useDebounce + LocalForage	
拼写检查	simple-peer spelling.js / 浏览器内置检查	

<!-- 主要功能：
         1.  实现Markdown的语法高亮 
         2.  实现Markdown的导出为PDF
         3.  自定义markdown渲染后的标题样式
         4. 导入文字转为markdown，导出markdown
         5. 实现适配公众号文章封面图的生成，2.35:1，根据内容生成文字图
         6.  实现文章的SEO，文字字数的统计
         7. 实现文章的分类，管理
         8. 扩展功能：
            -  实时预览与编辑功能
            - 图片上传与管理
            - 版本控制与历史记录
            - 多端同步功能
            -  主题切换与自定义
            -  快捷键支持
                - 一级标题: Ctrl+1
                - 二级标题: Ctrl+2
                - 三级标题: Ctrl+3
                - 四级标题: Ctrl+4
                - 五级标题: Ctrl+5
                - 六级标题: Ctrl+6
                - 删除线: Ctrl+Alt+X
                - 加粗: Ctrl+B
                - 倾斜: Ctrl+I
                - 下划线: Ctrl+U
                - 行内代码: Ctrl+E
                - 行内公式: Ctrl+M
                - 引用: Ctrl+Alt+Q
                - 有序列表: Ctrl+Alt+O
                - 无序列表: Ctrl+Alt+U
                - 代码块: Ctrl+Alt+E
                - 公式块: Ctrl+Alt+M
                - 分割线: Ctrl+Alt+H
                - 链接: Ctrl+K
                - 表格: Ctrl+Alt+T
                - 图片: Ctrl+Alt+I
                - 微信外链转脚注: Ctrl+Alt+L
                - 格式化文档: Ctrl+Alt+F
            -  导出多种格式（HTML、Word等）
            - 协同编辑功能
            -  容器块、代码块、支持mermaid语法
            - 页边距、 行数、 字符数的显示
            - 页背景
            - latex公式、语法的支持
            -  自定义CSS的样式
            - 大纲模式
            - 新建文件夹保存文章
            - 支持图片的拖拽、粘贴、上传
            - 支持动图
            -  支持表格
            - 支持视频链接转卡片
            -  支持粗体、斜体、脚注、引用、链接、分列
         9. 界面设计：
            -  简洁现代的UI风格
            -  响应式布局设计
            -  深色/浅色主题切换
            - 自定义字体和颜色
            -  可调节的编辑器布局
            -  支持全屏专注模式
            - 编辑器的自适应大小
            -  支持多种主题
            - 整体风格参考Linear App的简约现代设计
            - 使用清晰的视觉层次结构，突出重要内容
            - 配色方案应专业、和谐，适合长时间阅读

    ## 技术规范
    - 使用HTML5、TailwindCSS 3.0+（通过CDN引入）和必要的JavaScript
    - 实现完整的深色/浅色模式切换功能，默认跟随系统设置
    - 代码结构清晰，包含适当注释，便于理解和维护

    ## 响应式设计
    - 页面必须在所有设备上（手机、平板、桌面）完美展示
    - 针对不同屏幕尺寸优化布局和字体大小
    - 确保移动端有良好的触控体验

    ## 图标与视觉元素
    - 使用专业图标库如Font Awesome或Material Icons（通过CDN引入）
    - 根据内容主题选择合适的插图或图表展示数据
    - 避免使用emoji作为主要图标

    ## 交互体验
    - 添加适当的微交互效果提升用户体验：
      * 按钮悬停时有轻微放大和颜色变化
      * 卡片元素悬停时有精致的阴影和边框效果
      * 页面滚动时有平滑过渡效果
      * 内容区块加载时有优雅的淡入动画

    ## 性能优化
    - 确保页面加载速度快，避免不必要的大型资源
    - 图片使用现代格式(WebP)并进行适当压缩
    - 实现懒加载技术用于长页面内容
            - 友好的操作提示
         10. 性能优化：
            - 大文件编辑支持
            - 编辑实时保存
            - 离线编辑功能
            - 内容加载优化
         11. 辅助功能：
             - 文章大纲导航
             -  搜索和替换
             - 拼写检查
             - 自动保存和备份
             - 导入导出进度提示
             - 根据文字可以切分为多张图片、适配小红书、微信文字界面的图片/文字功能 -->
## 技术栈
🖥️ 前端 (Vite + React + TypeScript)
│
├── 编辑器区（Editor）
│   ├── CodeMirror 6 核心
│   ├── 快捷键支持（@codemirror/commands）
│   ├── 自动补全（@codemirror/autocomplete）
│   ├── 滚动同步逻辑（scroll event listener）
│
├── 预览器区（Preview）
│   ├── React Markdown
│   ├── remark-gfm（表格、任务列表）
│   ├── rehype-highlight（代码块高亮）
│   ├── remark-math + rehype-katex（数学公式）
│   ├── remark-toc（目录生成）
│
├── 状态管理区（State）
│   ├── Zustand / Jotai（管理编辑内容、主题模式）
│
├── 持久化存储区（Persistence）
│   ├── localForage（自动保存草稿，多版本备份）
│
├── UI 界面（UI）
│   ├── Tailwind CSS（统一主题）
│   ├── Headless UI（对话框、菜单等）
│   ├── ThemeContext（暗黑/亮色切换）
│   ├── Heroicons / Lucide（图标）
│
└── 工具支持（Utilities）
    ├── lodash.debounce（输入防抖自动保存）
    ├── 自定义 Hook（如 useMarkdownEditor、useScrollSync）
             