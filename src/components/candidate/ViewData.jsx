'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiArrowRightSLine, RiFileLine, RiCheckLine, RiLogoutBoxLine } from '@remixicon/react';

const sections = [
  { id: 1, slug: 'personal-information', name: 'Personal Information', status: 'review' },
  { id: 2, slug: 'contact-information', name: 'Contact Information', status: 'completed' },
  { id: 3, slug: 'professional-summary', name: 'Professional Summary', status: 'review' },
  { id: 4, slug: 'licenses', name: 'Licenses', status: 'review' },
  { id: 5, slug: 'misc', name: 'Misc', status: 'review' },
];

export default function ViewData() {
  const router = useRouter();

  const handleReady = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvStatus', 'completed');
      localStorage.setItem('passportStatus', 'completed');
      const storedCerts = localStorage.getItem('certificates');
      if (storedCerts) {
        try {
          const certs = JSON.parse(storedCerts);
          const updated = certs.map(c => ({ ...c, status: 'completed' }));
          localStorage.setItem('certificates', JSON.stringify(updated));
        } catch (e) {}
      }
    }
    router.push('/candidate/dashboard');
  };
  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#e9e9ea] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <img src="/Thumbnail.svg" alt="Company Logo" className="w-full h-full object-contain" />
          </div>
          <div className="w-px h-6 bg-[#e9e9ea]"></div>
          <span className="font-sans font-medium text-[16px] text-[#313131]">Company Name</span>
        </div>
        <button className="w-10 h-10 text-[#666] border border-[#e9e9ea] rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50">
          <RiLogoutBoxLine size={20} />
        </button>
      </div>

      <div className="bg-[#f5f5f7] px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-px">
            <h1 className="font-heading font-semibold text-[24px] text-[#333] leading-[32px]">
              View Data
            </h1>
            <p className="font-sans font-normal text-[12px] text-[#333] leading-[16px] tracking-[0.4px]">
              File Name.pdf
            </p>
          </div>
          <div className="bg-[rgba(245,158,11,0.32)] flex items-center gap-1 px-2 py-1.5 rounded-full shrink-0">
            <span className="font-sans font-medium text-[11px] text-[#8f5a00] leading-[1.2] tracking-[0.5px]">
              Review
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white flex-1 flex flex-col gap-2">
        <div className="border-b border-[#c5c7c9] flex h-14 items-center px-4 shrink-0">
          <p className="font-heading font-medium text-[16px] text-[#4f5657] leading-[24px] tracking-[0.15px]">
            Sections
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-x-clip overflow-y-auto px-4 py-3">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/candidate/view-data/fields?section=${section.slug}`}
              className="bg-white border border-[#e6e6e6] flex flex-col gap-3 items-start justify-center px-4 py-3 rounded-xl w-full text-left hover:border-[#ccc] transition-colors"
            >
              <div className="flex h-5 items-center justify-between w-full">
                <p className="font-sans font-normal text-[14px] text-[#1a1b21] leading-[20px] tracking-[0.25px] truncate flex-1">
                  {section.name}
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <div
                  className={`flex items-center gap-[2px] px-2 py-1 rounded-full ${
                    section.status === 'completed'
                      ? 'bg-[#b2e8d6]'
                      : 'bg-[rgba(245,158,11,0.32)]'
                  }`}
                >
                  <span
                    className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${
                      section.status === 'completed'
                        ? 'text-[#00704b]'
                        : 'text-[#8b5b0b]'
                    }`}
                  >
                    4
                  </span>
                  {section.status === 'completed' ? (
                    <RiCheckLine size={12} className="text-[#00704b]" />
                  ) : (
                    <RiFileLine size={12} className="text-[#8b5b0b]" />
                  )}
                </div>
                <RiArrowRightSLine size={24} className="text-[#1a1b21]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-[2px] border-t border-b border-[#e9e9ea] px-5 py-6">
        <div className="flex gap-3">
          <Link href="/candidate/dashboard" className="flex-1">
            <button type="button" className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
              <RiArrowLeftLine size={16} />
              Back
            </button>
          </Link>
          <button onClick={handleReady} type="button" className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}
