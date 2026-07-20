"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, ChevronRight, Building2, ChevronLeft, Download, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface AgentLog {
  agent: string;
  msg: string;
}

export default function SmartRelocationConcierge() {
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [revenue, setRevenue] = useState('');
  const [market, setMarket] = useState('');
  
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

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
    
    const mockLogs = [
      { agent: "System", msg: "Initializing Multi-Agent Audit System..." },
      { agent: "Legal Expert", msg: "Analyzing company profile against UAE Federal Law..." },
      { agent: "Financial Advisor", msg: "Calculating tax implications for Dubai Free Zone..." },
      { agent: "System", msg: "Cross-referencing complete. Generating Blueprint..." },
      { agent: "Success", msg: "Blueprint generated successfully." }
    ];

    for (let i = 0; i < mockLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500)); // 1.5 ~ 2 seconds delay
      setLogs(prev => [...prev, { agent: mockLogs[i].agent, msg: mockLogs[i].msg }]);
    }

    // Add a fake report after completion
    await new Promise(resolve => setTimeout(resolve, 800));
    setReport(`
      <h3>Dubai Free Zone Executive Blueprint</h3>
      <p>Based on your profile, our system strongly recommends the <strong>DMCC Free Zone</strong>.</p>
      <ul>
        <li><strong>Industry Match:</strong> Perfectly aligned with ${industry} regulations.</li>
        <li><strong>Visas & Workspace:</strong> Covers your team requirement (${teamSize}) with a Flexi-Desk setup.</li>
        <li><strong>Tax Implications:</strong> Projected 0% corporate tax for your ${revenue} revenue under current UAE frameworks.</li>
        <li><strong>Market Access:</strong> Strategic positioning for ${market} outreach.</li>
      </ul>
      <p>Next Step: Download this blueprint and submit it to our designated incorporation officers.</p>
    `);
    setIsLoading(false);
  };

  const simulateDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB]">
      
      {/* Official Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-md hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Building2 className="w-5 h-5 text-blue-700" />
                Smart Relocation Concierge
              </h1>
            </div>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-widest border border-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            Official Service
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Form */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Company Profile</h2>
            <p className="text-slate-600">
              Provide your corporate details. Our system will negotiate quotes and generate your official blueprint.
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
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
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
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
                    placeholder="e.g. 3 Visas needed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Est. Revenue</label>
                  <input 
                    type="text" 
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
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
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all"
                  placeholder="e.g. Global & GCC"
                />
              </div>
            </div>
            
            <button 
              onClick={startOasis}
              disabled={isLoading || (!industry && !teamSize && !revenue && !market)}
              className="mt-8 w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate Setup Blueprint <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Processing Status / Audit Trail */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="text-slate-900 font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" /> System Audit Trail
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Status Logging
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white space-y-4">
              {logs.length === 0 && !isLoading && !report && (
                <div className="text-slate-400 flex flex-col items-center justify-center h-full space-y-4">
                  <Clock className="w-12 h-12 opacity-30" />
                  <p>Awaiting submission to begin system audit...</p>
                </div>
              )}
              
              <AnimatePresence>
                {logs.map((log, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                  >
                    {log.agent === 'Success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-bold block text-sm mb-1 ${log.agent === 'Success' ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {log.agent}
                      </span>
                      <span className="text-slate-600 text-sm leading-relaxed">{log.msg}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex items-center gap-3 p-3 text-slate-500">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
                  <span className="text-sm font-medium">Processing current step...</span>
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
              <div className="bg-slate-50 border-b border-slate-200 px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    Official Setup Blueprint Generated
                  </h3>
                  <p className="text-slate-600 mt-1 text-sm md:text-base">
                    Your customized Dubai expansion strategy is ready for review.
                  </p>
                </div>
                <button 
                  onClick={simulateDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors shadow-sm print:hidden"
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
  );
}
