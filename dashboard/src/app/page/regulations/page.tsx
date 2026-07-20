import Link from 'next/link';
import { ChevronLeft, BookOpen, Scale, Landmark, CheckCircle2 } from 'lucide-react';

export default function RegulationsPage() {
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
              <Scale className="w-5 h-5 text-[#C6A87C]" />
              UAE Federal Regulations
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#0F172A]">Regulatory Knowledge Base</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Stay compliant with the latest directives from the UAE Ministry of Economy and Federal Tax Authority. Essential reading for all foreign investors.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-[#C6A87C] rounded-lg mt-1">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Corporate Tax Framework (9%)</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  Effective from financial years starting on or after June 1, 2023, the UAE has introduced a Federal Corporate Tax on business profits. 
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>0%</strong> for taxable income up to AED 375,000 to support small businesses.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>9%</strong> standard rate for taxable income exceeding AED 375,000.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Free Zone businesses may continue to benefit from 0% tax on "Qualifying Income".</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-[#C6A87C] rounded-lg mt-1">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">UAE Golden Visa Program</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  The UAE Golden Visa is a long-term residence visa which enables foreign talents to live, work or study in the UAE while enjoying exclusive benefits.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700">
                  <strong className="block text-[#0F172A] mb-2">Investor Eligibility Criteria:</strong>
                  Public investment of at least AED 2 million, or owning a property valued at AED 2 million or more. Entrepreneurs can also qualify if their project has a capital of AED 500,000 or approval from an accredited incubator in the UAE.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-[#C6A87C] rounded-lg mt-1">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Mainland vs. Free Zone Ownership</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  Recent amendments to the Commercial Companies Law have revolutionized foreign investment in the UAE.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-4 rounded-lg">
                    <strong className="block text-[#0F172A] mb-1">Mainland</strong>
                    <p className="text-xs text-slate-600">Now allows 100% foreign ownership for over 1,000 commercial and industrial activities. No local sponsor required for eligible activities. Can trade directly in the local UAE market.</p>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-lg">
                    <strong className="block text-[#0F172A] mb-1">Free Zone</strong>
                    <p className="text-xs text-slate-600">Always 100% foreign ownership. Repatriation of 100% capital and profits. Exempt from custom duties. Must use a local distributor to trade within the UAE mainland market.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
