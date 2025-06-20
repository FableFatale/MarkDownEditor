import React, { useState, useEffect } from 'react';
import { ClockIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

interface BackupManagerProps {
  content: string;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ content }) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // 自动保存功能
  useEffect(() => {
    // 每5分钟自动保存一次
    const autoSaveInterval = setInterval(() => {
      if (content) {
        saveBackup();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(autoSaveInterval);
  }, [content]);

  // 保存备份
  const saveBackup = () => {
    try {
      const backups = JSON.parse(localStorage.getItem('markdown-backups') || '[]');

      // 限制最多保存10个备份
      if (backups.length >= 10) {
        backups.pop(); // 移除最旧的备份
      }

      // 添加新备份
      backups.unshift({
        timestamp: Date.now(),
        content: content,
        preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
      });

      localStorage.setItem('markdown-backups', JSON.stringify(backups));
      showNotification('备份已保存', 'success');
      return true;
    } catch (error) {
      console.error('保存备份失败:', error);
      showNotification('备份保存失败', 'error');
      return false;
    }
  };

  // 显示通知
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <>
      {/* 备份按钮 */}
      <button
        onClick={saveBackup}
        className="text-xs flex items-center text-gray-500 hover:text-primary-500 transition-colors"
        title="创建备份"
      >
        <ClockIcon className="w-4 h-4 mr-1" />
        自动保存
      </button>

      {/* 通知提示 */}
      <Transition
        show={notification.show}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`px-4 py-2 rounded-lg shadow-lg ${
          notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      </Transition>
    </>
  );
};