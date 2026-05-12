import InitialData from '@/components/candidate/InitialData';
import { Suspense } from 'react';

export default function InitialDataPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <InitialData />
      </Suspense>
    </div>
  );
}
