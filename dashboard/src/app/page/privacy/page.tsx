import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
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
              <ShieldCheck className="w-5 h-5 text-[#C6A87C]" />
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="gov-card p-8 sm:p-12">
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Privacy Policy</h2>
          <p className="text-sm text-slate-400 mb-10">Last updated: July 20, 2026</p>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly, such as your name, contact details, business profile,
                and any documents you upload for translation or compliance review. We also collect limited technical
                data (such as browser type and usage patterns) to help operate and improve the Platform.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">2. How We Use Your Information</h3>
              <p>
                Information you provide is used to generate relocation recommendations, audit uploaded documents,
                identify potential business or banking matches, and otherwise operate the AI agent features you
                request. We do not use your data to train third-party AI models.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">3. Data Sharing</h3>
              <p>
                We do not sell your personal information. Data may be shared with the AI and search providers that
                power the Platform&apos;s agents solely to process your requests, and may be disclosed if required
                by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">4. Data Security</h3>
              <p>
                We apply reasonable technical and organizational safeguards to protect the information you share
                with us. However, no method of transmission or storage is completely secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">5. Cookies &amp; Tracking</h3>
              <p>
                The Platform may use essential cookies and similar technologies required for core functionality,
                such as keeping you signed in during a session. We do not currently use third-party advertising
                trackers.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">6. Your Rights</h3>
              <p>
                Depending on your jurisdiction, you may have the right to access, correct, or request deletion of
                your personal data. To exercise these rights, please contact us using the details below.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">7. Data Retention</h3>
              <p>
                We retain your information only for as long as necessary to provide the services you request or as
                required by applicable law, after which it is deleted or anonymized.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">8. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy periodically. Material changes will be reflected by an updated
                &ldquo;Last updated&rdquo; date above.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">9. Contact Us</h3>
              <p>
                For privacy-related questions or requests, please reach out through the{' '}
                <Link href="/page/support" className="text-[#C6A87C] font-medium hover:underline">
                  Help &amp; Support
                </Link>{' '}
                center.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0F172A] hover:bg-[#1e293b] transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
