import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Mermaid from './Mermaid';

// Process inline text to add badges and highlights
function processHighlights(text) {
  if (!text) return text;
  return text
    // Replace [Fact] and [Prediction] with badges
    .replace(/\[Fact\]/gi, '<span class="inline-badge badge-fact">Fact</span>')
    .replace(/\[Prediction\]/gi, '<span class="inline-badge badge-prediction">Prediction</span>')
    // Replace citations like [1]
    .replace(/\[(\d+)\]/g, '<sup class="inline-citation">[$1]</sup>')
    // Highlight key metrics
    .replace(/\b(USD\s?\$?\d+(\.\d+)?\s?(billion|million|trillion|B|M|T)?|\d+(\.\d+)?%)\b/gi, '<span class="inline-metric">$&</span>');
}

export default function Report({ content }) {
  if (!content) return null;

  // Split content by "## " to separate sections
  const blocks = content.split(/(?=^## )/m).filter(b => b.trim().length > 0);

  const mdxComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match && match[1];
      
      if (!inline && lang === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }
      
      return !inline ? (
        <pre className="bg-black/50 border border-white/10 rounded-xl p-4 my-4 overflow-x-auto">
          <code className={className} {...props}>{children}</code>
        </pre>
      ) : (
        <code className="bg-white/10 text-[#b8975a] px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
      );
    }
  };

  return (
    <div className="report-container prose prose-invert max-w-none">
      {blocks.map((block, idx) => {
        // Apply inline highlights to the raw markdown block before rendering
        const processedBlock = processHighlights(block);

        if (block.startsWith('## Executive Summary')) {
          const contentWithoutHeader = processedBlock.replace(/^## Executive Summary/m, '');
          return (
            <div key={idx} className="executive-summary-card">
              <h2 className="section-title">Executive Summary</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdxComponents}>
                {contentWithoutHeader}
              </ReactMarkdown>
            </div>
          );
        }

        if (block.startsWith('## Key Findings')) {
          const contentWithoutHeader = processedBlock.replace(/^## Key Findings/m, '');
          return (
            <div key={idx} className="key-findings-section">
              <h2 className="section-title">Key Findings</h2>
              <div className="key-findings-grid">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    ...mdxComponents,
                    li: ({children}) => <li className="key-finding-card">{children}</li>,
                    ul: ({children}) => <ul className="key-finding-list">{children}</ul>
                  }}
                >
                  {contentWithoutHeader}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        // Default rendering for other sections (Deep Analysis, Timeline, etc.)
        return (
          <div key={idx} className="default-section-card">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdxComponents}>
              {processedBlock}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
