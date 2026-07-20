"use client";
import Link from 'next/link';
import { ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      {/* Official Government Top Bar */}
      <div className="bg-[#0F172A] text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs font-medium">
          <ShieldCheck className="w-4 h-4 mr-2 text-[#C6A87C]" />
          Official Portal of the Dubai Digital Infrastructure
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo Section - Uses <a> to force hard reload */}
        <a href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-[#0F172A] text-white rounded flex items-center justify-center font-bold text-lg group-hover:bg-[#C6A87C] transition-colors">
            AE
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] leading-tight">
              Oasis<span className="text-[#C6A87C]">.ai</span>
            </h1>
            <p className="text-sm text-slate-500">Government Services Portal</p>
          </div>
        </a>

        {/* Navigation & Auth Section */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[#0F172A]">
            <Link href="/page/services" className="hover:text-[#C6A87C] transition-colors">Services</Link>
            <Link href="/page/regulations" className="hover:text-[#C6A87C] transition-colors">Regulations</Link>
            <Link href="/page/support" className="hover:text-[#C6A87C] transition-colors">Help & Support</Link>
          </nav>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] text-[#C6A87C] flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-sm font-bold text-[#0F172A]">
                  {userName}
                  <div className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">Verified Entity</div>
                </div>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-slate-100" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
              Login / Register
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
