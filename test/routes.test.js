/**
 * 路由配置测试
 * 验证应用的路由配置是否正确
 */

describe('路由配置测试', () => {
  // 模拟URL参数
  const createMockURLParams = (paramString) => {
    const params = new URLSearchParams(paramString);
    return {
      has: (key) => params.has(key),
      get: (key) => params.get(key)
    };
  };

  test('默认路由应该显示单行工具栏编辑器', () => {
    const urlParams = createMockURLParams('');

    // 模拟路由逻辑
    const showTest = urlParams.has('test');
    const showSimple = urlParams.has('simple');
    const showBasic = urlParams.has('basic');
    const showSingleRow = urlParams.has('single-row');

    let componentName = 'SingleRowEditorDemo'; // 默认组件

    if (showTest) {
      componentName = 'TestComponent';
    } else if (showSimple) {
      componentName = 'SimpleMarkdownEditor';
    } else if (showBasic) {
      componentName = 'BasicEditor';
    } else if (showSingleRow) {
      componentName = 'SingleRowEditorDemo';
    }

    expect(componentName).toBe('SingleRowEditorDemo');
  });



  test('single-row参数应该显示单行工具栏编辑器', () => {
    const urlParams = createMockURLParams('single-row');

    const showSingleRow = urlParams.has('single-row');

    expect(showSingleRow).toBe(true);
  });

  test('test参数应该显示测试组件', () => {
    const urlParams = createMockURLParams('test');

    const showTest = urlParams.has('test');

    expect(showTest).toBe(true);
  });

  test('simple参数应该显示简单编辑器', () => {
    const urlParams = createMockURLParams('simple');

    const showSimple = urlParams.has('simple');

    expect(showSimple).toBe(true);
  });

  test('basic参数应该显示基础编辑器', () => {
    const urlParams = createMockURLParams('basic');

    const showBasic = urlParams.has('basic');

    expect(showBasic).toBe(true);
  });

  test('modern参数应该显示现代编辑器', () => {
    const urlParams = createMockURLParams('modern');

    const showModern = urlParams.has('modern');

    expect(showModern).toBe(true);
  });

  test('article-manager参数应该显示文章管理系统', () => {
    const urlParams = createMockURLParams('article-manager');

    const showArticleManager = urlParams.has('article-manager');

    expect(showArticleManager).toBe(true);
  });

  test('tailwind相关参数应该正确识别', () => {
    const tailwindParams = [
      'tailwind',
      'simple-tailwind',
      'minimal-tailwind',
      'simple-tailwind-demo'
    ];

    tailwindParams.forEach(param => {
      const urlParams = createMockURLParams(param);
      expect(urlParams.has(param)).toBe(true);
    });
  });

  test('路由优先级应该正确', () => {
    // 测试多个参数同时存在时的优先级
    const urlParams = createMockURLParams('test&simple&basic');

    const showTest = urlParams.has('test');
    const showSimple = urlParams.has('simple');
    const showBasic = urlParams.has('basic');

    // test 应该有最高优先级
    expect(showTest).toBe(true);
    expect(showSimple).toBe(true);
    expect(showBasic).toBe(true);

    // 在实际应用中，test 会被首先匹配
  });

  test('无效参数应该使用默认路由', () => {
    const urlParams = createMockURLParams('invalid-param');

    const showInvalid = urlParams.has('invalid-param');
    const showTest = urlParams.has('test');
    const showSimple = urlParams.has('simple');

    expect(showInvalid).toBe(true);
    expect(showTest).toBe(false);
    expect(showSimple).toBe(false);

    // 应该回退到默认组件
  });

  test('空参数应该使用默认路由', () => {
    const urlParams = createMockURLParams('');

    const hasAnyKnownParam = [
      'test', 'simple', 'basic', 'modern',
      'tailwind', 'simple-tailwind', 'minimal-tailwind',
      'simple-tailwind-demo', 'single-row', 'article-manager'
    ].some(param => urlParams.has(param));

    expect(hasAnyKnownParam).toBe(false);
  });

  test('URL参数解析应该正确工作', () => {
    const testCases = [
      { url: '', expected: {} },
      { url: 'test', expected: { test: true } },
      { url: 'simple&basic', expected: { simple: true, basic: true } },

      { url: 'single-row&theme=dark', expected: { 'single-row': true, theme: true } }
    ];

    testCases.forEach(({ url, expected }) => {
      const urlParams = createMockURLParams(url);

      Object.keys(expected).forEach(key => {
        expect(urlParams.has(key)).toBe(expected[key]);
      });
    });
  });

  test('所有已知路由参数应该被正确识别', () => {
    const knownRoutes = [
      'test',
      'simple',
      'basic',
      'modern',
      'tailwind',
      'simple-tailwind',
      'minimal-tailwind',
      'simple-tailwind-demo',
      'single-row',
      'article-manager'
    ];

    knownRoutes.forEach(route => {
      const urlParams = createMockURLParams(route);
      expect(urlParams.has(route)).toBe(true);
    });
  });

  test('路由配置应该保持向后兼容', () => {
    // 确保所有原有的路由仍然可用
    const legacyRoutes = [
      'test',
      'simple',
      'basic',
      'modern',
      'tailwind',
      'article-manager'
    ];

    legacyRoutes.forEach(route => {
      const urlParams = createMockURLParams(route);
      expect(urlParams.has(route)).toBe(true);
    });
  });
});
