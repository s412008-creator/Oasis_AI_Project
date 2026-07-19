import { useEffect, useRef } from 'react';
import { TerminalSquare } from 'lucide-react';

export default function Terminal({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="mt-8 flex-1 flex flex-col min-h-[250px] glass-panel rounded-2xl overflow-hidden">
      <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
        <TerminalSquare className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono text-white/60">agent_execution.log</span>
      </div>
      <div className="flex-1 p-4 font-mono text-[11px] md:text-[13px] leading-relaxed text-white/70 overflow-y-auto space-y-1.5">
        {logs.length === 0 ? (
          <div className="text-white/30 italic">Waiting for agent invocation...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary/70 shrink-0">[{new Date().toLocaleTimeString()}]</span>
              <span className={log.includes("error") ? "text-red-400" : ""}>{log}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
