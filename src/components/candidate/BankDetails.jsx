'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { RiArrowLeftLine, RiUpload2Line, RiLogoutBoxLine } from '@remixicon/react';

export default function BankDetails() {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    // Basic handler, just to show it functions
    if (e.target.files && e.target.files.length > 0) {
      console.log('File selected:', e.target.files[0].name);
    }
  };

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#e9e9ea]">
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

      <div className="px-5 pt-4 pb-6 border-b border-[#e9e9ea]">
        <h1 className="font-heading font-semibold text-[24px] text-[#313131]">
          Bank Details
        </h1>
      </div>

      <form className="flex flex-col gap-6 px-5 pt-6 flex-1">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-1 items-center">
            <label className="font-heading font-medium text-[16px] text-[#313131]">Bank Name</label>
            <span className="text-[#EF4444]">*</span>
          </div>
          <input type="text" className="w-full h-[40px] px-3 py-2 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="eg. HDFC Bank" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-1 items-center">
            <label className="font-heading font-medium text-[16px] text-[#313131]">Account Holder Name</label>
            <span className="text-[#EF4444]">*</span>
          </div>
          <input type="text" className="w-full h-[40px] px-3 py-2 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="As per bank records" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-1 items-center">
            <label className="font-heading font-medium text-[16px] text-[#313131]">Account Number</label>
            <span className="text-[#EF4444]">*</span>
          </div>
          <input type="text" className="w-full h-[40px] px-3 py-2 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="Enter account number" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-1 items-center">
            <label className="font-heading font-medium text-[16px] text-[#313131]">IFSC Code</label>
            <span className="text-[#EF4444]">*</span>
          </div>
          <input type="text" className="w-full h-[40px] px-3 py-2 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="eg. HDFC0001234" />
        </div>
      </form>

      <div className="px-5 pt-6 mt-auto border-t border-[#e9e9ea] pb-6">
        <div className="flex gap-4">
          <Link href="/candidate/dashboard" className="flex-1">
            <button type="button" className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </Link>
          <button type="button" className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-xl font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all">
            Save
          </button>
        </div>
      </div>
      
      {/* Upload FAB */}
      <div className="fixed bottom-10 right-[calc(50%-186px)] z-10 hidden sm:block">
        <button onClick={handleUploadClick} className="w-14 h-14 bg-[#1a1d26] rounded-2xl flex items-center justify-center shadow-lg hover:bg-[#2a2e3d] transition-all">
          <RiUpload2Line size={24} className="text-white" />
        </button>
      </div>
      <div className="fixed bottom-10 right-5 z-10 sm:hidden">
        <button onClick={handleUploadClick} className="w-14 h-14 bg-[#1a1d26] rounded-2xl flex items-center justify-center shadow-lg hover:bg-[#2a2e3d] transition-all">
          <RiUpload2Line size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
