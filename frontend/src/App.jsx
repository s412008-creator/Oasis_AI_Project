import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentWorkbench from './components/AgentWorkbench';
import ReportDashboard from './components/ReportDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import SettingsDrawer from './components/SettingsDrawer';
import { exportToPDF } from './lib/pdfExport';
import {
  Download, Search, Settings, GitBranch,
  ArrowRight, PieChart, FileText, Share2, Loader, RotateCcw
} from 'lucide-react';

const BG     = '#0d0d0b';
const SURFACE= '#141410';
const BORDER = '#252520';
const GOLD   = '#b8975a';
const CREAM  = '#e8e0ce';
const MUTED  = '#6b6454';

const FEATURES = [
  { icon: <Search style={{color: GOLD}} className="w-4 h-4" />, title: "4-Agent Pipeline", desc: "Planner, Research, Critic, Writer agents collaborate in sequence — each step logged in real time." },
  { icon: <PieChart style={{color: GOLD}} className="w-4 h-4" />, title: "Source Verification", desc: "Critic Agent cross-checks every source, scoring confidence and flagging stale data." },
  { icon: <FileText style={{color: GOLD}} className="w-4 h-4" />, title: "Structured Reports", desc: "Inline citations, concept maps, technology timelines, and comparison tables." },
  { icon: <Share2 style={{color: GOLD}} className="w-4 h-4" />, title: "Follow-up Q&A", desc: "Ask deeper questions on any section — the agent re-researches only that part." },
];

const EXAMPLES = ["EV Battery Tech 2026", "GenAI Market Trends", "Quantum Computing", "Clean Energy", "AI Chips Landscape"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
};

// Default settings stored in localStorage
const DEFAULT_SETTINGS = {
  geminiKey: '',
  tavilyKey: '',
  model: 'gemini-2.5-flash',
  maxSources: 6,
  language: 'English',
};

function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('dr_settings') || '{}') };
  } catch { return DEFAULT_SETTINGS; }
}

export default function App() {
  const [topic, setTopic]           = useState('');
  const [logs, setLogs]             = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [report, setReport]         = useState(null);
  const [sources, setSources]       = useState([]);
  const [mindmap, setMindmap]       = useState(null);
  const [state, setState]           = useState('idle');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings]     = useState(getSettings());
  const readerRef = useRef(null);

  const reset = () => {
    if (readerRef.current) { readerRef.current.cancel(); readerRef.current = null; }
    setTopic(''); setLogs([]); setActiveAgent(null);
    setReport(null); setSources([]); setMindmap(null); setState('idle');
  };

  const handleSearch = async (eOrTopic) => {
    if (eOrTopic?.preventDefault) eOrTopic.preventDefault();
    const query = typeof eOrTopic === 'string' ? eOrTopic : topic;
    if (!query.trim()) return;

    setTopic(query);
    setState('searching');
    setLogs([{ agent: 'planner', msg: `Initializing Deep Research AI v2.1 — topic: "${query}"` }]);
    setActiveAgent('planner');
    setReport(null); setSources([]); setMindmap(null);

    try {
      const apiBase = 'https://deep-research-ai-api-production.up.railway.app';
      const response = await fetch(`${apiBase}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query.trim() }),
      });

      if (!response.body) throw new Error("ReadableStream not supported.");
      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') { done = true; break; }
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'agent_switch') setActiveAgent(data.agent);
              else if (data.type === 'agent_log') setLogs(prev => [...prev, { agent: data.agent, msg: data.msg }]);
              else if (data.type === 'result') {
                setReport(data.report);
                setSources(data.sources || []);
                if (data.mindmap) setMindmap(data.mindmap);
                setActiveAgent(null);
                setState('done');
              } else if (data.type === 'error') {
                setLogs(prev => [...prev, { agent: null, msg: `[ERROR] ${data.msg}` }]);
                setState('error');
              }
            } catch (e) { console.error(e); }
          }
        }
      }
    } catch (err) {
      setLogs(prev => [...prev, { agent: null, msg: `[ERROR] ${err.message}` }]);
      setState('error');
    }
  };

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const navBtn = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '8px',
    border: `1px solid ${BORDER}`, background: 'transparent',
    fontSize: '12px', fontFamily: 'Georgia, serif',
    color: MUTED, cursor: 'pointer', transition: 'all 0.2s',
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: CREAM, fontFamily: 'Georgia, serif', overflowX: 'hidden' }}>
      <AnimatedBackground />

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={(s) => { setSettings(s); localStorage.setItem('dr_settings', JSON.stringify(s)); setSettingsOpen(false); }}
      />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: `1px solid ${BORDER}`,
        background: `${BG}cc`,
        backdropFilter: 'blur(16px)',
      }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={reset}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            border: `1px solid ${BORDER}`,
            background: `${SURFACE}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 12px rgba(184,151,90,0.12)`,
            position: 'relative', overflow: 'hidden',
          }}>
            <Loader style={{ color: GOLD, width: 14, height: 14 }} className="animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: CREAM, letterSpacing: '0.06em' }}>Research Agent</div>
            <div style={{ fontSize: '9px', color: GOLD, fontFamily: 'monospace', letterSpacing: '0.1em' }}>CLICK TO RESET</div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ color: CREAM, borderColor: GOLD }} style={navBtn}
            onClick={() => setSettingsOpen(true)}>
            <Settings style={{ width: 13, height: 13 }} /> Settings
          </motion.button>
          <motion.button whileHover={{ color: CREAM, borderColor: GOLD }} style={navBtn}
            onClick={() => window.open('https://github.com', '_blank')}>
            <GitBranch style={{ width: 13, height: 13 }} /> GitHub
          </motion.button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">

          {/* HERO */}
          {state === 'idle' && (
            <motion.div key="hero" variants={containerVariants} initial="hidden" animate="show" exit="exit"
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

              <motion.div variants={itemVariants} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 18px', borderRadius: 100,
                border: `1px solid ${BORDER}`,
                background: `rgba(184,151,90,0.06)`,
                fontSize: 11, color: GOLD, letterSpacing: '0.12em',
                fontFamily: 'monospace', marginBottom: 36,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, opacity: 0.8, display: 'inline-block' }} />
                POWERED BY GEMINI 2.5 + TAVILY SEARCH
              </motion.div>

              <motion.h1 variants={itemVariants} style={{
                fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 400,
                lineHeight: 1.12, marginBottom: 24, letterSpacing: '-0.02em',
                color: CREAM,
              }}>
                AI-Powered<br />
                <span style={{
                  background: `linear-gradient(120deg, ${GOLD}, #c4a86a, #a07840)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Deep Research
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} style={{ color: MUTED, fontSize: 15, maxWidth: 560, lineHeight: 1.75, marginBottom: 48 }}>
                Enter any topic. A 4-agent autonomous pipeline plans, searches, verifies, and writes a comprehensive structured report — with citations, concept maps, and timelines.
              </motion.p>

              {/* Search Bar */}
              <motion.form variants={itemVariants} onSubmit={handleSearch}
                style={{ width: '100%', maxWidth: 680, position: 'relative', marginBottom: 20 }}>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., Electric vehicle battery technology trends 2026"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 14, padding: '16px 180px 16px 22px',
                    fontSize: 14, color: CREAM, outline: 'none',
                    fontFamily: 'Georgia, serif',
                    boxShadow: `0 0 0 0 transparent`,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 1px rgba(184,151,90,0.2)`; }}
                  onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = 'none'; }}
                />
                <motion.button type="submit" disabled={!topic.trim()}
                  whileHover={{ background: '#c4a86a' }}
                  style={{
                    position: 'absolute', right: 8, top: 8, bottom: 8,
                    padding: '0 24px', borderRadius: 10,
                    background: GOLD, border: 'none',
                    color: '#0d0d0b', fontSize: 13, fontFamily: 'Georgia, serif',
                    fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em',
                    display: 'flex', alignItems: 'center', gap: 6,
                    opacity: topic.trim() ? 1 : 0.4,
                  }}>
                  <ArrowRight style={{ width: 14, height: 14 }} /> Begin
                </motion.button>
              </motion.form>

              {/* Examples */}
              <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 80 }}>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: '0.08em', fontFamily: 'monospace' }}>SUGGESTED TOPICS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                  {EXAMPLES.map(ex => (
                    <motion.button key={ex} whileHover={{ borderColor: GOLD, color: CREAM }}
                      onClick={() => handleSearch(ex)} type="button"
                      style={{
                        padding: '6px 18px', borderRadius: 100,
                        border: `1px solid ${BORDER}`, background: 'transparent',
                        fontSize: 12, color: MUTED, cursor: 'pointer',
                        fontFamily: 'Georgia, serif', transition: 'all 0.2s',
                      }}>
                      {ex}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Feature Cards */}
              <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: '100%' }}>
                {FEATURES.map((f, i) => (
                  <motion.div key={i} variants={itemVariants} whileHover={{ y: -4, borderColor: GOLD }}
                    style={{
                      background: SURFACE, border: `1px solid ${BORDER}`,
                      borderRadius: 16, padding: '24px 22px',
                      textAlign: 'left', cursor: 'default', transition: 'all 0.25s',
                    }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      border: `1px solid ${BORDER}`, background: `rgba(184,151,90,0.06)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                    }}>
                      {f.icon}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: CREAM, marginBottom: 8, letterSpacing: '0.02em' }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>{f.desc}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* SEARCHING */}
          {state === 'searching' && (
            <motion.div key="searching" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <Loader style={{ color: GOLD, width: 20, height: 20 }} className="animate-spin" />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 400, color: CREAM }}>Researching: {topic}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2, fontFamily: 'monospace' }}>4-agent pipeline running autonomously</div>
                </div>
              </div>
              <AgentWorkbench
                topic={topic}
                logs={logs}
                activeAgent={activeAgent}
                done={state === 'done'}
                report={report}
                sources={sources}
                mindmap={mindmap}
              />
            </motion.div>
          )}

          {/* DONE */}
          {state === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 400, color: CREAM, marginBottom: 6 }}>{topic}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: MUTED, fontFamily: 'monospace' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6b9b6b', display: 'inline-block' }} />
                    Research complete — {sources.length} verified sources
                  </div>
                </div>
                <motion.button whileHover={{ borderColor: GOLD, color: CREAM }}
                  onClick={() => exportToPDF('report-container', `${topic}.pdf`)}
                  style={{ ...navBtn, padding: '8px 18px', fontSize: 13 }}>
                  <Download style={{ width: 13, height: 13 }} /> Export PDF
                </motion.button>
              </div>
              <div id="report-container">
                <ReportDashboard report={report} logs={logs} sources={sources} topic={topic} />
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {state === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', paddingTop: 80, maxWidth: 600 }}>
              <div style={{ fontSize: 22, color: CREAM, marginBottom: 16 }}>An Error Occurred</div>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'monospace', background: SURFACE, padding: 20, borderRadius: 12, border: `1px solid ${BORDER}`, marginBottom: 24, wordBreak: 'break-all' }}>
                {logs[logs.length - 1]?.msg}
              </div>
              <motion.button whileHover={{ borderColor: GOLD }} onClick={reset}
                style={{ ...navBtn, margin: '0 auto', padding: '10px 24px', fontSize: 13 }}>
                Go Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
