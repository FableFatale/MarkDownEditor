import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Code } from 'mdast';

// Mermaid语言列表
const mermaidLanguages = [
  'mermaid',
  'mmd',
  'flowchart',
  'sequence',
  'sequenceDiagram',
  'gantt',
  'classDiagram',
  'stateDiagram',
  'journey',
  'gitgraph',
  'pie',
  'requirement',
  'er',
  'erDiagram'
];

// 检查是否为Mermaid代码块
const isMermaidCode = (language: string): boolean => {
  return mermaidLanguages.includes(language.toLowerCase());
};

// Remark插件：将Mermaid代码块转换为特殊的HTML节点
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    console.log('🚀 Remark Mermaid plugin is running...');
    console.log('🌳 AST tree:', JSON.stringify(tree, null, 2).substring(0, 500) + '...');

    let mermaidCount = 0;
    visit(tree, 'code', (node: Code, index, parent) => {
      console.log('🔍 Found code block:', {
        lang: node.lang,
        value: node.value?.substring(0, 50) + '...',
        index,
        hasParent: !!parent
      });

      if (!node.lang || !isMermaidCode(node.lang)) {
        console.log('❌ Not a Mermaid code block, skipping');
        return;
      }

      mermaidCount++;
      console.log(`🎯 Remark plugin detected Mermaid code #${mermaidCount}:`, node.lang);
      console.log('📝 Mermaid content length:', node.value?.length);

      // 确保代码内容存在且不为空
      if (!node.value || !node.value.trim()) {
        console.warn('⚠️ Empty Mermaid code block detected');
        return;
      }

      // 将Mermaid代码块转换为特殊的代码节点，保留原始语言标识
      const mermaidNode = {
        type: 'code',
        lang: 'mermaid-diagram',
        value: node.value.trim()
      };

      console.log('🔄 Converting to Mermaid node:', mermaidNode);

      // 替换原节点
      if (parent && typeof index === 'number') {
        parent.children[index] = mermaidNode as any;
        console.log('✅ Node replaced successfully at index', index);
      } else {
        console.error('❌ Failed to replace node: no parent or index');
      }
    });

    console.log(`📊 Total Mermaid blocks processed: ${mermaidCount}`);
  };
};

export default remarkMermaid;
