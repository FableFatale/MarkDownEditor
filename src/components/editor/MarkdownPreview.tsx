import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = ({ content, className = '' }: MarkdownPreviewProps) => {
  return (
    <div className={`prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-500 hover:text-blue-600 underline" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props} />
            ) : (
              <code className="block bg-gray-100 dark:bg-gray-800 rounded p-4 my-4" {...props} />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};