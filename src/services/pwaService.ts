// PWA 服务管理
export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAUpdateInfo {
  isUpdateAvailable: boolean;
  newWorker?: ServiceWorker;
}

export interface PWAStatus {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt?: PWAInstallPrompt;
}

class PWAService {
  private installPrompt: PWAInstallPrompt | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private newWorker: ServiceWorker | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  // 初始化事件监听器
  private initializeEventListeners() {
    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as any;
      this.emit('installable', true);
      console.log('[PWA] Install prompt available');
    });

    // 监听应用安装事件
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.emit('installed', true);
      console.log('[PWA] App installed successfully');
    });

    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.emit('online', true);
      console.log('[PWA] App is online');
    });

    window.addEventListener('offline', () => {
      this.emit('online', false);
      console.log('[PWA] App is offline');
    });
  }

  // 注册 Service Worker
  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered successfully');

      // 监听更新
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          this.handleServiceWorkerUpdate(newWorker);
        }
      });

      // 检查是否有等待中的 Service Worker
      if (this.registration.waiting) {
        this.handleServiceWorkerUpdate(this.registration.waiting);
      }

      return true;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return false;
    }
  }

  // 处理 Service Worker 更新
  private handleServiceWorkerUpdate(newWorker: ServiceWorker) {
    this.newWorker = newWorker;
    this.updateAvailable = true;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        this.emit('updateAvailable', {
          isUpdateAvailable: true,
          newWorker
        });
        console.log('[PWA] New version available');
      }
    });
  }

  // 应用更新
  async applyUpdate(): Promise<void> {
    if (!this.newWorker) {
      throw new Error('No update available');
    }

    // 发送消息给新的 Service Worker 让其跳过等待
    this.newWorker.postMessage({ type: 'SKIP_WAITING' });

    // 等待新的 Service Worker 激活
    return new Promise((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        resolve();
        window.location.reload();
      });
    });
  }

  // 显示安装提示
  async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
        return true;
      } else {
        console.log('[PWA] User dismissed install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  }

  // 检查是否已安装
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // 检查是否可安装
  isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  // 检查是否在线
  isOnline(): boolean {
    return navigator.onLine;
  }

  // 检查是否有更新
  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  // 获取PWA状态
  getStatus(): PWAStatus {
    return {
      isInstalled: this.isInstalled(),
      isInstallable: this.isInstallable(),
      isOnline: this.isOnline(),
      isUpdateAvailable: this.isUpdateAvailable(),
      installPrompt: this.installPrompt || undefined
    };
  }

  // 清除缓存
  async clearCache(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve();
        } else {
          reject(new Error('Failed to clear cache'));
        }
      };

      this.registration!.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  // 获取版本信息
  async getVersion(): Promise<string> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version);
      };

      this.registration!.active?.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );

      // 超时处理
      setTimeout(() => {
        reject(new Error('Version request timeout'));
      }, 5000);
    });
  }

  // 事件监听器管理
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // 预缓存重要资源
  async precacheResources(urls: string[]): Promise<void> {
    if (!('caches' in window)) {
      console.warn('[PWA] Cache API not supported');
      return;
    }

    try {
      const cache = await caches.open('markdown-editor-precache');
      await cache.addAll(urls);
      console.log('[PWA] Resources precached successfully');
    } catch (error) {
      console.error('[PWA] Failed to precache resources:', error);
    }
  }

  // 离线存储管理
  async storeOfflineData(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('[PWA] Failed to store offline data:', error);
    }
  }

  async getOfflineData(key: string): Promise<any> {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('[PWA] Failed to get offline data:', error);
      return null;
    }
  }

  // 同步离线数据
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline()) {
      console.log('[PWA] Cannot sync offline data - app is offline');
      return;
    }

    // 这里可以添加同步逻辑
    console.log('[PWA] Syncing offline data...');
  }
}

export const pwaService = new PWAService();
