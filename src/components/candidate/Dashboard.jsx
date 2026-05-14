'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  RiUpload2Line, 
  RiEyeLine, 
  RiArrowRightSLine, 
  RiSearchLine, 
  RiLogoutBoxLine,
  RiMore2Fill,
  RiEditBoxLine,
  RiDeleteBin5Line
} from '@remixicon/react';

import UploadedCertificateCard from './UploadedCertificateCard';

export default function Dashboard() {
  const [cvStatus, setCvStatus] = useState('not-uploaded');
  const [passportStatus, setPassportStatus] = useState('not-uploaded');
  const [certificates, setCertificates] = useState([]);
  
  const [uploadType, setUploadType] = useState(null);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [certificateName, setCertificateName] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cvStored = localStorage.getItem('cvStatus');
      if (cvStored) setCvStatus(cvStored);
      const ppStored = localStorage.getItem('passportStatus');
      if (ppStored) setPassportStatus(ppStored);
      
      const storedCerts = localStorage.getItem('certificates');
      if (storedCerts) {
        try {
          setCertificates(JSON.parse(storedCerts));
        } catch (e) {
          // ignore
        }
      } else if (localStorage.getItem('certificatesUploaded') === 'true') {
        setCertificates([{
          id: Date.now(),
          name: 'Certificate1',
          date: 'Last Updated Date',
          fileName: 'certificate.pdf'
        }]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('cvStatus', cvStatus);
  }, [cvStatus]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('passportStatus', passportStatus);
  }, [passportStatus]);

  const handleUploadClick = (type, certToUpdate = null) => {
    setUploadType(type);
    if (certToUpdate) {
      setEditingCertId(certToUpdate.id);
      setCertificateName(certToUpdate.name);
      setUploadSheetOpen(true);
    } else {
      setEditingCertId(null);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (uploadType === 'cv') {
        setCvStatus('processing');
        setTimeout(() => setCvStatus('review'), 3000);
      } else if (uploadType === 'passport') {
        setPassportStatus('processing');
        setTimeout(() => setPassportStatus('review'), 3000);
      } else if (uploadType === 'certificate') {
        setPendingFile(file);
        setCertificateName(file.name.split('.')[0]);
        setUploadSheetOpen(true);
      }
      
      e.target.value = '';
    }
  };

  const confirmCertificateUpload = () => {
    let updatedCerts = [...certificates];
    
    if (editingCertId) {
      const idx = updatedCerts.findIndex(c => c.id === editingCertId);
      if (idx !== -1) {
        updatedCerts[idx].name = certificateName;
      }
    } else if (pendingFile) {
      const newCert = {
        id: Date.now(),
        name: certificateName || pendingFile.name.split('.')[0],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileName: pendingFile.name,
        status: 'processing',
      };
      updatedCerts.push(newCert);
      setTimeout(() => updateCertStatus(newCert.id, 'review'), 3000);
    }
    
    setCertificates(updatedCerts);
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setUploadSheetOpen(false);
    setCertificateName('');
    setPendingFile(null);
    setEditingCertId(null);
  };

  const updateCertStatus = (certId, newStatus) => {
    setCertificates(prev => {
      const updated = prev.map(c => c.id === certId ? { ...c, status: newStatus } : c);
      localStorage.setItem('certificates', JSON.stringify(updated));
      return updated;
    });
  };

  const uploadedStatuses = ['processing', 'review', 'error', 'completed'];
  const isAnyUploaded = certificates.length > 0 || uploadedStatuses.includes(cvStatus) || uploadedStatuses.includes(passportStatus);

  const badgeConfig = {
    processing: { bg: 'bg-[#dde6fd]', text: 'text-[#334f94]', label: 'Processing' },
    review: { bg: 'bg-[#fdecce]', text: 'text-[#935f07]', label: 'Review' },
    error: { bg: 'bg-[#fcdada]', text: 'text-[#bf3636]', label: 'Error' },
  };

  const isUploadedState = (status) => uploadedStatuses.includes(status);

  function renderDocCard(title, status, badges, onUpload, navRouter) {
    const isCert = title === 'Certificates';
    if (isCert) {
      return (
        <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-4 py-2 flex gap-3 items-stretch w-full">
          <div className="flex flex-col gap-1 flex-1 min-w-px justify-center">
            <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Certificates</h3>
            <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">STCW, GMDSS, medical...</p>
          </div>
          <div className="flex items-center self-stretch">
            <div className="flex gap-2.5 h-full items-start py-2">
              <button onClick={() => onUpload('certificate')} className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50 shrink-0">
                <div className="flex items-center p-[2px]">
                  <RiUpload2Line size={16} className="text-[#313131]" />
                </div>
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Upload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const isNotUploaded = status === 'not-uploaded';
    const docKey = title.toLowerCase();
    const showBadge = isUploadedState(status) && status !== 'completed';

    if (isNotUploaded && title === 'Passport') {
      return (
        <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-4 py-2 flex gap-3 items-stretch w-full">
          <div className="flex flex-col gap-1 flex-1 min-w-px justify-center">
            <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Passport</h3>
            <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">Last Updated Date</p>
          </div>
          <div className="flex items-center self-stretch">
            <div className="flex gap-2.5 h-full items-start py-2">
              <button onClick={() => onUpload('passport')} className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50 shrink-0">
                <div className="flex items-center p-[2px]">
                  <RiUpload2Line size={16} className="text-[#313131]" />
                </div>
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Upload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-white border border-[#e9e9ea] ${isNotUploaded ? 'rounded-[24px] px-6 py-4' : 'rounded-[16px] p-4'} flex flex-col gap-3`}>
        {isNotUploaded ? (
          <>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">{title}</h3>
                <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">FirstNameCV.pdf</p>
              </div>
              <div className="bg-white border border-[#e9e9ea] rounded-lg shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] h-8 w-8 flex items-center justify-center shrink-0">
                <Link href="/candidate/document" className="w-full h-full flex items-center justify-center text-[#666] hover:bg-gray-50 rounded-lg">
                  <RiEyeLine size={16} />
                </Link>
              </div>
            </div>
            <button
              onClick={() => onUpload(docKey)}
              className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-[#2a2e3d] transition-all"
            >
              <div className="flex items-center p-[2px]">
                <RiUpload2Line size={16} className="text-white" />
              </div>
              <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white">Upload CV</span>
            </button>
          </>
        ) : (
          <>
            <div className="relative w-full">
              <div className="flex gap-3 items-center w-full pr-11">
                <div className="flex flex-col gap-1 flex-1 min-w-px">
                  <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">{title}</h3>
                  <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]}">{title === 'CV' ? 'FirstNameCV.pdf' : 'Passport.pdf'}</p>
                </div>
                {showBadge && (
                  <div className={`px-3 py-2 rounded-full shrink-0 ${badges[status]?.bg}`}>
                    <span className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${badges[status]?.text}`}>
                      {badges[status]?.label}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-[6px] right-0 bg-white border border-[#e9e9ea] rounded-lg shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] h-8 w-8 flex items-center justify-center">
                <Link href="/candidate/document" className="w-full h-full flex items-center justify-center text-[#666] hover:bg-gray-50 rounded-lg">
                  <RiEyeLine size={16} />
                </Link>
              </div>
            </div>
            {status === 'processing' && (
              <button disabled className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Processing</span>
              </button>
            )}
            {status === 'review' && (
              <button onClick={() => navRouter.push('/candidate/view-data')} className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50 transition-all">
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Review data</span>
                <div className="flex items-center p-[2px]">
                  <RiArrowRightSLine size={16} className="text-[#313131]" />
                </div>
              </button>
            )}
            {status === 'error' && (
              <button className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50 transition-all">
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">See error</span>
              </button>
            )}
            {status === 'completed' && (
              <button onClick={() => onUpload(docKey)} className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50 transition-all">
                <div className="flex items-center p-[2px]">
                  <RiUpload2Line size={16} className="text-[#313131]" />
                </div>
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Update {title}</span>
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  function renderBankAccount() {
    return (
      <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-4 py-2 flex gap-3 items-stretch w-full">
        <div className="flex flex-col gap-1 flex-1 min-w-px justify-center">
          <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Bank Account</h3>
          <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">Last Updated Date</p>
        </div>
        <div className="flex items-center self-stretch">
          <div className="flex gap-2.5 h-full items-start py-2">
            <Link href="/candidate/bank-details">
              <button className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50">
                <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Details</span>
                <div className="flex items-center p-[2px]">
                  <RiArrowRightSLine size={16} className="text-[#313131]" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10 overflow-x-hidden">
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
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-10 h-10 text-[#666] border border-[#e9e9ea] rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
          title="Reset Test Data"
        >
          <RiLogoutBoxLine size={20} />
        </button>
      </div>

      <div className="px-5 pt-10 pb-6">
        <h1 className="font-heading font-semibold text-[36px] leading-[44px] text-[#333]">
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

      <div className="bg-white border-t border-[#e9e9ea] px-5 py-3 flex-1 flex flex-col gap-6">
        {/* Required Documents */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#333]">Required Documents</h2>
          {renderDocCard('CV', cvStatus, badgeConfig, handleUploadClick, router)}
        </div>

        {/* Additional Documents and Details */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#333]">Additional Documents and Details</h2>
          <div className="flex flex-col gap-2">
            {renderDocCard('Passport', passportStatus, badgeConfig, handleUploadClick, router)}
            {renderDocCard('Certificates', 'default', badgeConfig, handleUploadClick, router)}
            {renderBankAccount()}
          </div>
        </div>

        {/* Documents Uploaded Section (Dynamic) */}
        {certificates.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <h2 className="font-heading font-medium text-[16px] text-[#313131]">Documents Uploaded</h2>
            {certificates.map(cert => (
              <UploadedCertificateCard 
                key={cert.id} 
                cert={cert} 
                router={router}
                onEditClick={(c) => handleUploadClick('certificate', c)}
                onDeleteClick={(c) => {
                  const updated = certificates.filter(certItem => certItem.id !== c.id);
                  setCertificates(updated);
                  localStorage.setItem('certificates', JSON.stringify(updated));
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Certificates */}
      {!uploadSheetOpen && (
        <div className="fixed bottom-6 right-0 left-0 max-w-[412px] mx-auto z-40 pointer-events-none px-6 flex justify-end">
          <div className="bg-[rgba(255,255,255,0.8)] border border-[#e9e9ea] p-2 rounded-[24px] pointer-events-auto backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.1)] animate-fade-in-up">
            <button 
              onClick={() => handleUploadClick('certificate')}
              className="w-12 h-12 bg-[#1a1d26] rounded-[16px] flex items-center justify-center hover:bg-[#2a2e3d] shadow-md transition-transform active:scale-95"
            >
              <RiUpload2Line size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Certificate Bottom Sheet */}
      {uploadSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center sm:px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => {
              setUploadSheetOpen(false);
              setCertificateName('');
              setPendingFile(null);
              setEditingCertId(null);
            }} 
          />
          <div className="relative bg-white rounded-t-[32px] sm:rounded-[32px] sm:mb-8 w-full max-w-[412px] pb-8 pt-6 px-4 shadow-2xl animate-slide-up">
            <div className="w-[108px] h-1 bg-[#1d1b20] rounded-full mx-auto mb-8 opacity-20" />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="font-sans font-medium text-[16px] text-[#313131] flex gap-1 items-center">
                  Document Name <span className="text-[#ef4444] text-[16px]">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="eg. Seaman certificate"
                    className="w-full h-11 px-3 py-2 border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]"
                    autoFocus
                  />
                </div>
              </div>
              <button 
                onClick={confirmCertificateUpload}
                disabled={!certificateName.trim()}
                className="w-full py-3 px-4 bg-[#1a1d26] disabled:bg-[#1a1d26]/50 rounded-lg flex items-center justify-center shadow-sm hover:bg-[#2a2e3d] transition-colors"
              >
                <span className="font-sans font-medium text-[14px] text-white">Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
