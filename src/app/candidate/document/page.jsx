import FilePreview from '@/components/candidate/FilePreview';
import { Suspense } from 'react';

export default function DocumentPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center w-full">
      <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center"><p className="font-sans text-[14px] text-[#666]">Loading...</p></div>}>
        <FilePreview />
      </Suspense>
    </div>
  );
}
