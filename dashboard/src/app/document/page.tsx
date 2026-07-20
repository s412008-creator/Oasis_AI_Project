"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, FileText, CheckCircle2, ChevronRight, UploadCloud, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DocumentService() {
  const [topic, setTopic] = useState("We intend to establish a 100% foreign-owned trading company in the UAE mainland, with a guaranteed monopoly over software distribution in the Dubai region.");
  const [logs, setLogs] = useState<{agent: string, msg: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const startOasis = async () => {
    setIsLoading(true);
    setLogs([]);
    
    try {
      const res = await fetch("http://localhost:8000/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 2);
          
          if (chunk.startsWith("data: ")) {
            const dataStr = chunk.substring(6);
            if (dataStr === "[DONE]") break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === "agent_log") {
                setLogs(prev => [...prev, { agent: data.agent, msg: data.msg }]);
              } else if (data.type === "result") {
                 setLogs(prev => [...prev, { agent: "SYSTEM_RESULT", msg: data.report }]);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setLogs(prev => [...prev, { agent: "ERROR", msg: "Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentLabel = (agentName: string) => {
    if (agentName.includes('Translator')) return { label: 'Translation Bureau', icon: <FileText className="w-5 h-5 text-white" />, bg: 'bg-[#0F172A]' };
    if (agentName.includes('Compliance')) return { label: 'Compliance Audit', icon: <CheckCircle2 className="w-5 h-5 text-white" />, bg: 'bg-[#0F172A]' };
    if (agentName.includes('Risk')) return { label: 'Risk Assessment', icon: <AlertTriangle className="w-5 h-5 text-white" />, bg: 'bg-[#0F172A]' };
    if (agentName === 'SYSTEM_RESULT') return { label: 'Official Compliance Report', icon: <CheckCircle2 className="w-5 h-5 text-white" />, bg: 'bg-[#C6A87C]' };
    return { label: 'System Process', icon: <CheckCircle2 className="w-5 h-5 text-white" />, bg: 'bg-slate-400' };
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-[#0F172A] p-2 -ml-2 rounded-md hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <h1 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C6A87C]" />
              AI Document Auditor
            </h1>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">Secure Session</div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-5/12 flex flex-col">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3">Contract Verification</h2>
            <p className="text-slate-600">Upload your foreign contracts. Our multi-agent system will translate and cross-reference them with UAE Federal Commercial Laws.</p>
          </div>

          <div className="gov-card p-6 md:p-8">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#0F172A]">Drag & drop contract file here</p>
              <p className="text-xs text-slate-500 mt-1">or paste raw text below</p>
            </div>
            
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-32 bg-white border border-slate-300 rounded-lg p-4 text-[#0F172A] focus:outline-none focus:border-[#0F172A] shadow-sm resize-none"
            />
            
            <button 
              onClick={startOasis}
              disabled={isLoading}
              className="mt-6 w-full py-3.5 bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Auditing Document...</>
              ) : (
                <>Run Compliance Audit <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-7/12 gov-card p-8 min-h-[600px] flex flex-col relative overflow-hidden">
          <div className="mb-6 pb-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-[#0F172A]">Audit Tracking Log</h3>
          </div>

          <div className="flex-1 overflow-y-auto relative px-2 py-4">
            {logs.length === 0 && !isLoading && <div className="h-full flex items-center justify-center text-slate-400">Awaiting document submission...</div>}
            <div className="space-y-8 relative">
              <AnimatePresence>
              {logs.map((log, i) => {
                const isFinal = log.agent === 'SYSTEM_RESULT';
                const isError = log.agent === 'ERROR';
                const { label, icon, bg } = getAgentLabel(log.agent);

                if (isFinal) {
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t-2 border-[#C6A87C] pt-8">
                      <div className="bg-white border border-[#C6A87C] rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-[#C6A87C]/30 px-6 py-4 flex items-center justify-between">
                          <h4 className="font-bold text-[#0F172A] flex items-center gap-2">Official Risk & Compliance Report</h4>
                        </div>
                        <div className="p-6 text-[#0F172A] whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none">{log.msg}</div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative pl-10">
                    {i !== logs.length - 1 && <div className={`stepper-line ${isLoading && i === logs.length - 1 ? 'stepper-line-active' : ''}`}></div>}
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${isError ? 'bg-red-500' : bg} ring-4 ring-white z-10`}><div className="scale-50">{icon}</div></div>
                    <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm ml-2">
                      <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isError ? 'text-red-600' : 'text-[#C6A87C]'}`}>{label}</h5>
                      <p className="text-sm text-slate-700 leading-relaxed">{log.msg}</p>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
