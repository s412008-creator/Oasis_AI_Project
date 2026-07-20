import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
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

        {/* Navigation Section */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-[#0F172A]">
          {/* Removed the 'Home' link as requested */}
          <Link href="/page/services" className="hover:text-[#C6A87C] transition-colors">Services</Link>
          <Link href="/page/regulations" className="hover:text-[#C6A87C] transition-colors">Regulations</Link>
          <Link href="/page/support" className="hover:text-[#C6A87C] transition-colors">Help & Support</Link>
        </nav>

      </div>
    </header>
  );
}
