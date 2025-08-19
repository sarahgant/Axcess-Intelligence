import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // You can change this theme

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className = ''
}) => {
    return (
        <div className={`markdown-content ${className}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
          .markdown-content h1,
          .markdown-content h2,
          .markdown-content h3,
          .markdown-content h4,
          .markdown-content h5,
          .markdown-content h6 {
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            line-height: 1.4;
          }
          
          .markdown-content h1 { font-size: 1.5rem; }
          .markdown-content h2 { font-size: 1.3rem; }
          .markdown-content h3 { font-size: 1.1rem; }
          .markdown-content h4 { font-size: 1rem; }
          
          .markdown-content p {
            margin: 0.5rem 0;
            line-height: 1.6;
          }
          
          .markdown-content ul,
          .markdown-content ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
          }
          
          .markdown-content li {
            margin: 0.25rem 0;
            line-height: 1.5;
          }
          
          .markdown-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #6b7280;
            font-style: italic;
          }
          
          .markdown-content code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-family: 'Courier New', monospace;
            color: #374151;
          }
          
          .markdown-content pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
          }
          
          .markdown-content pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
          }
          
          .markdown-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          
          .markdown-content th,
          .markdown-content td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
            text-align: left;
          }
          
          .markdown-content th {
            background-color: #f9fafb;
            font-weight: 600;
          }
          
          .markdown-content a {
            color: #3b82f6;
            text-decoration: underline;
          }
          
          .markdown-content a:hover {
            color: #1d4ed8;
          }
          
          .markdown-content strong {
            font-weight: 600;
          }
          
          .markdown-content em {
            font-style: italic;
          }
          
          .markdown-content hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 1.5rem 0;
          }
        `
            }} />

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Custom component overrides if needed
                    h1: ({ children }) => <h1 className="text-xl font-semibold mb-2 mt-4 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-3 text-gray-600 italic">
                            {children}
                        </blockquote>
                    ),
                    code: ({ inline, children }) => {
                        if (inline) {
                            return (
                                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="block bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-3 overflow-x-auto">
                            {children}
                        </pre>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
