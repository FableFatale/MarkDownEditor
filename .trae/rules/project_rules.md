ESLint 相关:
eslint: JavaScript 和 JSX 的核心检查工具。
@typescript-eslint/parser: ESLint 解析 TypeScript 代码的解析器。
@typescript-eslint/eslint-plugin: 包含针对 TypeScript 代码的 ESLint 规则。
eslint-plugin-react: React 特定的 linting 规则。
eslint-plugin-react-hooks: 检查 React Hooks 的规则。
eslint-plugin-jsx-a11y: 检查 JSX 中的可访问性问题。
eslint-config-prettier: 关闭所有不必要或可能与 Prettier 冲突的 ESLint 规则。
eslint-plugin-import: 帮助检查模块导入导出规范，如路径、顺序等。
Prettier 相关:
prettier: 自动代码格式化工具。
eslint-plugin-prettier (可选，如果希望通过 ESLint 运行 Prettier 并报告差异为 ESLint 问题)。
Stylelint 相关 (可选, 如果你使用 CSS/SCSS/Less):
stylelint: CSS/SCSS/Less 的 linting 工具。
stylelint-config-standard: Stylelint 的标准规则集。
stylelint-config-prettier: 关闭与 Prettier 冲突的 Stylelint 规则。
stylelint-config-recess-order: (可选) 强制 CSS 属性按特定顺序排列。
Husky & lint-staged 相关 (用于 Git Hooks):
husky: Git Hooks 工具，用于在提交或推送等操作前执行脚本。
lint-staged: 在 Git 暂存文件上运行 linters。
<!-- end list -->

Bash

npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier eslint-plugin-import prettier
# 可选: Stylelint
# npm install --save-dev stylelint stylelint-config-standard stylelint-config-prettier stylelint-config-recess-order
# Husky 和 lint-staged
npm install --save-dev husky lint-staged
配置文件创建与配置:

.eslintrc.cjs (或 .eslintrc.js / .json):

env: 设置环境 (browser, es2021, node)。
extends:
eslint:recommended
plugin:@typescript-eslint/recommended (使用 TypeScript 推荐规则)
plugin:react/recommended
plugin:react/jsx-runtime (对于新的 JSX 转换)
plugin:react-hooks/recommended
plugin:jsx-a11y/recommended
plugin:import/recommended
plugin:import/typescript
prettier (确保这是最后一个，以覆盖其他配置中的格式化规则)
parser: @typescript-eslint/parser
parserOptions: ecmaVersion: 'latest', sourceType: 'module', project: './tsconfig.json' (为了更严格的类型检查规则)
plugins: @typescript-eslint, react, react-hooks, jsx-a11y, import
settings:  * react: { version: "detect" }
import/resolver: { typescript: {} }
rules (自定义或覆盖规则，这是“语法限制”的核心):
no-console: warn (开发中允许 console.warn/error, 但生产构建时应移除或报错)
no-unused-vars: off (使用 @typescript-eslint/no-unused-vars 代替)
@typescript-eslint/no-unused-vars: ['warn', { 'argsIgnorePattern': '^_' }] (未使用的变量警告，允许以下划线开头的参数未使用)
@typescript-eslint/explicit-function-return-type: warn (推荐函数显式声明返回类型)
@typescript-eslint/no-explicit-any: warn (避免使用 any 类型)
react/prop-types: off (因为使用 TypeScript 进行类型检查)
react-hooks/rules-of-hooks: error (强制 React Hooks 的规则)
react-hooks/exhaustive-deps: warn (检查 useEffect/useCallback 等的依赖项)
import/order: ['warn', {'groups': ['builtin','external','internal','parent','sibling','index'],'newlines-between':'always','alphabetize': {'order':'asc','caseInsensitive'`: true } }] (导入顺序)
添加更多你认为必要的严格规则...
.prettierrc.json (或 .prettierrc.js):

JSON

{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "all",
    "tabWidth": 2,
"printWidth": 100,
"arrowParens": "always"
}
```

tsconfig.json (确保以下或更严格的配置):

"noImplicitAny": true
"strictNullChecks": true * "strictFunctionTypes": true
"strictBindCallApply": true
"strictPropertyInitialization": true
"noImplicitThis": true
"alwaysStrict": true
"noUnusedLocals": true
"noUnusedParameters": true
"noImplicitReturns": true
"noFallthroughCasesInSwitch": true
"forceConsistentCasingInFileNames": true
stylelint.config.js (如果使用 Stylelint):

JavaScript

// stylelint.config.js
module.exports = {
  extends: [
    'stylelint-config-standard',
    // 'stylelint-config-recess-order', // 可选
    'stylelint-config-prettier', // 确保这是最后一个
  ],
  rules: {
    // 添加或覆盖规则
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'] // 如果使用 Tailwind CSS
         }],
'selector-class-pattern': null, // 如果对类名格式有特定要求，可以配置正则表达式
},
};
```

  * **`.vscode/settings.json` (推荐，用于 VS Code 编辑器集成):**

    ```json
    {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
        "source.fixAll.stylelint": "explicit" // 如果使用 Stylelint
      },
      "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
      ],
      "typescript.tsdk": "node_modules/typescript/lib",
      // Stylelint settings if used
      "css.validate": false,
      "less.validate": false,
      "scss.validate": false,
      "stylelint.enable": true
    }
    ```

      * 确保安装 VS Code 插件: ESLint, Prettier - Code formatter, Stylelint (如果使用).
配置 package.json 脚本:

Code snippet

"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,scss,md}\"",
  // "stylelint": "stylelint \"**/*.{css,scss}\"", // 如果使用 Stylelint
  // "stylelint:fix": "stylelint \"**/*.{css,scss}\" --fix", // 如果使用 Stylelint
  "typecheck": "tsc --noEmit",
  "prepare": "husky install" // npm 7+ 会自动运行 prepare, 否则手动运行 npm run prepare
},
设置 Husky 和 lint-staged:

运行 npm run prepare (如果 husky install 没有自动运行)。
创建 pre-commit hook:
Bash

npx husky add .husky/pre-commit "npx lint-staged"
在 package.json 中添加 lint-staged 配置 (或者在 .lintstagedrc.json 等文件中):
JSON

"lint-staged": {
  "*.{ts,tsx}": [
    "npm run lint:fix",
    "npm run format"
    // "npm run test -- --bail --findRelatedTests" // 可选：运行相关测试
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,html,css,scss}": "prettier --write"
  // "*.{css,scss}": ["npm run stylelint:fix", "prettier --write"] // 如果使用 Stylelint
}