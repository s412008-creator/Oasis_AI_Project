import Link from 'next/link';
import { ChevronLeft, LifeBuoy, MessageSquare, Mail, Phone, Clock } from 'lucide-react';

export default function SupportPage() {
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
              <LifeBuoy className="w-5 h-5 text-[#C6A87C]" />
              Help & Support Center
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-[#0F172A]">How can we assist you today?</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Our multi-lingual support team and AI agents are available to ensure your relocation and business operations run seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#0F172A] mb-4 text-lg">Contact Official Support</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#0F172A]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Toll Free (UAE)</p>
                    <p className="text-sm font-medium text-[#0F172A]">800 OASIS (62747)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#0F172A]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Support</p>
                    <p className="text-sm font-medium text-[#0F172A]">investors@oasis-ai.gov.ae</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#0F172A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Operating Hours</p>
                    <p className="text-sm font-medium text-[#0F172A]">Mon-Fri, 7:30 AM - 3:30 PM (GST)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] text-white p-6 rounded-xl shadow-sm">
              <MessageSquare className="w-8 h-8 text-[#C6A87C] mb-4" />
              <h3 className="font-bold mb-2">Talk to our AI Agent</h3>
              <p className="text-sm text-slate-300 mb-4">
                Get instant answers regarding regulations, visa status, and portal navigation from our trained AI.
              </p>
              <button className="w-full py-2 bg-[#C6A87C] hover:bg-[#b0956b] transition-colors text-white text-sm font-semibold rounded-md">
                Launch Live Chat
              </button>
            </div>
          </div>

          {/* Right Column: FAQ / Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm h-full">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-6">Submit an Inquiry</h3>
              <p className="text-sm text-slate-600 mb-8">
                Please fill out the form below. For matters requiring urgent official attention, please use the toll-free number.
              </p>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">Full Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">Company Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="Global Tech LLC" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">Email Address</label>
                  <input type="email" className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">Category</label>
                  <select className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] bg-white">
                    <option>Technical Issue with Portal</option>
                    <option>Relocation & Visa Query</option>
                    <option>Corporate Tax Clarification</option>
                    <option>Document Auditor Help</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">Message</label>
                  <textarea rows={4} className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" placeholder="Please describe your issue in detail..."></textarea>
                </div>

                <div className="pt-2">
                  <button type="button" className="bg-[#0F172A] text-white font-semibold py-2.5 px-6 rounded-md hover:bg-[#1e293b] transition-colors">
                    Submit Secure Request
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
