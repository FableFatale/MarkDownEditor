import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { motion } from 'framer-motion';
import { createCustomHeadingRenderer, HeadingStyleType } from './CustomHeadingStyles';
import { MermaidDiagram } from './MermaidDiagram';
import AnimatedImageRenderer from './AnimatedImageRenderer';

// 导入样式
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

interface TailwindMarkdownPreviewProps {
  content: string;
  headingStyle?: HeadingStyleType;
  className?: string;
  isDark?: boolean;
}

// 自定义代码块组件
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // 如果是Mermaid图表
  if (language === 'mermaid') {
    return (
      <div className="my-4">
        <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
      </div>
    );
  }

  return !inline && match ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <pre
        className={`
          bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto
          border border-gray-200 dark:border-gray-700
          ${className}
        `}
        {...props}
      >
        <code className={`language-${language} text-sm`}>
          {children}
        </code>
      </pre>
      {/* 语言标签 */}
      {language && (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {language}
        </span>
      )}
    </motion.div>
  ) : (
    <code
      className={`
        px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
        rounded text-sm font-mono border border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      {children}
    </code>
  );
};

// 自定义表格组件
const Table = ({ children, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="overflow-x-auto my-4"
  >
    <table
      className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      {...props}
    >
      {children}
    </table>
  </motion.div>
);

// 自定义表格头组件
const TableHead = ({ children, ...props }: any) => (
  <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
    {children}
  </thead>
);

// 自定义表格行组件
const TableRow = ({ children, ...props }: any) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props}>
    {children}
  </tr>
);

// 自定义表格单元格组件
const TableCell = ({ children, ...props }: any) => (
  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100" {...props}>
    {children}
  </td>
);

// 自定义表格头单元格组件
const TableHeaderCell = ({ children, ...props }: any) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
    {children}
  </th>
);

// 自定义引用块组件
const Blockquote = ({ children, ...props }: any) => (
  <motion.blockquote
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic"
    {...props}
  >
    {children}
  </motion.blockquote>
);

// 自定义列表组件
const List = ({ ordered, children, ...props }: any) => {
  const Component = ordered ? 'ol' : 'ul';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Component
        className={`
          my-4 space-y-2
          ${ordered 
            ? 'list-decimal list-inside' 
            : 'list-disc list-inside'
          }
          text-gray-900 dark:text-gray-100
        `}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};

// 自定义列表项组件
const ListItem = ({ children, ...props }: any) => (
  <li className="text-gray-900 dark:text-gray-100 leading-relaxed" {...props}>
    {children}
  </li>
);

// 自定义链接组件
const Link = ({ children, href, ...props }: any) => (
  <motion.a
    whileHover={{ scale: 1.02 }}
    href={href}
    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    {children}
  </motion.a>
);

// 自定义图片组件 - 支持动图
const Image = ({ src, alt, ...props }: any) => {
  // 检测是否可能是动图
  const isPotentiallyAnimated = src && (
    src.toLowerCase().includes('.webp') ||
    src.toLowerCase().includes('.apng') ||
    src.toLowerCase().includes('.gif')
  );

  if (isPotentiallyAnimated) {
    return (
      <div className="my-4">
        <AnimatedImageRenderer
          src={src}
          alt={alt}
          autoPlay={true}
          showControls={true}
          maxHeight="500px"
          {...props}
        />
      </div>
    );
  }

  // 静态图片的原有处理
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-4"
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
          {alt}
        </p>
      )}
    </motion.div>
  );
};

// 自定义段落组件
const Paragraph = ({ children, ...props }: any) => (
  <motion.p
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 leading-relaxed text-gray-900 dark:text-gray-100"
    {...props}
  >
    {children}
  </motion.p>
);

// 自定义分隔线组件
const HorizontalRule = (props: any) => (
  <motion.hr
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
    {...props}
  />
);

const TailwindMarkdownPreview: React.FC<TailwindMarkdownPreviewProps> = ({
  content,
  headingStyle = 'default',
  className = '',
  isDark = false,
}) => {
  // 使用 useMemo 优化自定义渲染器，避免不必要的重新渲染
  const customRenderers = React.useMemo(() => ({
    ...createCustomHeadingRenderer(headingStyle),
    code: CodeBlock,
    table: Table,
    thead: TableHead,
    tbody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    tr: TableRow,
    td: TableCell,
    th: TableHeaderCell,
    blockquote: Blockquote,
    ul: (props: any) => <List ordered={false} {...props} />,
    ol: (props: any) => <List ordered={true} {...props} />,
    li: ListItem,
    a: Link,
    img: Image,
    p: Paragraph,
    hr: HorizontalRule,
  }), [headingStyle]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        prose prose-lg max-w-none
        ${isDark ? 'prose-invert' : ''}
        prose-headings:scroll-mt-20
        prose-pre:bg-transparent prose-pre:p-0
        prose-code:bg-transparent prose-code:p-0
        prose-code:before:content-none prose-code:after:content-none
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSlug]}
        components={customRenderers}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

export default TailwindMarkdownPreview;
