import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ClockIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  PlusIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface Version {
  id: string;
  title?: string;
  content: string;
  timestamp: number;
  size: number;
}

interface TailwindVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  onRestoreVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSaveVersion: (title?: string) => void;
  currentContent: string;
}

const TailwindVersionHistory: React.FC<TailwindVersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  onRestoreVersion,
  onDeleteVersion,
  onSaveVersion,
  currentContent,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [versionTitle, setVersionTitle] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleSaveVersion = () => {
    onSaveVersion(versionTitle.trim() || undefined);
    setVersionTitle('');
    setShowSaveDialog(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getVersionPreview = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const preview = lines.slice(0, 3).join('\n');
    return preview.length > 100 ? preview.substring(0, 100) + '...' : preview;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 对话框 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    版本历史
                  </h2>
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {versions.length} 个版本
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSaveDialog(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>保存当前版本</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="flex h-96">
                {/* 版本列表 */}
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                  {versions.length > 0 ? (
                    <div className="p-4 space-y-3">
                      {versions.map((version, index) => (
                        <motion.div
                          key={version.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            p-4 rounded-lg border cursor-pointer transition-all
                            ${selectedVersion === version.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }
                          `}
                          onClick={() => setSelectedVersion(version.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {version.title || `版本 ${versions.length - index}`}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {formatDate(version.timestamp)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                {getVersionPreview(version.content)}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatSize(version.size)}
                                </span>
                                <div className="flex space-x-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRestoreVersion(version.id);
                                    }}
                                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                                    title="恢复此版本"
                                  >
                                    <ArrowUturnLeftIcon className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteVersion(version.id);
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                    title="删除此版本"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <ClockIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        暂无版本历史
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        保存当前版本开始记录历史
                      </p>
                    </div>
                  )}
                </div>

                {/* 版本预览 */}
                <div className="w-1/2 p-4">
                  {selectedVersion ? (
                    <div className="h-full">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        版本预览
                      </h3>
                      <div className="h-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-y-auto">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                          {versions.find(v => v.id === selectedVersion)?.content}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          选择一个版本查看预览
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 保存版本对话框 */}
              {showSaveDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      保存当前版本
                    </h3>
                    <input
                      type="text"
                      value={versionTitle}
                      onChange={(e) => setVersionTitle(e.target.value)}
                      placeholder="版本标题（可选）"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => setShowSaveDialog(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        取消
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveVersion}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        保存
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TailwindVersionHistory;
