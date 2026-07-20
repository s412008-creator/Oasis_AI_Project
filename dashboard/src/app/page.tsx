import Link from 'next/link';
import { Building2, FileText, Users, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB]">
      {/* Official Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden py-24 border-b border-slate-200">
        <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 border border-blue-100 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Official Dubai Corporate Services Portal
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Welcome to your digital <span className="text-blue-700">gateway to Dubai.</span>
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Access automated, AI-driven government services for foreign investors. Fast, secure, and fully compliant with UAE regulations.
          </p>
        </div>
      </section>

      {/* Trust Anchors & Metrics Section */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center divide-x divide-slate-200">
            <div className="px-4 flex flex-col items-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Architecture</div>
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-700 font-extrabold">CrewAI</span> Multi-Agent
              </div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Average Setup Time</div>
              <div className="font-bold text-slate-900 text-lg">5 Minutes</div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Enterprises Assisted</div>
              <div className="font-bold text-slate-900 text-lg">1,200+</div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Compliance Grounding</div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                UAE Federal Law DB
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <main className="flex-1 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-700 pl-4">
            Available Services
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Module 1: Relocation Concierge */}
            <Link href="/relocation" className="group">
              <div className="bg-slate-50 border border-slate-200 p-8 h-full flex flex-col relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Smart Relocation Concierge</h4>
                <p className="text-slate-600 mb-8 flex-1">
                  Automated advisory for company setup, Golden Visa eligibility, and corporate tax calculation in Dubai Free Zones.
                </p>
                <div className="flex items-center text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                  Access Service <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            </Link>

            {/* Module 2: Document Translator */}
            <Link href="/document" className="group">
              <div className="bg-slate-50 border border-slate-200 p-8 h-full flex flex-col relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">AI Document Auditor</h4>
                <p className="text-slate-600 mb-8 flex-1">
                  Upload foreign contracts for instant Arabic translation and UAE commercial law compliance checks.
                </p>
                <div className="flex items-center text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                  Access Service <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            </Link>

            {/* Module 3: B2B Matchmaking */}
            <Link href="/matchmaking" className="group">
              <div className="bg-slate-50 border border-slate-200 p-8 h-full flex flex-col relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">B2B Matchmaking Bureau</h4>
                <p className="text-slate-600 mb-8 flex-1">
                  Discover potential UAE clients or suppliers and auto-generate bilingual introductory communications.
                </p>
                <div className="flex items-center text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                  Access Service <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            </Link>

          {/* Module 4: Banking Navigator */}
            <Link href="/banking" className="group">
              <div className="bg-slate-50 border border-slate-200 p-8 h-full flex flex-col relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <Landmark className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Corporate Banking Navigator</h4>
                <p className="text-slate-600 mb-8 flex-1">
                  Overcome the hardest part of UAE setup. Our KYC Expert and Banking Matchmaker will pre-screen your profile and connect you with the most suitable UAE banks.
                </p>
                <div className="flex items-center text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                  Access Service <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            </Link>

          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-100 text-slate-600 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h5 className="text-slate-900 font-bold text-lg mb-4">Oasis.ai Portal</h5>
            <p className="text-sm leading-relaxed max-w-sm">
              The official AI-powered gateway for foreign investment and corporate relocation to Dubai. Built on Multi-Agent architectures to ensure enterprise readiness and regulatory compliance.
            </p>
          </div>
          <div>
            <h5 className="text-slate-900 font-bold mb-4">Services</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/relocation" className="hover:text-blue-700">Relocation Advisory</Link></li>
              <li><Link href="/document" className="hover:text-blue-700">Document Audit</Link></li>
              <li><Link href="/matchmaking" className="hover:text-blue-700">Business Matchmaking</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-slate-900 font-bold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/page/terms" className="hover:text-blue-700">Terms of Use</Link></li>
              <li><Link href="/page/privacy" className="hover:text-blue-700">Privacy Policy</Link></li>
              <li><Link href="/page/accessibility" className="hover:text-blue-700">Accessibility</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
