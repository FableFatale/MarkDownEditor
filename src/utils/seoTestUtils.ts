// SEO分析功能测试工具
export const testSEOAnalyzer = () => {
  console.log('🔍 开始测试SEO分析功能...');

  // 测试内容
  const testContent = `# 这是一个测试标题

这是一段测试描述，用来验证SEO分析功能是否正常工作。这段文字包含了足够的内容来进行关键词分析和可读性评估。

## 二级标题

这里是更多的内容。我们需要确保文章有足够的字数来通过SEO检查。

### 三级标题

- 列表项目一
- 列表项目二
- 列表项目三

这是另一段文字，包含了一些重复的关键词：测试、分析、功能、内容。

## 另一个二级标题

最后一段内容，确保我们有足够的文字来进行完整的SEO分析。这个测试应该能够检测到标题结构、关键词密度、字数统计等各种SEO指标。`;

  try {
    // 基础统计测试
    const words = testContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const characterCount = testContent.length;
    
    console.log('📊 基础统计:');
    console.log(`- 字数: ${wordCount}`);
    console.log(`- 字符数: ${characterCount}`);
    console.log(`- 预估阅读时间: ${Math.ceil(wordCount / 200)}分钟`);

    // 标题结构测试
    const headingMatches = testContent.match(/^#{1,6}\s+.+$/gm) || [];
    const headingCount: { [key: string]: number } = {};
    headingMatches.forEach(heading => {
      const level = heading.match(/^#+/)?.[0].length || 0;
      const key = `H${level}`;
      headingCount[key] = (headingCount[key] || 0) + 1;
    });

    console.log('📝 标题结构:');
    Object.entries(headingCount).forEach(([level, count]) => {
      console.log(`- ${level}: ${count}个`);
    });

    // 关键词提取测试
    const cleanText = testContent.toLowerCase().replace(/[^\w\s\u4e00-\u9fff]/g, ' ');
    const allWords = cleanText.split(/\s+/).filter(word => word.length > 2);
    
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '他', '她', '它', '我们', '你们', '他们'
    ]);

    const wordFreq: { [key: string]: number } = {};
    allWords.forEach(word => {
      if (!stopWords.has(word) && word.length > 1) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / allWords.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    console.log('🔑 关键词分析:');
    keywords.forEach((keyword, index) => {
      console.log(`${index + 1}. "${keyword.word}" - 出现${keyword.count}次 (密度: ${keyword.density.toFixed(1)}%)`);
    });

    // 元数据提取测试
    const lines = testContent.split('\n');
    const firstHeading = lines.find(line => line.match(/^#\s+/));
    const title = firstHeading?.replace(/^#\s+/, '').trim();
    
    const firstParagraph = lines.find(line => 
      line.trim().length > 0 && 
      !line.match(/^#+\s/) && 
      !line.match(/^[-*+]\s/) &&
      !line.match(/^\d+\.\s/)
    );

    console.log('📋 元数据:');
    console.log(`- 标题: ${title || '未找到'}`);
    console.log(`- 描述: ${firstParagraph?.trim().substring(0, 160) || '未找到'}`);

    // 可读性评分测试
    const sentences = testContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = wordCount / sentences;
    
    console.log('📖 可读性分析:');
    console.log(`- 句子数: ${sentences}`);
    console.log(`- 平均句长: ${avgWordsPerSentence.toFixed(1)}词/句`);

    // SEO建议生成测试
    const suggestions = [];
    
    if (wordCount < 300) {
      suggestions.push('⚠️ 文章字数较少，建议增加到300字以上');
    }
    
    if (!headingCount.H1) {
      suggestions.push('❌ 缺少主标题（H1）');
    } else if (headingCount.H1 > 1) {
      suggestions.push('⚠️ 有多个主标题（H1），建议只使用一个');
    }

    if (!title) {
      suggestions.push('❌ 缺少标题');
    } else if (title.length > 60) {
      suggestions.push('⚠️ 标题过长，建议控制在60字符以内');
    }

    console.log('💡 SEO建议:');
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        console.log(`- ${suggestion}`);
      });
    } else {
      console.log('✅ SEO优化良好，暂无建议');
    }

    console.log('✅ SEO分析功能测试完成！');
    return true;

  } catch (error) {
    console.error('❌ SEO分析功能测试失败:', error);
    return false;
  }
};

// 在开发环境下自动运行测试
if (process.env.NODE_ENV === 'development') {
  // 延迟执行，确保模块加载完成
  setTimeout(() => {
    testSEOAnalyzer();
  }, 1000);
}
