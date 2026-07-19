import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#8b5cf6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#7c3aed',
    lineColor: '#6d28d9',
    secondaryColor: '#3b82f6',
    tertiaryColor: '#1e40af'
  }
});

export default function Mermaid({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (chart && containerRef.current) {
      const renderChart = async () => {
        try {
          // Add a unique ID for the mermaid chart
          const id = `mermaid-${Math.round(Math.random() * 100000)}`;
          const { svg } = await mermaid.render(id, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid render failed:', error);
          containerRef.current.innerHTML = `<div class="text-red-400 text-sm">Failed to render mindmap. Invalid Mermaid syntax.</div>`;
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div ref={containerRef} className="flex justify-center my-8 p-4 glass-panel rounded-xl overflow-x-auto" />;
}
