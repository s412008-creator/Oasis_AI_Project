"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, Lock, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Fake login logic
    const name = email.split('@')[0] || 'User';
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    login(`H.E. ${formattedName}`);
    router.push('/');
  };

  const handleUaePassLogin = () => {
    login('H.E. Abdulla Al Maktoum');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      <header className="bg-[#0F172A] text-white py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-[#C6A87C] text-[#0F172A] rounded flex items-center justify-center font-bold text-sm">
              AE
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Oasis.ai</h1>
              <p className="text-[10px] text-slate-400">Government Portal</p>
            </div>
          </Link>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure SSL
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-[#0F172A] p-6 text-center text-white border-b border-[#C6A87C]/30">
            <div className="w-16 h-16 bg-[#C6A87C]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C6A87C]/30">
              <Building2 className="w-8 h-8 text-[#C6A87C]" />
            </div>
            <h2 className="text-2xl font-bold">Official Portal Access</h2>
            <p className="text-sm text-slate-400 mt-2">Login to manage your corporate entity</p>
          </div>

          <div className="p-8">
            <button 
              onClick={handleUaePassLogin}
              className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-bold transition-colors shadow-sm mb-6"
            >
              <div className="bg-white text-emerald-600 p-1 rounded-sm text-[10px] font-black leading-none">
                UAE<br/>PASS
              </div>
              Login with UAE Pass
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-slate-200 absolute w-full"></div>
              <span className="bg-white px-3 text-xs text-slate-400 uppercase font-bold relative z-10">or use portal credentials</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                    placeholder="director@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#C6A87C] focus:ring-[#C6A87C]" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-[#0F172A] font-bold hover:text-[#C6A87C]">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-bold transition-colors shadow-md mt-4"
              >
                Sign In to Portal
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
