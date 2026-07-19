import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid';

export default function Report({ content }) {
  if (!content) return null;

  return (
    <div className="prose prose-invert prose-p:text-white/80 prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match && match[1];
            
            // Auto-render Mermaid blocks
            if (!inline && lang === 'mermaid') {
              return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            
            return !inline ? (
              <pre className="bg-black/50 border border-white/10 rounded-xl p-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-white/10 text-primary-300 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
