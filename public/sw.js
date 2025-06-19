// Service Worker for Markdown Editor PWA
const CACHE_NAME = 'markdown-editor-v1.0.0';
const STATIC_CACHE_NAME = 'markdown-editor-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'markdown-editor-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/TailwindApp.tsx',
  '/src/tailwind.css',
  '/src/markdown-styles.css',
  '/src/katex-styles.css',
  // 添加其他关键资源
];

// 需要缓存的动态资源模式
const CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/cdn\.jsdelivr\.net/,
  /\.(?:js|css|woff2?|ttf|eot)$/,
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('markdown-editor-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    handleFetchRequest(request)
  );
});

// 处理网络请求的核心逻辑
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. 对于导航请求，优先使用网络，失败时返回缓存的 index.html
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    }

    // 2. 对于静态资源，优先使用缓存
    if (isStaticAsset(url)) {
      return await handleStaticAssetRequest(request);
    }

    // 3. 对于动态资源，使用网络优先策略
    if (shouldCache(url)) {
      return await handleDynamicRequest(request);
    }

    // 4. 其他请求直接通过网络
    return await fetch(request);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    
    // 如果是导航请求失败，返回离线页面
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      return await cache.match('/') || new Response('离线模式', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

// 处理导航请求
async function handleNavigationRequest(request) {
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request);
    
    // 如果成功，缓存响应并返回
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // 网络失败，返回缓存的页面
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('/');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果没有缓存，返回基本的离线页面
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>离线模式 - Markdown 编辑器</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: sans-serif;">
            <h1>离线模式</h1>
            <p>您当前处于离线状态，但可以继续使用编辑器的基本功能。</p>
            <button onclick="location.reload()">重新连接</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// 处理静态资源请求
async function handleStaticAssetRequest(request) {
  // 缓存优先策略
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 缓存中没有，尝试网络请求
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.error('[SW] Failed to fetch static asset:', request.url);
    throw error;
  }
}

// 处理动态请求
async function handleDynamicRequest(request) {
  try {
    // 网络优先策略
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 缓存成功的响应
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 判断是否为静态资源
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname === asset) ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.endsWith('.ttf');
}

// 判断是否应该缓存
function shouldCache(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url.href));
}

// 消息处理
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

// 后台同步（如果支持）
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });
}

async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  // 这里可以添加后台同步逻辑，比如同步离线时的编辑内容
}

console.log('[SW] Service Worker script loaded');
