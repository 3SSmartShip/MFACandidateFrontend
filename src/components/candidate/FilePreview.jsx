'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { RiArrowLeftLine, RiDeleteBinLine, RiUpload2Line, RiFilePdfLine, RiLogoutBoxLine } from '@remixicon/react';

export default function FilePreview() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('File selected for update:', e.target.files[0].name);
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

      <div className="px-5 pt-4 pb-4 border-b border-[#e9e9ea] flex justify-between items-center bg-[#F4F5F7]">
        <div>
          <h1 className="font-heading font-semibold text-[24px] text-[#313131]">
            File Name
          </h1>
          <p className="font-sans font-normal text-[12px] text-[#666]">File Name.pdf</p>
        </div>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="w-12 h-12 bg-white border border-[#e9e9ea] rounded-xl shadow-sm flex items-center justify-center text-[#313131] hover:bg-gray-50"
        >
          <RiDeleteBinLine size={20} />
        </button>
      </div>

      <div className="px-5 pt-6 flex-1 flex flex-col">
        <div className="w-full flex-1 bg-[#F4F5F7] rounded-xl flex items-center justify-center border border-[#e9e9ea]">
          <RiFilePdfLine size={64} className="text-[#ccc]" />
        </div>
      </div>

      <div className="px-5 pt-6 mt-auto border-t border-[#e9e9ea] bg-white">
        <div className="flex gap-4">
          <Link href="/candidate/dashboard" className="flex-1">
            <button type="button" className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <RiArrowLeftLine size={18} />
              Back
            </button>
          </Link>
          <button onClick={handleUploadClick} type="button" className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-xl font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all">
            Update
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] flex flex-col gap-4 shadow-xl">
            <h2 className="font-heading font-semibold text-[24px] text-[#313131]">
              Delete {`{FileName}`}?
            </h2>
            <p className="font-sans font-normal text-[14px] leading-[22px] text-[#313131]">
              This action cannot be undone. This will permanently delete your account and its relavant data.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-5 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-5 bg-[#1a1d26] rounded-xl font-sans font-medium text-[14px] text-white hover:bg-[#2a2e3d] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
