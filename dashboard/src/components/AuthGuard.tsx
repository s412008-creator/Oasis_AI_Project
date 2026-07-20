"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C6A87C]/30 border-t-[#C6A87C] rounded-full animate-spin"></div>
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Authenticating Session...
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
