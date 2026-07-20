import Link from 'next/link';
import { ChevronLeft, Accessibility as AccessibilityIcon } from 'lucide-react';

export default function AccessibilityPage() {
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
              <AccessibilityIcon className="w-5 h-5 text-[#C6A87C]" />
              Accessibility Statement
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="gov-card p-8 sm:p-12">
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-2">Accessibility Statement</h2>
          <p className="text-sm text-slate-400 mb-10">Last updated: July 20, 2026</p>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Our Commitment</h3>
              <p>
                Oasis.ai is committed to ensuring the Platform is accessible to all users, including people with
                disabilities. We continually work to improve the usability and accessibility of our services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Conformance Target</h3>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. These guidelines
                explain how to make web content more accessible for people with disabilities and more usable for
                everyone.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Measures We Take</h3>
              <p>
                Our design and development practices include semantic HTML structure, keyboard-navigable
                interfaces, sufficient color contrast, and descriptive labels for interactive elements across the
                relocation, document, matchmaking, and banking modules.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Compatibility</h3>
              <p>
                The Platform is designed to work with modern browsers and common assistive technologies such as
                screen readers. Some third-party embedded content may not yet fully meet this standard.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Known Limitations</h3>
              <p>
                As the Platform is under active development, some pages or components may not yet be fully
                accessible. We are actively working to identify and remediate these gaps.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Feedback</h3>
              <p>
                We welcome your feedback on the accessibility of the Oasis.ai Portal. If you encounter an
                accessibility barrier, please let us know through the{' '}
                <Link href="/page/support" className="text-[#C6A87C] font-medium hover:underline">
                  Help &amp; Support
                </Link>{' '}
                center so we can address it.
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
