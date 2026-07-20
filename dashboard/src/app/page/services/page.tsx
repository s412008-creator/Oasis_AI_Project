import Link from 'next/link';
import { ChevronLeft, Building2, FileText, Users, ArrowRight, Search, Landmark } from 'lucide-react';

export default function ServicesPage() {
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
              Official Services Directory
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Digital Services Hub</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Access the complete suite of AI-powered government and corporate services. Our platform streamlines your relocation and business operations in Dubai.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Relocation */}
          <Link href="/relocation" className="group">
            <div className="gov-card p-8 h-full flex flex-col relative overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#0F172A] text-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">Smart Relocation Concierge</h4>
              <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                Comprehensive AI advisory for company setup across all Dubai Free Zones. Includes Golden Visa eligibility checks, setup cost estimation, and corporate tax calculations.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Available 24/7</span>
                <span className="flex items-center text-[#C6A87C] font-semibold group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Module 2: Document */}
          <Link href="/document" className="group">
            <div className="gov-card p-8 h-full flex flex-col relative overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#0F172A] text-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">AI Document Auditor</h4>
              <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                Upload foreign commercial contracts for instant certified Arabic translation and rigorous UAE commercial law compliance audits. Identifies risks instantly.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Available 24/7</span>
                <span className="flex items-center text-[#C6A87C] font-semibold group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Module 3: Matchmaking */}
          <Link href="/matchmaking" className="group">
            <div className="gov-card p-8 h-full flex flex-col relative overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#0F172A] text-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">B2B Matchmaking Bureau</h4>
              <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                Connect your business with UAE's top enterprise clients. Our AI analyzes your product and auto-generates localized bilingual introductory communications.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Available 24/7</span>
                <span className="flex items-center text-[#C6A87C] font-semibold group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* Module 4: Banking */}
          <Link href="/banking" className="group">
            <div className="gov-card p-8 h-full flex flex-col relative overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#0F172A] text-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Landmark className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">Corporate Banking Navigator</h4>
              <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                Overcome the hardest part of UAE setup. Our KYC Expert and Banking Matchmaker will pre-screen your profile and connect you with the most suitable UAE banks.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Available 24/7</span>
                <span className="flex items-center text-[#C6A87C] font-semibold group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
