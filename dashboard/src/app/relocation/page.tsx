"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, ChevronRight, Building2, ChevronLeft, Download, Terminal, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { streamAgentEndpoint } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';


interface AgentLog {
  agent: string;
  msg: string;
  type?: 'agent_log' | 'agent_switch';
}

export default function SmartRelocationConcierge() {
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [revenue, setRevenue] = useState('');
  const [market, setMarket] = useState('');
  
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startOasis = async () => {
    if (!industry || !teamSize || !revenue || !market) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    setReport(null);
    setApiError(null);

    // Construct the actual topic from the structured form
    const topic = `Industry: ${industry}. Team Size: ${teamSize}. Expected Revenue: ${revenue}. Target Market: ${market}. Please provide a full relocation and setup analysis for Dubai.`;

    await streamAgentEndpoint('/api/relocation', { topic, section: '', question: '' }, (data) => {
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
    if (name.includes('setup')) return 'text-emerald-400';
    if (name.includes('finance')) return 'text-yellow-400';
    if (name.includes('system')) return 'text-[#C6A87C]';
    return 'text-purple-400';
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
                <Building2 className="w-5 h-5 text-[#C6A87C]" />
                Smart Relocation Concierge
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
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Company Profile</h2>
            <p className="text-slate-600">
              Provide your corporate details. Our multi-agent AI will negotiate virtual quotes and generate your blueprint.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Industry & Product</label>
                <input 
                  type="text" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                  placeholder="e.g. AI Software Agency"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Team Size</label>
                  <input 
                    type="text" 
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                    placeholder="e.g. 3 Visas needed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Est. Revenue</label>
                  <input 
                    type="text" 
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                    placeholder="e.g. $500k USD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Target Market</label>
                <input 
                  type="text" 
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                  placeholder="e.g. Global & GCC"
                />
              </div>
            </div>
            
            <button 
              onClick={startOasis}
              disabled={isLoading || (!industry && !teamSize && !revenue && !market)}
              className="mt-8 w-full py-4 bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Agents Orchestrating...
                </>
              ) : (
                <>
                  Generate Setup Blueprint <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Processing Status / Terminal */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="bg-[#0F172A] rounded-xl shadow-xl border border-slate-700 overflow-hidden flex-1 flex flex-col min-h-[500px]">
            {/* Terminal Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="text-slate-400 text-xs font-mono flex items-center gap-2 font-bold tracking-widest uppercase">
                <Terminal className="w-4 h-4" /> CrewAI Core Orchestrator
              </div>
              <div className="w-10"></div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm overflow-y-auto flex-1 bg-[#050A15] space-y-3">
              {logs.length === 0 && !isLoading && !report && !apiError && (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full space-y-4">
                  <Terminal className="w-12 h-12 opacity-30" />
                  <p>Awaiting profile submission to launch autonomous agents...</p>
                </div>
              )}

              {apiError && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-4">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <p className="text-red-400 font-bold">Backend Unreachable</p>
                  <p className="text-slate-400 max-w-md">{apiError}</p>
                </div>
              )}

              <AnimatePresence>
                {logs.map((log, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="leading-relaxed"
                  >
                    <span className={`font-bold mr-2 ${getAgentColor(log.agent)}`}>
                      [{log.agent}]
                    </span>
                    <span className="text-slate-300 break-words">{log.msg}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex items-center mt-4">
                  <span className="text-[#C6A87C] font-bold mr-2">[SYSTEM]</span>
                  <span className="text-slate-300">Agents collaborating</span>
                  <span className="flex gap-1 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </main>

      {/* Official Report Section (Appears after completion) */}
      <AnimatePresence>
        {report && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full"
          >
            <div className="bg-white rounded-xl shadow-xl border border-emerald-200 overflow-hidden print:shadow-none print:border-none">
              <div className="bg-emerald-50 border-b border-emerald-100 px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    Official Setup Blueprint Generated
                  </h3>
                  <p className="text-emerald-700 mt-1 text-sm md:text-base">
                    Your customized Dubai expansion strategy is ready for review.
                  </p>
                </div>
                <button 
                  onClick={simulateDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-[#C6A87C] font-bold rounded-lg transition-colors shadow-sm print:hidden"
                >
                  <Download className="w-5 h-5" /> Download PDF Blueprint
                </button>
              </div>
              <div className="p-6 md:p-12 prose prose-slate max-w-none print:p-0">
                <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AuthGuard>
  );
}
