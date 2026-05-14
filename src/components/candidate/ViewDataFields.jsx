'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiEditBoxLine, RiLogoutBoxLine } from '@remixicon/react';

const sectionsData = {
  'personal-information': {
    name: 'Personal Information',
    fields: [
      { label: 'Full Name', value: 'Mahendra Mohan Joshi' },
      { label: 'First name', value: 'Mahendra' },
      { label: 'Middle name', value: 'Mohan' },
      { label: 'Surname', value: 'Joshi' },
      { label: 'Date of Birth', value: '10/10/1992' },
      { label: 'Place of Birth', value: 'Margao, Goa' },
      { label: 'Nationality', value: 'Indian' },
      { label: 'Sex', value: 'Male' },
    ],
  },
  'contact-information': {
    name: 'Contact Information',
    fields: [
      { label: 'Email', value: 'mahendra@example.com' },
      { label: 'Phone', value: '+91 98765 43210' },
      { label: 'Address', value: 'Margao, Goa, India' },
      { label: 'Emergency Contact', value: '+91 98765 43211' },
    ],
  },
  'professional-summary': {
    name: 'Professional Summary',
    fields: [
      { label: 'Total Experience', value: '12 years' },
      { label: 'Current Position', value: 'Chief Engineer' },
      { label: 'Vessel Type', value: 'Oil Tanker' },
      { label: 'Last Vessel', value: 'MT Ocean Explorer' },
    ],
  },
  'licenses': {
    name: 'Licenses',
    fields: [
      { label: 'STCW License No', value: 'STCW-2024-001234' },
      { label: 'License Type', value: 'Chief Engineer Unlimited' },
      { label: 'Issued By', value: 'Directorate General of Shipping' },
      { label: 'Expiry Date', value: '31/12/2028' },
    ],
  },
  'misc': {
    name: 'Misc',
    fields: [
      { label: 'Medical Certificate', value: 'Valid until 15/06/2026' },
      { label: 'Passport No', value: 'Z1234567' },
      { label: 'Seaman Book No', value: 'IND-2024-98765' },
      { label: 'Allergies', value: 'None' },
    ],
  },
};

export default function ViewDataFields() {
  const searchParams = useSearchParams();
  const sectionId = searchParams.get('section') || 'personal-information';
  const section = sectionsData[sectionId] || sectionsData['personal-information'];

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

      <div className="bg-white flex-1 flex flex-col gap-1">
        <div className="border-b border-[#c5c7c9] flex h-14 items-center px-4 shrink-0">
          <p className="font-heading font-medium text-[16px] text-[#4f5657] leading-[24px] tracking-[0.15px]">
            {section.name}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4 p-4">
          {section.fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-4 w-full">
                <p className="flex-1 font-heading font-medium text-[16px] text-[#4f5657] leading-[1.2] tracking-[0.15px]">
                  {field.label}
                </p>
                <RiEditBoxLine size={20} className="text-[#4f5657] shrink-0" />
              </div>
              <div className="bg-white border border-[#e6e6e6] flex items-center h-[36px] overflow-clip px-3 py-1 rounded-lg w-full">
                <p className="flex-1 font-sans font-medium text-[14px] text-[#79797e] leading-[1.6] tracking-[0.1px]">
                  {field.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-[2px] border-t border-b border-[#e9e9ea] px-5 py-6">
        <div className="flex gap-3">
          <Link href="/candidate/view-data" className="flex-1">
            <button type="button" className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
              <RiArrowLeftLine size={16} />
              Back
            </button>
          </Link>
          <button type="button" className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}
