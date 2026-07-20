"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, CheckCircle2, ChevronRight, ChevronLeft, Download, Terminal, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { streamAgentEndpoint } from '@/lib/api';

interface AgentLog {
  agent: string;
  msg: string;
  type?: 'agent_log' | 'agent_switch';
}

export default function MatchmakingBureau() {
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startOasis = async () => {
    if (!topic.trim()) {
      alert("Please describe your business.");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    setReport(null);
    setApiError(null);

    await streamAgentEndpoint('/api/matchmaking', { topic, section: '', question: '' }, (data) => {
      if (data.type === 'agent_switch') {
        setLogs(prev => [...prev, { agent: 'SYSTEM', msg: `--- Switched to ${data.agent} ---`, type: 'agent_switch' }]);
      } else if (data.type === 'agent_log') {
        setLogs(prev => [...prev, { agent: data.agent!, msg: data.msg!, type: 'agent_log' }]);
      } else if (data.type === 'result') {
        setReport(data.report!);
      } else if (data.type === 'error') {
        setApiError(data.msg || 'The AI backend returned an unknown error.');
      }
    });

    setIsLoading(false);
  };

  const getAgentColor = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('market')) return 'text-blue-400';
    if (name.includes('lead')) return 'text-emerald-400';
    if (name.includes('cultural')) return 'text-purple-400';
    if (name.includes('system')) return 'text-[#C6A87C]';
    return 'text-indigo-400';
  };

  const simulateDownload = () => {
    window.print();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB]">
        
        {/* Official Header */}
        <header className="bg-[#0F172A] text-white sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors p-2 -ml-2 rounded-md hover:bg-slate-800">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C6A87C]" />
                  B2B Matchmaking
                </h1>
              </div>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full uppercase tracking-wide border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Agentic Session
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Partner Search</h2>
              <p className="text-slate-600">
                Describe your ideal local partner. Our agents will scan registries and generate introductions.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ideal Partner Profile</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all min-h-[200px]"
                    placeholder="e.g. We are looking for a local logistics distributor in Dubai with a fleet of over 50 trucks..."
                  />
                </div>
              </div>

              <button
                onClick={startOasis}
                disabled={isLoading}
                className="mt-8 w-full py-4 bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Scanning via Agents...
                  </>
                ) : (
                  <>
                    Find Partners <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Terminal */}
          <div className="w-full lg:w-7/12 flex flex-col">
            <div className="bg-[#0F172A] rounded-xl shadow-xl border border-slate-700 overflow-hidden flex-1 flex flex-col min-h-[500px]">
              
              {/* Terminal Header */}
              <div className="bg-[#1e293b] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  CrewAI Core Orchestrator
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed space-y-3 bg-[#0F172A]">
                {logs.length === 0 && !apiError && !isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <ShieldCheck className="w-12 h-12 text-slate-700" />
                    <p>Awaiting profile submission to launch autonomous agents...</p>
                  </div>
                )}

                {apiError && (
                  <div className="h-full flex flex-col items-center justify-center text-red-400 space-y-4 text-center px-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <h3 className="font-bold text-lg">Backend Unreachable</h3>
                    <p className="text-sm opacity-80 whitespace-pre-wrap">{apiError}</p>
                  </div>
                )}

                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 ${log.type === 'agent_switch' ? 'mt-6 mb-2' : ''}`}
                    >
                      <span className={`font-bold shrink-0 ${getAgentColor(log.agent)}`}>
                        {log.type === 'agent_switch' ? '' : `[${log.agent}]`}
                      </span>
                      <span className={log.type === 'agent_switch' ? 'text-slate-500 font-bold' : 'text-slate-300'}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

        </main>

        <AnimatePresence>
          {report && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full"
            >
              <div className="bg-white rounded-xl shadow-xl border border-[#C6A87C] overflow-hidden">
                <div className="bg-[#0F172A] px-8 py-5 border-b border-[#C6A87C]/30 flex justify-between items-center print:bg-white print:border-b-2 print:border-black">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-bold text-white print:text-black">Official Matchmaking Report Generated</h3>
                  </div>
                  <button 
                    onClick={simulateDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-[#C6A87C] font-bold rounded-lg transition-colors shadow-sm print:hidden"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
                <div className="p-8 prose prose-slate max-w-none text-[#0F172A]">
                  <div dangerouslySetInnerHTML={{ __html: report }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
