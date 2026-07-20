import Link from 'next/link';
import { ChevronLeft, Info } from 'lucide-react';

export default async function GenericPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  
  const titleMap: Record<string, string> = {
    'services': 'Official Services Directory',
    'regulations': 'UAE Federal Regulations',
    'support': 'Help & Support Center',
    'terms': 'Terms of Use',
    'privacy': 'Privacy Policy',
    'accessibility': 'Accessibility Statement'
  };

  const title = titleMap[slug] || 'Information Page';

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
              <Info className="w-5 h-5 text-[#C6A87C]" />
              {title}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
        <div className="gov-card p-12">
          <Info className="w-12 h-12 text-[#C6A87C] mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">{title}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This section is currently under review by the relevant authorities to ensure full compliance with the latest UAE federal guidelines. Please check back later for the complete official documentation.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0F172A] hover:bg-[#1e293b] transition-colors">
            Return to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
