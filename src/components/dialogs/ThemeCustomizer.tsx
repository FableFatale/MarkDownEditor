import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaintBrushIcon,
  XMarkIcon,
  SwatchIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    base: number;
    scale: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApply?: (theme: CustomTheme) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  onThemeApply,
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'spacing'>('colors');
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>({
    id: 'custom',
    name: '自定义主题',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    spacing: {
      base: 16,
      scale: 1.25,
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
    },
  });

  const [presetThemes] = useState<CustomTheme[]>([
    {
      id: 'default',
      name: '默认主题',
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
      },
      fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Consolas, monospace',
      },
      spacing: { base: 16, scale: 1.25 },
      borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
    },
    {
      id: 'dark',
      name: '深色主题',
      colors: {
        primary: '#60a5fa',
        secondary: '#818cf8',
        accent: '#fbbf24',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
      },
      fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Consolas, monospace',
      },
      spacing: { base: 16, scale: 1.25 },
      borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
    },
    {
      id: 'nature',
      name: '自然主题',
      colors: {
        primary: '#059669',
        secondary: '#0d9488',
        accent: '#f59e0b',
        background: '#f0fdf4',
        surface: '#ecfdf5',
        text: '#064e3b',
        textSecondary: '#047857',
        border: '#bbf7d0',
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'system-ui, sans-serif',
        mono: 'Monaco, Consolas, monospace',
      },
      spacing: { base: 18, scale: 1.3 },
      borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem' },
    },
    {
      id: 'ocean',
      name: '海洋主题',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#06b6d4',
        background: '#f0f9ff',
        surface: '#e0f2fe',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
      },
      fonts: {
        heading: 'Playfair Display, serif',
        body: 'Source Sans Pro, sans-serif',
        mono: 'Source Code Pro, monospace',
      },
      spacing: { base: 16, scale: 1.2 },
      borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem' },
    },
  ]);

  // 从本地存储加载主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        setCurrentTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to load saved theme:', error);
      }
    }
  }, []);

  // 保存主题到本地存储
  const saveTheme = (theme: CustomTheme) => {
    localStorage.setItem('customTheme', JSON.stringify(theme));
  };

  // 应用主题
  const applyTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    saveTheme(theme);
    
    // 应用CSS变量
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // 应用字体
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-mono', theme.fonts.mono);
    
    // 应用间距
    root.style.setProperty('--spacing-base', `${theme.spacing.base}px`);
    root.style.setProperty('--spacing-scale', theme.spacing.scale.toString());
    
    // 应用圆角
    root.style.setProperty('--radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--radius-md', theme.borderRadius.md);
    root.style.setProperty('--radius-lg', theme.borderRadius.lg);
    
    onThemeApply?.(theme);
  };

  // 重置主题
  const resetTheme = () => {
    const defaultTheme = presetThemes[0];
    applyTheme(defaultTheme);
  };

  // 更新颜色
  const updateColor = (colorKey: keyof CustomTheme['colors'], value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  // 更新字体
  const updateFont = (fontKey: keyof CustomTheme['fonts'], value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value,
      },
    }));
  };

  // 更新间距
  const updateSpacing = (spacingKey: keyof CustomTheme['spacing'], value: number) => {
    setCurrentTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value,
      },
    }));
  };

  // 更新圆角
  const updateBorderRadius = (radiusKey: keyof CustomTheme['borderRadius'], value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      borderRadius: {
        ...prev.borderRadius,
        [radiusKey]: value,
      },
    }));
  };

  const tabs = [
    { id: 'colors', label: '颜色', icon: SwatchIcon },
    { id: 'fonts', label: '字体', icon: PaintBrushIcon },
    { id: 'spacing', label: '间距', icon: EyeIcon },
  ];

  const colorOptions = [
    { key: 'primary', label: '主色', description: '主要按钮和链接' },
    { key: 'secondary', label: '次要色', description: '次要元素' },
    { key: 'accent', label: '强调色', description: '高亮和强调' },
    { key: 'background', label: '背景色', description: '页面背景' },
    { key: 'surface', label: '表面色', description: '卡片和面板' },
    { key: 'text', label: '文本色', description: '主要文本' },
    { key: 'textSecondary', label: '次要文本', description: '辅助文本' },
    { key: 'border', label: '边框色', description: '边框和分割线' },
  ];

  const fontOptions = [
    { key: 'heading', label: '标题字体', description: '用于标题和重要文本' },
    { key: 'body', label: '正文字体', description: '用于正文内容' },
    { key: 'mono', label: '等宽字体', description: '用于代码和数据' },
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <PaintBrushIcon className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    主题定制器
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTheme}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>重置</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyTheme(currentTheme)}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>应用主题</span>
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

              {/* 预设主题 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  预设主题
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {presetThemes.map((theme) => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTheme(theme)}
                      className={`
                        p-3 rounded-lg border text-left transition-all
                        ${currentTheme.id === theme.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {theme.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
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
                          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400'
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
                {activeTab === 'colors' && (
                  <div className="space-y-4">
                    {colorOptions.map((option) => (
                      <div key={option.key} className="flex items-center space-x-4">
                        <div className="w-24 flex-shrink-0">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {option.label}
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="color"
                            value={currentTheme.colors[option.key as keyof CustomTheme['colors']]}
                            onChange={(e) => updateColor(option.key as keyof CustomTheme['colors'], e.target.value)}
                            className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={currentTheme.colors[option.key as keyof CustomTheme['colors']]}
                            onChange={(e) => updateColor(option.key as keyof CustomTheme['colors'], e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'fonts' && (
                  <div className="space-y-4">
                    {fontOptions.map((option) => (
                      <div key={option.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {option.label}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {option.description}
                        </p>
                        <input
                          type="text"
                          value={currentTheme.fonts[option.key as keyof CustomTheme['fonts']]}
                          onChange={(e) => updateFont(option.key as keyof CustomTheme['fonts'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="例如: Inter, system-ui, sans-serif"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'spacing' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        基础间距: {currentTheme.spacing.base}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={currentTheme.spacing.base}
                        onChange={(e) => updateSpacing('base', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        间距比例: {currentTheme.spacing.scale}
                      </label>
                      <input
                        type="range"
                        min="1.1"
                        max="1.5"
                        step="0.05"
                        value={currentTheme.spacing.scale}
                        onChange={(e) => updateSpacing('scale', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        圆角设置
                      </h4>
                      {Object.entries(currentTheme.borderRadius).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {key.toUpperCase()}: {value}
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateBorderRadius(key as keyof CustomTheme['borderRadius'], e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            placeholder="例如: 0.5rem"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemeCustomizer;
