'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function OnboardHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('t');
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('invite-token', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.orgId) {
          localStorage.setItem('orgId', payload.orgId);
        }
      } catch {}
    }
    router.replace('/candidate/login');
  }, [searchParams, router]);

  return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-[#666] font-sans text-[14px]">Redirecting...</div>;
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-[#666] font-sans text-[14px]">Loading...</div>}>
      <OnboardHandler />
    </Suspense>
  );
}
