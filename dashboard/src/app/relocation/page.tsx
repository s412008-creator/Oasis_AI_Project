"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  UploadCloud,
  FileText,
  User,
  Check
} from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

export default function SmartRelocationConcierge() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    passportNumber: '',
    nationality: ''
  });

  const [companyDetails, setCompanyDetails] = useState({
    industry: '',
    teamSize: '',
    revenue: '',
    market: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call and processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 3500);
  };

  const renderProgress = () => {
    const steps = ['Personal Details', 'Company Profile', 'Documents', 'Review'];
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#C6A87C] -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((label, idx) => {
            const isCompleted = step > idx + 1;
            const isActive = step === idx + 1;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2 bg-[#F9FAFB] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                  isCompleted ? 'bg-[#C6A87C] border-[#C6A87C] text-[#0F172A]' :
                  isActive ? 'bg-[#0F172A] border-[#0F172A] text-white' :
                  'bg-white border-slate-300 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB] relative">
        
        {/* Official Header */}
        <header className="bg-[#0F172A] text-white sticky top-0 z-20 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors p-2 -ml-2 rounded-md hover:bg-slate-800">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C6A87C]" />
                  Foreign Direct Investment Portal
                </h1>
              </div>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-[#C6A87C]/20 text-[#C6A87C] rounded-full uppercase tracking-wide border border-[#C6A87C]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Secure Government Gateway
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3">Corporate Establishment Application</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Please complete this formal application to initiate your business setup in the UAE. All submitted information will be cross-referenced with Federal Registries.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-50 border-b border-slate-200 p-6 md:px-10 md:pt-10 md:pb-6">
              {renderProgress()}
            </div>

            <div className="p-6 md:p-10 min-h-[400px]">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0F172A]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A]">Primary Applicant Details</h3>
                        <p className="text-sm text-slate-500">Provide details for the main shareholder or director.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={personalDetails.fullName}
                        onChange={(e) => setPersonalDetails({...personalDetails, fullName: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                        placeholder="As it appears on your passport"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                          Passport Number <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={personalDetails.passportNumber}
                          onChange={(e) => setPersonalDetails({...personalDetails, passportNumber: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm uppercase"
                          placeholder="e.g. A12345678"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                          Nationality <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={personalDetails.nationality}
                          onChange={(e) => setPersonalDetails({...personalDetails, nationality: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                        >
                          <option value="">Select Nationality</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="TW">Taiwan</option>
                          <option value="SG">Singapore</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Company Profile */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0F172A]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A]">Proposed Corporate Entity</h3>
                        <p className="text-sm text-slate-500">Define the structure and activities of your business.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        Primary Industry / Activity <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={companyDetails.industry}
                        onChange={(e) => setCompanyDetails({...companyDetails, industry: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                        placeholder="e.g. AI Software Development, Management Consulting"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                          Expected Visa Allocation <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={companyDetails.teamSize}
                          onChange={(e) => setCompanyDetails({...companyDetails, teamSize: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                        >
                          <option value="">Select Visa Quota</option>
                          <option value="1">1 Visa (Solo Founder)</option>
                          <option value="2-3">2-3 Visas</option>
                          <option value="4-6">4-6 Visas</option>
                          <option value="7+">7+ Visas</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                          Projected First Year Revenue (USD) <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={companyDetails.revenue}
                          onChange={(e) => setCompanyDetails({...companyDetails, revenue: e.target.value})}
                          className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                          placeholder="e.g. 500,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        Target Market / Operating Jurisdictions <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={companyDetails.market}
                        onChange={(e) => setCompanyDetails({...companyDetails, market: e.target.value})}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-[#C6A87C] focus:ring-1 focus:ring-[#C6A87C] transition-all shadow-sm"
                        placeholder="e.g. Local UAE Market, GCC, Global Exports"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Documents */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0F172A]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A]">Mandatory Attachments</h3>
                        <p className="text-sm text-slate-500">Upload required compliance documents securely.</p>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setUploadedFiles([...uploadedFiles, 'passport_copy_signed.pdf'])}
                    >
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <h4 className="text-[#0F172A] font-bold">Upload Passport Copy</h4>
                      <p className="text-sm text-slate-500 mt-1 mb-4 max-w-sm">
                        Please upload a clear, color scan of the primary applicant's passport. PDF or JPG only. Max 5MB.
                      </p>
                      <button className="bg-white border border-slate-300 text-[#0F172A] px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                        Browse Files
                      </button>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-800">passport_copy_signed.pdf attached successfully.</span>
                        </div>
                        <button className="text-xs text-emerald-700 font-bold hover:underline" onClick={() => setUploadedFiles([])}>Remove</button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0F172A]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A]">Review & Submit</h3>
                        <p className="text-sm text-slate-500">Please verify all information before official submission.</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-6">
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Applicant</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs text-slate-500">Full Name</span>
                            <span className="font-medium text-[#0F172A]">{personalDetails.fullName || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-slate-500">Nationality</span>
                            <span className="font-medium text-[#0F172A]">{personalDetails.nationality || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Corporate Entity</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs text-slate-500">Industry</span>
                            <span className="font-medium text-[#0F172A]">{companyDetails.industry || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-slate-500">Visas Required</span>
                            <span className="font-medium text-[#0F172A]">{companyDetails.teamSize || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                      <strong>Official Declaration:</strong> I hereby declare that all information provided is accurate and true. I understand that false declarations may result in application rejection under UAE Federal Laws.
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="bg-slate-50 border-t border-slate-200 p-6 md:px-10 flex items-center justify-between">
              <button 
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className="px-6 py-3 font-bold text-slate-500 hover:text-[#0F172A] transition-colors disabled:opacity-0"
              >
                Go Back
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md flex items-center gap-2"
                >
                  Continue to Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#C6A87C] hover:bg-[#b09369] text-[#0F172A] px-8 py-3 rounded-lg font-black transition-colors shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
                >
                  Submit Application for Review
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border-t-4 border-[#C6A87C]">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-[#0F172A] rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Processing Application</h3>
              <p className="text-slate-500 text-sm">
                Securely transmitting data and conducting initial verification against UAE Federal Registries...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-emerald-500 p-8 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-1 tracking-tight">Application Received</h2>
                <p className="text-emerald-50">Your request has been successfully lodged.</p>
              </div>
              
              <div className="p-8 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Official Case Number</p>
                  <p className="text-3xl font-mono font-bold text-[#0F172A] tracking-wider">#DXB-2024-8891</p>
                </div>
                
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Our compliance department and dedicated agents will review your file within 1-2 business days. You will receive an official notification via email once pre-approval is complete.
                </p>

                <div className="flex gap-4">
                  <button className="flex-1 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-lg font-bold transition-colors">
                    Download Receipt
                  </button>
                  <Link href="/" className="flex-1 bg-[#0F172A] text-white hover:bg-slate-800 py-3 rounded-lg font-bold transition-colors block leading-tight flex items-center justify-center">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthGuard>
  );
}
