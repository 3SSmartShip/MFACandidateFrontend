'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiUpload2Line, RiEyeLine, RiArrowRightSLine, RiSearchLine, RiLogoutBoxLine } from '@remixicon/react';

export default function Dashboard() {
  const [cvUploaded, setCvUploaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cvUploaded') === 'true';
    }
    return false;
  });
  const [passportUploaded, setPassportUploaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('passportUploaded') === 'true';
    }
    return false;
  });
  const [certificatesUploaded, setCertificatesUploaded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('certificatesUploaded') === 'true';
    }
    return false;
  });
  const [uploadType, setUploadType] = useState(null);
  
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleUploadClick = (type) => {
    setUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (uploadType === 'cv') {
        setCvUploaded(true);
        localStorage.setItem('cvUploaded', 'true');
      } else if (uploadType === 'passport') {
        router.push('/candidate/initial-data?syncing=true');
      } else if (uploadType === 'certificate') {
        setCertificatesUploaded(true);
        localStorage.setItem('certificatesUploaded', 'true');
      }
    }
  };

  const isAnyUploaded = cvUploaded || passportUploaded || certificatesUploaded;

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

      <div className="px-5 pt-4 pb-6">
        <h1 className="font-heading font-semibold text-[32px] leading-[40px] text-[#313131]">
          Hi,<br />
          <span className="text-[#666]">Abhyuday<br />Deshpande</span>
        </h1>
        {isAnyUploaded && (
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="h-5 w-5 text-[#666]" />
            </div>
            <input
              type="text"
              className="w-full h-[44px] pl-10 pr-3 py-2 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]"
              placeholder="Search documents"
            />
          </div>
        )}
      </div>

      <div className="px-5 flex flex-col gap-6">
        {/* Required Documents */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-medium text-[16px] text-[#313131]">Required Documents</h2>
          <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-sans font-medium text-[16px] text-[#313131]">CV</h3>
                <p className="font-sans font-normal text-[12px] text-[#666]">{cvUploaded ? 'FirstNameCV.pdf' : 'Required for application'}</p>
              </div>
              {cvUploaded && (
                <Link href="/candidate/document">
                  <button className="w-8 h-8 flex items-center justify-center border border-[#e9e9ea] rounded-lg text-[#666] hover:bg-gray-50">
                    <RiEyeLine size={16} />
                  </button>
                </Link>
              )}
            </div>
            <button 
              onClick={() => handleUploadClick('cv')}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${cvUploaded ? 'bg-white border border-[#e9e9ea] hover:bg-gray-50' : 'bg-[#1a1d26] hover:bg-[#2a2e3d]'}`}
            >
              <RiUpload2Line size={18} className={cvUploaded ? "text-[#313131]" : "text-white"} />
              <span className={`font-sans font-medium text-[14px] ${cvUploaded ? 'text-[#313131]' : 'text-white'}`}>
                {cvUploaded ? 'Update CV' : 'Upload CV'}
              </span>
            </button>
          </div>
        </div>

        {/* Additional Documents and Details */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-medium text-[16px] text-[#313131]">Additional Documents and Details</h2>
          <div className="flex flex-col gap-3">
            {/* Passport */}
            <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">Passport</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">{passportUploaded ? 'Passport.pdf' : 'Last Updated Date'}</p>
                </div>
                {passportUploaded ? (
                  <Link href="/candidate/document">
                    <button className="w-8 h-8 flex items-center justify-center border border-[#e9e9ea] rounded-lg text-[#666] hover:bg-gray-50">
                      <RiEyeLine size={16} />
                    </button>
                  </Link>
                ) : (
                  <button onClick={() => handleUploadClick('passport')} className="flex items-center gap-2 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50">
                    <RiUpload2Line size={16} className="text-[#313131]" />
                    <span className="font-sans font-medium text-[12px] text-[#313131]">Upload</span>
                  </button>
                )}
              </div>
              {passportUploaded && (
                <button onClick={() => handleUploadClick('passport')} className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                  <RiUpload2Line size={18} className="text-[#313131]" />
                  <span className="font-sans font-medium text-[14px] text-[#313131]">Update Passport</span>
                </button>
              )}
            </div>

            {/* Certificates */}
            {!certificatesUploaded ? (
              <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">Certificates</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">STCW, GMDSS, medical...</p>
                </div>
                <button onClick={() => handleUploadClick('certificate')} className="flex items-center gap-2 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50">
                  <RiUpload2Line size={16} className="text-[#313131]" />
                  <span className="font-sans font-medium text-[12px] text-[#313131]">Upload</span>
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">Certificate1</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">Last Updated Date</p>
                </div>
                <button onClick={() => handleUploadClick('certificate')} className="w-12 h-12 bg-[#1a1d26] rounded-xl flex items-center justify-center hover:bg-[#2a2e3d]">
                  <RiUpload2Line size={24} className="text-white" />
                </button>
              </div>
            )}

            {/* Bank Account */}
            <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-sans font-medium text-[16px] text-[#313131]">Bank Account</h3>
                <p className="font-sans font-normal text-[12px] text-[#666]">Last Updated Date</p>
              </div>
              <Link href="/candidate/bank-details">
                <button className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50">
                  <span className="font-sans font-medium text-[12px] text-[#313131]">Details</span>
                  <RiArrowRightSLine size={16} className="text-[#313131]" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Documents Uploaded Section (Dynamic) */}
        {isAnyUploaded && (
          <div className="flex flex-col gap-4 mt-2">
            <h2 className="font-heading font-medium text-[16px] text-[#313131]">Documents Uploaded</h2>
            {cvUploaded && (
              <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">CV</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">FirstNameCV.pdf</p>
                </div>
                <button onClick={() => handleUploadClick('cv')} className="w-12 h-12 bg-[#1a1d26] rounded-xl flex items-center justify-center hover:bg-[#2a2e3d]">
                  <RiUpload2Line size={24} className="text-white" />
                </button>
              </div>
            )}
            {passportUploaded && (
              <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">Passport</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">Passport.pdf</p>
                </div>
                <button onClick={() => handleUploadClick('passport')} className="w-12 h-12 bg-[#1a1d26] rounded-xl flex items-center justify-center hover:bg-[#2a2e3d]">
                  <RiUpload2Line size={24} className="text-white" />
                </button>
              </div>
            )}
            {certificatesUploaded && (
              <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-sans font-medium text-[16px] text-[#313131]">Certificate1</h3>
                  <p className="font-sans font-normal text-[12px] text-[#666]">Last Updated Date</p>
                </div>
                <button onClick={() => handleUploadClick('certificate')} className="w-12 h-12 bg-[#1a1d26] rounded-xl flex items-center justify-center hover:bg-[#2a2e3d]">
                  <RiUpload2Line size={24} className="text-white" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
