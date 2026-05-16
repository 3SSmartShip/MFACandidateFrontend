import ViewData from '@/components/candidate/ViewData';
import { Suspense } from 'react';

export default function ViewDataPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ViewData />
      </Suspense>
    </div>
  );
}
