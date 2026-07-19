import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SURFACE = '#141410';
const BORDER  = '#252520';
const GOLD    = '#b8975a';
const CREAM   = '#e8e0ce';
const MUTED   = '#6b6454';
const BG      = '#0a0a08';

const AGENTS = {
  planner: {
    label: 'Planner Agent',
    desc: 'Decompose topic into sub-questions',
    gold: GOLD,
  },
  research: {
    label: 'Research Agent',
    desc: 'Parallel search and deep scraping',
    gold: '#8fa8a0',
  },
  critic: {
    label: 'Critic Agent',
    desc: 'Cross-verify sources, score confidence',
    gold: '#a09060',
  },
  writer: {
    label: 'Writer Agent',
    desc: 'Synthesize and structure final report',
    gold: '#7a9a80',
  },
};

const AGENT_ORDER = ['planner', 'research', 'critic', 'writer'];

export default function AgentWorkbench({ logs, activeAgent, done }) {
  const agentLogs = {};
  for (const key of AGENT_ORDER) agentLogs[key] = [];
  for (const log of logs) {
    if (log.agent && agentLogs[log.agent] !== undefined) {
      agentLogs[log.agent].push(log.msg);
    }
  }
  const activeIdx = AGENT_ORDER.indexOf(activeAgent);

  return (
    <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap' }}>
      {/* Left: Pipeline */}
      <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {AGENT_ORDER.map((key, idx) => {
          const agent = AGENTS[key];
          const isActive = key === activeAgent;
          const isDone = idx < activeIdx || (done && idx <= activeIdx);
          const isPending = !isActive && !isDone;

          return (
            <div key={key} style={{ position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  borderRadius: 12, padding: '12px 14px',
                  border: `1px solid ${isActive ? GOLD : isDone ? '#2a2820' : BORDER}`,
                  background: isActive ? 'rgba(184,151,90,0.06)' : SURFACE,
                  opacity: isPending ? 0.4 : 1,
                  transition: 'all 0.3s',
                  boxShadow: isActive ? `0 0 10px rgba(184,151,90,0.1)` : 'none',
                }}>
                {/* Active indicator */}
                {isActive && (
                  <span style={{ position: 'absolute', top: 12, right: 12 }}>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
                  </span>
                )}
                {isDone && !isActive && (
                  <CheckCircle style={{ position: 'absolute', top: 12, right: 12, width: 12, height: 12, color: '#6b9b6b' }} />
                )}
                <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? GOLD : isDone ? CREAM : MUTED, letterSpacing: '0.04em', marginBottom: 4 }}>
                  {agent.label}
                </div>
                <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.5 }}>{agent.desc}</div>
                {agentLogs[key].length > 0 && (
                  <div style={{ fontSize: 9, color: MUTED, fontFamily: 'monospace', marginTop: 6 }}>
                    {agentLogs[key].length} log entries
                  </div>
                )}
              </motion.div>
              {idx < AGENT_ORDER.length - 1 && (
                <div style={{ textAlign: 'center', fontSize: 10, color: BORDER, lineHeight: 1, margin: '1px 0' }}>|</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Log Stream */}
      <div style={{ flex: 1, minWidth: 300, background: BG, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 400 }}>
        {/* Terminal header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4a3520' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3a3a28' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2a4028' }} />
          <span style={{ fontSize: 10, color: MUTED, fontFamily: 'monospace', marginLeft: 8 }}>agent_execution.log</span>
          {activeAgent && !done && (
            <span style={{
              marginLeft: 'auto', fontSize: 9, fontFamily: 'monospace',
              padding: '2px 10px', borderRadius: 100,
              border: `1px solid rgba(184,151,90,0.3)`,
              background: 'rgba(184,151,90,0.06)',
              color: GOLD, letterSpacing: '0.08em',
            }}>
              {AGENTS[activeAgent]?.label?.toUpperCase()} — ACTIVE
            </span>
          )}
          {done && (
            <span style={{
              marginLeft: 'auto', fontSize: 9, fontFamily: 'monospace',
              padding: '2px 10px', borderRadius: 100,
              border: '1px solid rgba(107,155,107,0.3)',
              background: 'rgba(107,155,107,0.06)',
              color: '#6b9b6b', letterSpacing: '0.08em',
            }}>
              PIPELINE COMPLETE
            </span>
          )}
        </div>

        {/* Log Lines */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', fontFamily: 'monospace', fontSize: 11 }}>
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4, lineHeight: 1.6 }}>
                <span style={{ color: '#3a3530', flexShrink: 0, fontSize: 10 }}>
                  {new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                {log.agent && (
                  <span style={{
                    flexShrink: 0, fontSize: 9, padding: '1px 6px', borderRadius: 4,
                    border: '1px solid rgba(184,151,90,0.25)',
                    background: 'rgba(184,151,90,0.06)',
                    color: AGENTS[log.agent]?.gold || GOLD,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {log.agent}
                  </span>
                )}
                <span style={{ color: log.agent ? '#b0a88a' : MUTED, wordBreak: 'break-all' }}>{log.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!done && activeAgent && (
            <div style={{ display: 'flex', gap: 4, paddingTop: 4, paddingLeft: 120 }}>
              {[0, 1, 2].map(i => (
                <motion.span key={i} animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  style={{ width: 4, height: 4, borderRadius: '50%', background: MUTED, display: 'inline-block' }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
