import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  SparklesIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface SpellingError {
  word: string;
  index: number;
  suggestions: string[];
}

interface TailwindSpellCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onCorrect: (correctedContent: string) => void;
}

const TailwindSpellChecker: React.FC<TailwindSpellCheckerProps> = ({
  isOpen,
  onClose,
  content,
  onCorrect,
}) => {
  const [errors, setErrors] = useState<SpellingError[]>([]);
  const [customDictionary, setCustomDictionary] = useState<Set<string>>(new Set());
  const [selectedError, setSelectedError] = useState<SpellingError | null>(null);
  const [showAddWord, setShowAddWord] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [showDictionary, setShowDictionary] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // 从本地存储加载自定义词典
  useEffect(() => {
    const savedDictionary = localStorage.getItem('customDictionary');
    if (savedDictionary) {
      setCustomDictionary(new Set(JSON.parse(savedDictionary)));
    }
  }, []);

  // 保存自定义词典到本地存储
  const saveDictionary = useCallback((words: Set<string>) => {
    localStorage.setItem('customDictionary', JSON.stringify(Array.from(words)));
  }, []);

  // 简单的拼写检查（模拟）
  const checkSpelling = useCallback(async (text: string) => {
    setIsChecking(true);
    
    // 模拟拼写检查延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const errors: SpellingError[] = [];
    const words = text.split(/\s+/);
    
    // 常见的拼写错误示例（实际应用中应该使用真正的拼写检查库）
    const commonMisspellings: { [key: string]: string[] } = {
      'teh': ['the'],
      'recieve': ['receive'],
      'seperate': ['separate'],
      'occured': ['occurred'],
      'definately': ['definitely'],
      'accomodate': ['accommodate'],
      'neccessary': ['necessary'],
      'begining': ['beginning'],
      'existance': ['existence'],
      'maintainance': ['maintenance'],
    };
    
    words.forEach((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      
      // 跳过自定义词典中的单词
      if (customDictionary.has(cleanWord)) {
        return;
      }
      
      // 检查是否是常见拼写错误
      if (commonMisspellings[cleanWord]) {
        const wordIndex = text.indexOf(word);
        if (wordIndex !== -1) {
          errors.push({
            word,
            index: wordIndex,
            suggestions: commonMisspellings[cleanWord],
          });
        }
      }
    });
    
    setErrors(errors);
    setIsChecking(false);
  }, [customDictionary]);

  // 监听内容变化
  useEffect(() => {
    if (isOpen && content) {
      const debounceTimer = setTimeout(() => {
        checkSpelling(content);
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [content, checkSpelling, isOpen]);

  // 添加单词到自定义词典
  const handleAddWord = () => {
    if (newWord.trim()) {
      const updatedWords = new Set(customDictionary);
      updatedWords.add(newWord.toLowerCase().trim());
      setCustomDictionary(updatedWords);
      saveDictionary(updatedWords);
      setNewWord('');
      setShowAddWord(false);
      checkSpelling(content);
    }
  };

  // 从自定义词典中删除单词
  const handleDeleteWord = (word: string) => {
    const updatedWords = new Set(customDictionary);
    updatedWords.delete(word.toLowerCase());
    setCustomDictionary(updatedWords);
    saveDictionary(updatedWords);
    checkSpelling(content);
  };

  // 替换错误单词
  const handleCorrect = (error: SpellingError, correction: string) => {
    const before = content.slice(0, error.index);
    const after = content.slice(error.index + error.word.length);
    const correctedContent = before + correction + after;
    onCorrect(correctedContent);
    setSelectedError(null);
  };

  // 忽略错误（添加到词典）
  const handleIgnore = (error: SpellingError) => {
    const cleanWord = error.word.toLowerCase().replace(/[^\w]/g, '');
    const updatedWords = new Set(customDictionary);
    updatedWords.add(cleanWord);
    setCustomDictionary(updatedWords);
    saveDictionary(updatedWords);
    checkSpelling(content);
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    拼写检查
                  </h2>
                  {isChecking && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                      <span className="text-sm text-gray-500">检查中...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDictionary(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <BookOpenIcon className="w-4 h-4" />
                    <span>词典</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddWord(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>添加单词</span>
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
              <div className="p-6 max-h-96 overflow-y-auto">
                {errors.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        发现 {errors.length} 个拼写错误
                      </h3>
                    </div>
                    
                    {errors.map((error, index) => (
                      <motion.div
                        key={`${error.word}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded">
                                {error.word}
                              </span>
                              <span className="text-sm text-gray-500">
                                位置: {error.index}
                              </span>
                            </div>
                            
                            {error.suggestions.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  建议替换为:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {error.suggestions.map((suggestion, suggestionIndex) => (
                                    <motion.button
                                      key={suggestionIndex}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleCorrect(error, suggestion)}
                                      className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                                    >
                                      {suggestion}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleIgnore(error)}
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                              title="忽略并添加到词典"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SparklesIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      拼写检查完成
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      未发现拼写错误，您的文档看起来很棒！
                    </p>
                  </div>
                )}
              </div>

              {/* 添加单词对话框 */}
              {showAddWord && (
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
                      添加单词到词典
                    </h3>
                    <input
                      type="text"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="输入单词"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                    />
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => setShowAddWord(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        取消
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddWord}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        添加
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 自定义词典对话框 */}
              {showDictionary && (
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
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-hidden"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      自定义词典
                    </h3>
                    <div className="max-h-64 overflow-y-auto">
                      {Array.from(customDictionary).length > 0 ? (
                        <div className="space-y-2">
                          {Array.from(customDictionary).map((word) => (
                            <div
                              key={word}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                            >
                              <span className="text-sm text-gray-900 dark:text-white">
                                {word}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteWord(word)}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                          词典为空
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowDictionary(false)}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        关闭
                      </button>
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

export default TailwindSpellChecker;
