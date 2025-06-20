import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOAnalyzer from './SEOAnalyzer';

const SEOTestButton: React.FC = () => {
  const [showSEO, setShowSEO] = useState(false);

  const testContent = `# 测试文章标题

这是一段测试描述，用来验证SEO分析功能是否正常工作。这段文字包含了足够的内容来进行关键词分析和可读性评估。

## 二级标题

这里是更多的内容。我们需要确保文章有足够的字数来通过SEO检查。测试内容应该包含各种元素。

### 三级标题

- 列表项目一
- 列表项目二
- 列表项目三

这是另一段文字，包含了一些重复的关键词：测试、分析、功能、内容、SEO、优化。

## 另一个二级标题

最后一段内容，确保我们有足够的文字来进行完整的SEO分析。这个测试应该能够检测到标题结构、关键词密度、字数统计等各种SEO指标。

文章应该有良好的结构和适当的长度，以便进行全面的SEO评估。`;

  const handleTest = React.useCallback(() => {
    try {
      console.log('🔍 开始SEO分析测试...');
      setShowSEO(true);
    } catch (error) {
      console.error('SEO测试启动失败:', error);
    }
  }, []);

  const handleClose = React.useCallback(() => {
    try {
      setShowSEO(false);
    } catch (error) {
      console.error('SEO测试关闭失败:', error);
    }
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTest}
        className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        🔍 测试SEO分析
      </motion.button>

      <SEOAnalyzer
        content={testContent}
        isOpen={showSEO}
        onClose={handleClose}
      />
    </>
  );
};

export default SEOTestButton;
