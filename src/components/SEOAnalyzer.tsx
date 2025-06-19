import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  TagIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  HashtagIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface SEOAnalyzerProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SEOMetrics {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  headingCount: { [key: string]: number };
  keywords: { word: string; count: number; density: number }[];
  readabilityScore: number;
  suggestions: SEOSuggestion[];
  metaData: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

interface SEOSuggestion {
  type: 'error' | 'warning' | 'info';
  message: string;
  action?: string;
}

// 提取关键词
const extractKeywords = (text: string) => {
  // 移除标点符号和特殊字符，转换为小写
  const cleanText = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff]/g, ' ');
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);

  // 常见停用词（中英文）
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '他', '她', '它', '我们', '你们', '他们'
  ]);

  // 统计词频
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 1) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  // 转换为数组并计算密度
  const totalWords = words.length;
  return Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / totalWords) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // 取前20个关键词
};

// 估算音节数（简化版）
const estimateSyllables = (text: string): number => {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  return words.reduce((total, word) => {
    // 简单的音节估算
    const vowels = word.match(/[aeiouy]+/g) || [];
    let syllables = vowels.length;
    if (word.endsWith('e')) syllables--;
    return total + Math.max(1, syllables);
  }, 0);
};

// 计算可读性评分（简化版Flesch Reading Ease）
const calculateReadabilityScore = (text: string, wordCount: number): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllables = estimateSyllables(text);

  if (sentences === 0 || wordCount === 0) return 0;

  // 简化的可读性公式
  const avgWordsPerSentence = wordCount / sentences;
  const avgSyllablesPerWord = syllables / wordCount;

  // 调整后的评分（0-100，100最易读）
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, score));
};

// 提取元数据
const extractMetaData = (text: string) => {
  const lines = text.split('\n');
  const firstHeading = lines.find(line => line.match(/^#\s+/));
  const title = firstHeading?.replace(/^#\s+/, '').trim();

  // 尝试提取描述（第一段文本）
  const firstParagraph = lines.find(line =>
    line.trim().length > 0 &&
    !line.match(/^#+\s/) &&
    !line.match(/^[-*+]\s/) &&
    !line.match(/^\d+\.\s/)
  );

  return {
    title,
    description: firstParagraph?.trim().substring(0, 160),
  };
};

// 生成SEO建议
const generateSEOSuggestions = (
  wordCount: number,
  headingCount: { [key: string]: number },
  keywords: { word: string; count: number; density: number }[],
  metaData: { title?: string; description?: string }
): SEOSuggestion[] => {
  const suggestions: SEOSuggestion[] = [];

  // 字数检查
  if (wordCount < 300) {
    suggestions.push({
      type: 'warning',
      message: '文章字数较少，建议增加到300字以上以提高SEO效果',
      action: '增加更多有价值的内容'
    });
  } else if (wordCount > 2000) {
    suggestions.push({
      type: 'info',
      message: '文章字数较多，考虑分割为多篇文章或添加目录',
      action: '优化文章结构'
    });
  }

  // 标题检查
  if (!headingCount.H1) {
    suggestions.push({
      type: 'error',
      message: '缺少主标题（H1），这对SEO很重要',
      action: '添加一个主标题'
    });
  } else if (headingCount.H1 > 1) {
    suggestions.push({
      type: 'warning',
      message: '有多个主标题（H1），建议只使用一个',
      action: '将其他H1改为H2或H3'
    });
  }

  // 标题层级检查
  if (headingCount.H2 && !headingCount.H1) {
    suggestions.push({
      type: 'warning',
      message: '有H2标题但缺少H1，建议保持标题层级结构',
      action: '添加H1主标题'
    });
  }

  // 关键词密度检查
  const topKeyword = keywords[0];
  if (topKeyword && topKeyword.density > 5) {
    suggestions.push({
      type: 'warning',
      message: `关键词"${topKeyword.word}"密度过高（${topKeyword.density.toFixed(1)}%），可能被视为关键词堆砌`,
      action: '适当减少关键词使用频率'
    });
  }

  // 元数据检查
  if (!metaData.title) {
    suggestions.push({
      type: 'error',
      message: '缺少标题，这对SEO至关重要',
      action: '添加一个描述性的标题'
    });
  } else if (metaData.title.length > 60) {
    suggestions.push({
      type: 'warning',
      message: '标题过长，建议控制在60字符以内',
      action: '缩短标题长度'
    });
  }

  if (!metaData.description) {
    suggestions.push({
      type: 'warning',
      message: '建议添加文章描述，有助于搜索引擎理解内容',
      action: '在开头添加简短的内容描述'
    });
  } else if (metaData.description.length > 160) {
    suggestions.push({
      type: 'info',
      message: '描述较长，搜索结果中可能被截断',
      action: '考虑缩短描述到160字符以内'
    });
  }

  return suggestions;
};

const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({
  content,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'readability' | 'meta'>('overview');

  // 安全的关闭处理
  const handleClose = React.useCallback(() => {
    try {
      onClose();
    } catch (error) {
      console.error('SEO分析器关闭时出错:', error);
    }
  }, [onClose]);

  // 调试信息
  useEffect(() => {
    if (isOpen) {
      console.log('SEOAnalyzer 已打开，内容长度:', content.length);
      console.log('内容预览:', content.substring(0, 100) + '...');
    }
  }, [isOpen, content]);

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      // 清理任何可能的定时器或事件监听器
      console.log('SEOAnalyzer 组件正在卸载');
    };
  }, []);

  // 计算SEO指标
  const seoMetrics = useMemo((): SEOMetrics => {
    try {
      if (!content.trim()) {
        return {
          wordCount: 0,
          characterCount: 0,
          readingTime: 0,
          headingCount: {},
          keywords: [],
          readabilityScore: 0,
          suggestions: [],
          metaData: {},
        };
      }

      // 基础统计
      const words = content.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      const characterCount = content.length;
      const readingTime = Math.ceil(wordCount / 200); // 假设每分钟200词

      // 标题统计
      const headingMatches = content.match(/^#{1,6}\s+.+$/gm) || [];
      const headingCount: { [key: string]: number } = {};
      headingMatches.forEach(heading => {
        const level = heading.match(/^#+/)?.[0].length || 0;
        const key = `H${level}`;
        headingCount[key] = (headingCount[key] || 0) + 1;
      });

      // 关键词分析
      const keywords = extractKeywords(content);

      // 可读性评分（简化版）
      const readabilityScore = calculateReadabilityScore(content, wordCount);

      // 提取元数据
      const metaData = extractMetaData(content);

      // 生成建议
      const suggestions = generateSEOSuggestions(wordCount, headingCount, keywords, metaData);

      return {
        wordCount,
        characterCount,
        readingTime,
        headingCount,
        keywords,
        readabilityScore,
        suggestions,
        metaData,
      };
    } catch (error) {
      console.error('SEO分析计算错误:', error);
      return {
        wordCount: 0,
        characterCount: 0,
        readingTime: 0,
        headingCount: {},
        keywords: [],
        readabilityScore: 0,
        suggestions: [{
          type: 'error',
          message: 'SEO分析计算出错，请检查内容格式',
          action: '请尝试重新分析或联系技术支持'
        }],
        metaData: {},
      };
    }
  }, [content]);



  const getSuggestionIcon = (type: SEOSuggestion['type']) => {
    switch (type) {
      case 'error':
        return <XMarkIcon className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: '非常易读', color: 'text-green-500' };
    if (score >= 80) return { level: '易读', color: 'text-green-400' };
    if (score >= 70) return { level: '较易读', color: 'text-yellow-500' };
    if (score >= 60) return { level: '标准', color: 'text-orange-500' };
    if (score >= 50) return { level: '较难读', color: 'text-red-400' };
    return { level: '难读', color: 'text-red-500' };
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: ChartBarIcon },
    { id: 'keywords', label: '关键词', icon: TagIcon },
    { id: 'readability', label: '可读性', icon: EyeIcon },
    { id: 'meta', label: '元数据', icon: DocumentTextIcon },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="seo-analyzer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* 对话框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    SEO 分析
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
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
                          ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
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
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 基础统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">字数</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {seoMetrics.wordCount}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ClockIcon className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">阅读时间</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {seoMetrics.readingTime}分钟
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <HashtagIcon className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-400">标题数</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {Object.values(seoMetrics.headingCount).reduce((a, b) => a + b, 0)}
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <EyeIcon className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">可读性</span>
                        </div>
                        <div className={`text-2xl font-bold ${getReadabilityLevel(seoMetrics.readabilityScore).color}`}>
                          {Math.round(seoMetrics.readabilityScore)}
                        </div>
                      </div>
                    </div>

                    {/* SEO建议 */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        SEO 建议
                      </h3>
                      {seoMetrics.suggestions.length > 0 ? (
                        <div className="space-y-3">
                          {seoMetrics.suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`
                                p-4 rounded-lg border-l-4
                                ${suggestion.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                                  suggestion.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                                  'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                }
                              `}
                            >
                              <div className="flex items-start space-x-3">
                                {getSuggestionIcon(suggestion.type)}
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {suggestion.message}
                                  </p>
                                  {suggestion.action && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      建议：{suggestion.action}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>SEO 优化良好，暂无建议</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'keywords' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      关键词分析
                    </h3>
                    {seoMetrics.keywords.length > 0 ? (
                      <div className="space-y-2">
                        {seoMetrics.keywords.slice(0, 15).map((keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {keyword.word}
                            </span>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>出现 {keyword.count} 次</span>
                              <span>密度 {keyword.density.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        暂无关键词数据
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'readability' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      可读性分析
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            可读性评分
                          </span>
                          <span className={`text-lg font-bold ${getReadabilityLevel(seoMetrics.readabilityScore).color}`}>
                            {Math.round(seoMetrics.readabilityScore)} / 100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${seoMetrics.readabilityScore}%` }}
                          />
                        </div>
                        <p className={`text-sm mt-2 ${getReadabilityLevel(seoMetrics.readabilityScore).color}`}>
                          {getReadabilityLevel(seoMetrics.readabilityScore).level}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">平均句长</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {Math.round(seoMetrics.wordCount / (content.split(/[.!?]+/).length || 1))} 词
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-400">字符数</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {seoMetrics.characterCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'meta' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      元数据信息
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          标题
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {seoMetrics.metaData.title ? (
                            <div>
                              <p className="text-gray-900 dark:text-gray-100">
                                {seoMetrics.metaData.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                长度: {seoMetrics.metaData.title.length} 字符
                                {seoMetrics.metaData.title.length > 60 && (
                                  <span className="text-red-500 ml-2">过长</span>
                                )}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">未找到标题</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          描述
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {seoMetrics.metaData.description ? (
                            <div>
                              <p className="text-gray-900 dark:text-gray-100">
                                {seoMetrics.metaData.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                长度: {seoMetrics.metaData.description.length} 字符
                                {seoMetrics.metaData.description.length > 160 && (
                                  <span className="text-yellow-500 ml-2">较长</span>
                                )}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">未找到描述</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          标题结构
                        </label>
                        <div className="space-y-2">
                          {Object.entries(seoMetrics.headingCount).map(([level, count]) => (
                            <div key={level} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {level}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {count} 个
                              </span>
                            </div>
                          ))}
                          {Object.keys(seoMetrics.headingCount).length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              未找到标题
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
};

export default SEOAnalyzer;
