import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Cpu, Globe, Layers } from 'lucide-react';

const BG     = '#000000';
const SURFACE= '#141410';
const BORDER = '#252520';
const GOLD   = '#b8975a';
const CREAM  = '#e8e0ce';
const MUTED  = '#6b6454';

const MODELS = [
  { value: 'gemini-2.5-flash',    label: 'Gemini 2.5 Flash (Recommended)' },
  { value: 'gemini-2.5-pro',      label: 'Gemini 2.5 Pro (Slower, higher quality)' },
  { value: 'gemini-1.5-flash',    label: 'Gemini 1.5 Flash (Fastest)' },
];

const LANGUAGES = ['English', 'Traditional Chinese', 'Japanese', 'Spanish'];

export default function SettingsDrawer({ open, onClose, settings, onSave }) {
  const [local, setLocal] = useState(settings);
  const set = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  const labelStyle = { fontSize: 11, color: MUTED, letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 6 };
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: '#0a0a08', border: `1px solid ${BORDER}`,
    borderRadius: 8, padding: '10px 14px',
    fontSize: 13, color: CREAM, outline: 'none',
    fontFamily: 'Georgia, serif', transition: 'border-color 0.2s',
  };
  const sectionStyle = { marginBottom: 28 };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(4px)' }} />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
              background: SURFACE, borderLeft: `1px solid ${BORDER}`,
              zIndex: 101, display: 'flex', flexDirection: 'column',
              fontFamily: 'Georgia, serif',
            }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontSize: 15, color: CREAM, fontWeight: 500 }}>Settings</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: 'monospace', marginTop: 2 }}>Configure your research environment</div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: 4 }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

              {/* API Keys */}
              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <Key style={{ width: 13, height: 13, color: GOLD }} />
                  <span style={{ fontSize: 12, color: CREAM, letterSpacing: '0.05em' }}>API Keys</span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={labelStyle}>GOOGLE GEMINI API KEY</div>
                  <input
                    type="password"
                    placeholder="AIza..."
                    value={local.geminiKey}
                    onChange={e => set('geminiKey', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>
                    Override server key. Leave blank to use default.
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>TAVILY SEARCH API KEY</div>
                  <input
                    type="password"
                    placeholder="tvly-..."
                    value={local.tavilyKey}
                    onChange={e => set('tavilyKey', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </div>
              </div>

              {/* Model */}
              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <Cpu style={{ width: 13, height: 13, color: GOLD }} />
                  <span style={{ fontSize: 12, color: CREAM, letterSpacing: '0.05em' }}>Model Selection</span>
                </div>
                {MODELS.map(m => (
                  <label key={m.value} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: `1px solid ${local.model === m.value ? GOLD : BORDER}`,
                      background: local.model === m.value ? GOLD : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0,
                    }}
                      onClick={() => set('model', m.value)}>
                      {local.model === m.value && <div style={{ width: 5, height: 5, borderRadius: '50%', background: BG }} />}
                    </div>
                    <span style={{ fontSize: 12, color: local.model === m.value ? CREAM : MUTED, transition: 'color 0.15s' }}>{m.label}</span>
                  </label>
                ))}
              </div>

              {/* Output Language */}
              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <Globe style={{ width: 13, height: 13, color: GOLD }} />
                  <span style={{ fontSize: 12, color: CREAM, letterSpacing: '0.05em' }}>Output Language</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => set('language', lang)}
                      style={{
                        padding: '8px 12px', borderRadius: 8,
                        border: `1px solid ${local.language === lang ? GOLD : BORDER}`,
                        background: local.language === lang ? 'rgba(184,151,90,0.1)' : 'transparent',
                        color: local.language === lang ? CREAM : MUTED,
                        fontSize: 12, cursor: 'pointer', fontFamily: 'Georgia, serif',
                        transition: 'all 0.15s',
                      }}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Sources */}
              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <Layers style={{ width: 13, height: 13, color: GOLD }} />
                  <span style={{ fontSize: 12, color: CREAM, letterSpacing: '0.05em' }}>Research Depth</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>Max sources per search</span>
                  <span style={{ fontSize: 12, color: GOLD, fontFamily: 'monospace' }}>{local.maxSources}</span>
                </div>
                <input type="range" min={2} max={10} step={1} value={local.maxSources}
                  onChange={e => set('maxSources', Number(e.target.value))}
                  style={{ width: '100%', accentColor: GOLD, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUTED, fontFamily: 'monospace', marginTop: 4 }}>
                  <span>2 (Fast)</span><span>10 (Thorough)</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 10 }}>
              <button onClick={onClose}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${BORDER}`, background: 'transparent', color: MUTED, fontSize: 13, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                Cancel
              </button>
              <button onClick={() => onSave(local)}
                style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: GOLD, color: BG, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}>
                Save Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
