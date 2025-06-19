import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pwaService, PWAStatus as PWAStatusType } from '../services/pwaService';

interface PWAStatusProps {
  className?: string;
}

const PWAStatus: React.FC<PWAStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<PWAStatusType>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isUpdateAvailable: false
  });
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // 初始化PWA服务
    const initPWA = async () => {
      await pwaService.registerServiceWorker();
      updateStatus();
    };

    initPWA();

    // 设置事件监听器
    const handleInstallable = () => {
      updateStatus();
      setShowInstallBanner(true);
    };

    const handleInstalled = () => {
      updateStatus();
      setShowInstallBanner(false);
    };

    const handleOnline = () => {
      updateStatus();
    };

    const handleUpdateAvailable = () => {
      updateStatus();
      setShowUpdateBanner(true);
    };

    pwaService.on('installable', handleInstallable);
    pwaService.on('installed', handleInstalled);
    pwaService.on('online', handleOnline);
    pwaService.on('updateAvailable', handleUpdateAvailable);

    return () => {
      pwaService.off('installable', handleInstallable);
      pwaService.off('installed', handleInstalled);
      pwaService.off('online', handleOnline);
      pwaService.off('updateAvailable', handleUpdateAvailable);
    };
  }, []);

  const updateStatus = () => {
    setStatus(pwaService.getStatus());
  };

  const handleInstall = async () => {
    if (!status.isInstallable) return;

    setIsInstalling(true);
    try {
      const accepted = await pwaService.showInstallPrompt();
      if (accepted) {
        setShowInstallBanner(false);
      }
    } catch (error) {
      console.error('安装失败:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await pwaService.applyUpdate();
      setShowUpdateBanner(false);
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
  };

  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false);
  };

  return (
    <div className={`pwa-status ${className}`}>
      {/* 网络状态指示器 */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          status.isOnline ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {status.isOnline ? '在线' : '离线'}
        </span>
      </div>

      {/* 安装横幅 */}
      <AnimatePresence>
        {showInstallBanner && status.isInstallable && !status.isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-medium">安装应用到桌面</p>
                <p className="text-sm opacity-90">获得更好的使用体验</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isInstalling ? '安装中...' : '安装'}
                </button>
                <button
                  onClick={dismissInstallBanner}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 更新横幅 */}
      <AnimatePresence>
        {showUpdateBanner && status.isUpdateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-medium">新版本可用</p>
                <p className="text-sm opacity-90">点击更新获得最新功能</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? '更新中...' : '更新'}
                </button>
                <button
                  onClick={dismissUpdateBanner}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 离线提示 */}
      <AnimatePresence>
        {!status.isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
              <div className="w-5 h-5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">离线模式</p>
                <p className="text-sm opacity-90">您的编辑内容会自动保存</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PWAStatus;
