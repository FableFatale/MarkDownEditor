import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface EditorSettings {
  fontSize: number;
  lineHeight: number;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  editorWidth: number;
  headingStyle: 'default' | 'underline' | 'bordered' | 'gradient' | 'modern' | 'elegant';
}

interface TailwindSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

const TailwindSettingsDialog: React.FC<TailwindSettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'editor' | 'appearance' | 'preview'>('editor');

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'editor', label: '编辑器', icon: DocumentTextIcon },
    { id: 'appearance', label: '外观', icon: PaintBrushIcon },
    { id: 'preview', label: '预览', icon: EyeIcon },
  ];

  const headingStyles = [
    { value: 'default', label: '默认样式' },
    { value: 'underline', label: '下划线' },
    { value: 'bordered', label: '边框' },
    { value: 'gradient', label: '渐变' },
    { value: 'modern', label: '现代' },
    { value: 'elegant', label: '优雅' },
  ];

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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Cog6ToothIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    编辑器设置
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>

              {/* 标签页 */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors
                        ${activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 内容区域 */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'editor' && (
                  <div className="space-y-6">
                    {/* 字体大小 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        字体大小: {localSettings.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        value={localSettings.fontSize}
                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    {/* 行高 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        行高: {localSettings.lineHeight}
                      </label>
                      <input
                        type="range"
                        min="1.2"
                        max="2.0"
                        step="0.1"
                        value={localSettings.lineHeight}
                        onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    {/* 编辑器宽度 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        编辑器宽度: {localSettings.editorWidth}%
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="70"
                        value={localSettings.editorWidth}
                        onChange={(e) => updateSetting('editorWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    {/* 开关选项 */}
                    <div className="space-y-4">
                      {[
                        { key: 'autoSave', label: '自动保存' },
                        { key: 'showLineNumbers', label: '显示行号' },
                        { key: 'wordWrap', label: '自动换行' },
                      ].map((option) => (
                        <div key={option.key} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                          <button
                            onClick={() => updateSetting(option.key as keyof EditorSettings, !localSettings[option.key as keyof EditorSettings])}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${localSettings[option.key as keyof EditorSettings]
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                              }
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${localSettings[option.key as keyof EditorSettings]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                                }
                              `}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        主题设置
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        主题切换功能已在工具栏中提供，您可以在浅色和深色模式之间切换。
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    {/* 标题样式 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        标题样式
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {headingStyles.map((style) => (
                          <button
                            key={style.value}
                            onClick={() => updateSetting('headingStyle', style.value as any)}
                            className={`
                              p-3 text-left rounded-lg border transition-all
                              ${localSettings.headingStyle === style.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }
                            `}
                          >
                            <div className="text-sm font-medium">{style.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  重置
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    取消
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    保存设置
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TailwindSettingsDialog;
