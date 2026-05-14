import ViewDataFields from '@/components/candidate/ViewDataFields';
import { Suspense } from 'react';

export default function ViewDataFieldsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ViewDataFields />
      </Suspense>
    </div>
  );
}
