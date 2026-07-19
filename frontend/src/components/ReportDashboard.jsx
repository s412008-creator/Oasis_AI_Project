import { useState } from 'react';
import Report from './Report';
import Mermaid from './Mermaid';
import CanvasMindMap from './CanvasMindMap';
import AgentWorkbench from './AgentWorkbench';
import { FileText, Network, BookOpen, ExternalLink, Terminal } from 'lucide-react';

const SURFACE = '#141410';
const BORDER  = '#252520';
const GOLD    = '#b8975a';
const CREAM   = '#e8e0ce';
const MUTED   = '#6b6454';
const BG      = '#0a0a08';

function extractMermaidBlocks(md) {
  if (!md) return [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  const blocks = [];
  let m;
  while ((m = regex.exec(md)) !== null) blocks.push(m[1].trim());
  return blocks;
}

function cleanReport(md) {
  return md ? md.replace(/```mermaid[\s\S]*?```/g, '').trim() : '';
}

function buildMindMapFromSources(topic, sources) {
  const groups = {};
  for (const s of (sources || [])) {
    const tag = (s.tags && s.tags[0]) || "General";
    if (!groups[tag]) groups[tag] = [];
    if (groups[tag].length < 4) {
      groups[tag].push((s.title || s.url || "").slice(0, 28));
    }
  }
  const branches = Object.entries(groups).slice(0, 5).map(([label, children]) => ({
    label, children,
  }));
  return { center: topic || "Research Topic", branches };
}

function ConfidenceBar({ value }) {
  const pct = Math.round((value || 0) * 100);
  const color = pct >= 75 ? '#6b9b6b' : pct >= 50 ? GOLD : '#9b6b6b';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 2, background: BORDER, borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 1, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: 10, color: MUTED, fontFamily: 'monospace', width: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

const TABS = [
  { key: 'overview',  label: 'Overview',       icon: FileText },
  { key: 'mindmap',   label: 'Concept Map',    icon: Network },
  { key: 'timeline',  label: 'Timeline',       icon: BookOpen },
  { key: 'sources',   label: 'Sources',        icon: ExternalLink },
  { key: 'reasoning', label: 'Agent Log',      icon: Terminal },
];

export default function ReportDashboard({ report, logs, sources = [], topic = '' }) {
  const [activeTab, setActiveTab] = useState('overview');

  const blocks = extractMermaidBlocks(report);
  const mindmapBlock = blocks.find(b => b.startsWith('mindmap'));
  const ganttBlock   = blocks.find(b => b.startsWith('gantt'));
  const cleanedReport = cleanReport(report);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${BORDER}`, paddingBottom: 12, overflowX: 'auto' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 8,
                border: `1px solid ${isActive ? GOLD : 'transparent'}`,
                background: isActive ? 'rgba(184,151,90,0.08)' : 'transparent',
                color: isActive ? GOLD : MUTED,
                fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia, serif',
                transition: 'all 0.18s', whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}>
              <Icon style={{ width: 13, height: 13 }} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '32px', minHeight: 500 }}>
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up" style={{ color: CREAM }}>
            <Report content={cleanedReport} />
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div className="animate-fade-in-up">
            <div style={{ background: BG, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <CanvasMindMap data={buildMindMapFromSources(topic, sources)} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: MUTED }}>
              Scroll to zoom. Click and drag to pan.
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="animate-fade-in-up">
            {ganttBlock ? (
              <div style={{ background: BG, borderRadius: 12, border: `1px solid ${BORDER}`, padding: 16, overflowX: 'auto' }}>
                <Mermaid chart={ganttBlock} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED, fontSize: 13 }}>
                No timeline generated for this report.
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="animate-fade-in-up">
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 20 }}>
              {sources.length} VERIFIED SOURCES — CONFIDENCE SCORES
            </div>
            {sources.length > 0 ? sources.map((s, i) => (
              <div key={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 18px', marginBottom: 10, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: CREAM, textDecoration: 'none', flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = CREAM}>
                    <ExternalLink style={{ width: 12, height: 12, flexShrink: 0, color: MUTED }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || s.url}</span>
                  </a>
                  {s.is_stale && (
                    <span style={{ flexShrink: 0, fontSize: 9, padding: '2px 8px', borderRadius: 100, border: `1px solid rgba(184,151,90,0.3)`, color: GOLD, fontFamily: 'monospace' }}>
                      POSSIBLY STALE
                    </span>
                  )}
                </div>
                <ConfidenceBar value={s.confidence} />
                {s.tags && s.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {s.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, border: `1px solid ${BORDER}`, color: MUTED, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )) : <p style={{ fontSize: 13, color: MUTED }}>No source details available.</p>}
          </div>
        )}

        {activeTab === 'reasoning' && (
          <div className="animate-fade-in-up" style={{ minHeight: 500 }}>
            <AgentWorkbench logs={logs} activeAgent={null} done={true} />
          </div>
        )}
      </div>
    </div>
  );
}
