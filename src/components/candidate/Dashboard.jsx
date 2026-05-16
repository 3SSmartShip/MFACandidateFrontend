'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiUpload2Line,
  RiEyeLine,
  RiArrowRightSLine,
  RiSearchLine,
  RiLoader4Line,
} from '@remixicon/react';
import { getDocuments, uploadDocuments } from '@/api/dashboard';
import { getDirectory } from '@/api/directory';
import { getMyProfile } from '@/api/auth';
import UploadedCertificateCard from './UploadedCertificateCard';
import AppHeader from './AppHeader';

function Spinner({ size = 16, className = '' }) {
  return <RiLoader4Line size={size} className={`animate-spin ${className}`} />;
}

export default function Dashboard() {
  const [orgId, setOrgId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [docs, setDocs] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadType, setUploadType] = useState(null);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [certificateName, setCertificateName] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  const [uploadingType, setUploadingType] = useState(null);
  const [error, setError] = useState('');

  const router = useRouter();
  const fileInputRef = useRef(null);
  const pollingRef = useRef({});

  const getDoc = useCallback((type) => docs.find((d) => d.documentType === type) || null, [docs]);
  const getCerts = useCallback(() => docs.filter((d) => d.documentType === 'certificate'), [docs]);

  useEffect(() => {
    const storedOrgId = localStorage.getItem('orgId');
    setOrgId(storedOrgId);
    if (storedOrgId) {
      getDirectory(storedOrgId).then((data) => {
        if (data?.fullname) setFullName(data.fullname);
      }).catch(() => {});
    }
    getMyProfile().then((data) => {
      if (data?.org?.name) setOrgName(data.org.name);
      if (data?.logoUrl) setLogoUrl(data.logoUrl);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!orgId) return;
    async function fetchDocs() {
      try {
        const data = await getDocuments(orgId);
        if (Array.isArray(data)) {
          setDocs(data);
          localStorage.setItem('documents', JSON.stringify(data));
        }
      } catch (e) {
      } finally {
        setPageLoading(false);
      }
    }
    fetchDocs();
  }, [orgId]);

  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
    };
  }, []);

  function startPolling(batchId) {
    if (pollingRef.current[batchId]) return;
    pollingRef.current[batchId] = setInterval(async () => {
      try {
        const batchDocs = await getDocuments(orgId, { batchId });
        if (Array.isArray(batchDocs) && batchDocs.length > 0) {
          setDocs((prev) => {
            const updated = [...prev];
            batchDocs.forEach((newDoc) => {
              const idx = updated.findIndex((d) => d.id === newDoc.id);
              if (idx >= 0) {
                updated[idx] = { ...updated[idx], ...newDoc, documentType: newDoc.documentType || updated[idx].documentType };
              } else {
                updated.push(newDoc);
              }
            });
            localStorage.setItem('documents', JSON.stringify(updated));
            return updated;
          });
          const allDone = batchDocs.every((d) => d.status !== 'processing' && d.status !== 'ready');
          if (allDone) {
            clearInterval(pollingRef.current[batchId]);
            delete pollingRef.current[batchId];
            setUploadingType(null);
          }
        }
      } catch (e) {
        clearInterval(pollingRef.current[batchId]);
        delete pollingRef.current[batchId];
        setUploadingType(null);
      }
    }, 20000);
  }

  async function handleUploadClick(type, certToUpdate = null) {
    setError('');
    setUploadType(type);
    if (certToUpdate) {
      setEditingCertId(certToUpdate.id);
      setCertificateName(certToUpdate.name);
      setPendingFile(null);
      setUploadSheetOpen(true);
    } else if (type === 'certificate') {
      if (fileInputRef.current) fileInputRef.current.click();
    } else {
      if (fileInputRef.current) fileInputRef.current.click();
    }
  }

  async function performUpload(file, type) {
    if (!orgId) return;
    setUploadingType(type);
    setError('');
    const formData = new FormData();
    formData.append('files', file);
    try {
      const result = await uploadDocuments(orgId, formData);
      if (result?.batchId) {
        if (result.docs?.length) {
          const tempDocs = result.docs.map((d) => ({
            id: d.id,
            documentType: type,
            status: 'processing',
            batchId: result.batchId,
            version: 1,
            isLatest: false,
            createdAt: new Date().toISOString(),
          }));
          setDocs((prev) => {
            const updated = [...prev];
            tempDocs.forEach((newDoc) => {
              const idx = updated.findIndex((d) => d.id === newDoc.id);
              if (idx >= 0) updated[idx] = newDoc;
              else updated.push(newDoc);
            });
            localStorage.setItem('documents', JSON.stringify(updated));
            return updated;
          });
        }
        startPolling(result.batchId);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
      setUploadingType(null);
    }
  }

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (uploadType === 'certificate') {
      setPendingFile(file);
      setCertificateName(file.name.split('.')[0]);
      setUploadSheetOpen(true);
    } else {
      await performUpload(file, uploadType);
    }
    e.target.value = '';
  }

  async function confirmCertificateUpload() {
    if (!pendingFile) return;
    const nameToUse = certificateName.trim() || pendingFile.name.split('.')[0];
    await performUpload(pendingFile, 'certificate');
    setUploadSheetOpen(false);
    setCertificateName('');
    setPendingFile(null);
    setEditingCertId(null);
  }

  function handleEditCertificate(cert) {
    handleUploadClick('certificate', cert);
  }

  async function handleDeleteCertificate(cert) {
    setDocs((prev) => {
      const updated = prev.filter((d) => d.id !== cert.id);
      localStorage.setItem('documents', JSON.stringify(updated));
      return updated;
    });
  }

  function handleEyeClick(docId) {
    router.push(`/candidate/document?docId=${docId}`);
  }

  async function handleLogout() {
    try {
      const { candidateLogout } = await import('@/api/auth');
      await candidateLogout();
    } catch (e) {
    } finally {
      localStorage.clear();
      router.push('/candidate/login');
    }
  }

  const badges = {
    processing: { bg: 'bg-[#dde6fd]', text: 'text-[#334f94]', label: 'Processing' },
    review: { bg: 'bg-[#fdecce]', text: 'text-[#935f07]', label: 'Review' },
    error: { bg: 'bg-[#fcdada]', text: 'text-[#bf3636]', label: 'Error' },
    success: { bg: 'bg-[#b2e8d6]', text: 'text-[#00704b]', label: 'Success' },
  };

  function renderDocCard(title, docType, onUpload) {
    const doc = getDoc(docType);
    const status = doc?.status || null;
    const isNotUploaded = !status;
    const showBadge = status && status !== 'success';
    if (isNotUploaded) {
      if (title === 'CV') {
        return (
          <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-6 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">CV</h3>
                <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">Upload your resume</p>
              </div>
            </div>
            <button
              onClick={() => onUpload('resume')}
              disabled={uploadingType === 'resume'}
              className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-[#2a2e3d] transition-all disabled:opacity-60"
            >
              {uploadingType === 'resume' ? (
                <Spinner size={16} className="text-white" />
              ) : (
                <div className="flex items-center p-[2px]">
                  <RiUpload2Line size={16} className="text-white" />
                </div>
              )}
              <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white">
                {uploadingType === 'resume' ? 'Uploading...' : 'Upload CV'}
              </span>
            </button>
          </div>
        );
      }

      if (title === 'Passport') {
        return (
          <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-4 py-2 flex gap-3 items-stretch w-full">
            <div className="flex flex-col gap-1 flex-1 min-w-px justify-center">
              <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Passport</h3>
              <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">Last Updated Date</p>
            </div>
            <div className="flex items-center self-stretch">
              <div className="flex gap-2.5 h-full items-start py-2">
                <button
                  onClick={() => onUpload('passport')}
                  disabled={uploadingType === 'passport'}
                  className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50 shrink-0 disabled:opacity-60"
                >
                  {uploadingType === 'passport' ? (
                    <Spinner size={16} className="text-[#313131]" />
                  ) : (
                    <div className="flex items-center p-[2px]">
                      <RiUpload2Line size={16} className="text-[#313131]" />
                    </div>
                  )}
                  <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">
                    {uploadingType === 'passport' ? 'Uploading...' : 'Upload'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="bg-white border border-[#e9e9ea] rounded-[16px] p-4 flex flex-col gap-3">
        <div className="relative w-full">
          <div className="flex gap-3 items-center w-full" style={{ paddingRight: doc ? '44px' : '0' }}>
            <div className="flex flex-col gap-1 flex-1 min-w-px">
              <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">{title}</h3>
              <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">
                {doc?.fileName || `${title}.pdf`}
              </p>
            </div>
            {showBadge && (
              <div className={`px-3 py-2 rounded-full shrink-0 ${badges[status]?.bg || badges.processing.bg}`}>
                <span className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${badges[status]?.text || badges.processing.text}`}>
                  {badges[status]?.label || status}
                </span>
              </div>
            )}
          </div>
          {doc && (
            <button
              onClick={() => handleEyeClick(doc.id)}
              className="absolute top-[6px] right-0 bg-white border border-[#e9e9ea] rounded-lg shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] h-8 w-8 flex items-center justify-center hover:bg-gray-50"
            >
              <RiEyeLine size={16} className="text-[#666]" />
            </button>
          )}
        </div>
        {status === 'processing' && (
          <button disabled className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center gap-2 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
            <Spinner size={14} className="text-[#313131]" />
            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">Processing</span>
          </button>
        )}
        {status === 'review' && (
          <button
            onClick={() => router.push(`/candidate/view-data?docId=${doc.id}`)}
            className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50 transition-all"
          >
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
        {status === 'success' && (
          <button
            onClick={() => onUpload(docType === 'resume' ? 'resume' : 'passport')}
            disabled={uploadingType === docType}
            className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50 transition-all disabled:opacity-60"
          >
            {uploadingType === docType ? (
              <Spinner size={16} className="text-[#313131]" />
            ) : (
              <div className="flex items-center p-[2px]">
                <RiUpload2Line size={16} className="text-[#313131]" />
              </div>
            )}
            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">
              {uploadingType === docType ? 'Uploading...' : `Update ${title}`}
            </span>
          </button>
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

  const uploadedStatuses = ['processing', 'review', 'error', 'success'];
  const isAnyUploaded = docs.some((d) => uploadedStatuses.includes(d.status));

  if (pageLoading) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative overflow-x-hidden">
        <AppHeader logoUrl={logoUrl} orgName={orgName} onLogout={handleLogout} />
        <div className="flex-1 px-5 pt-28 pb-6 flex flex-col gap-6">
          <div className="space-y-2">
            <div className="h-9 w-16 bg-[#e9e9ea] rounded animate-pulse" />
            <div className="h-9 w-40 bg-[#e9e9ea] rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-5 w-40 bg-[#e9e9ea] rounded animate-pulse" />
            <div className="h-[132px] bg-white border border-[#e9e9ea] rounded-[16px] p-4 flex flex-col gap-3 animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-16 bg-[#e9e9ea] rounded" />
                  <div className="h-4 w-28 bg-[#e9e9ea] rounded" />
                </div>
                <div className="h-8 w-8 bg-[#e9e9ea] rounded-lg" />
              </div>
              <div className="h-11 w-full bg-[#e9e9ea] rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-5 w-52 bg-[#e9e9ea] rounded animate-pulse" />
            <div className="h-14 bg-white border border-[#e9e9ea] rounded-[24px] px-4 animate-pulse flex items-center">
              <div className="flex-1 space-y-2">
                <div className="h-5 w-20 bg-[#e9e9ea] rounded" />
                <div className="h-4 w-28 bg-[#e9e9ea] rounded" />
              </div>
              <div className="h-8 w-20 bg-[#e9e9ea] rounded-lg" />
            </div>
            <div className="h-14 bg-white border border-[#e9e9ea] rounded-[24px] px-4 animate-pulse flex items-center">
              <div className="flex-1 space-y-2">
                <div className="h-5 w-24 bg-[#e9e9ea] rounded" />
                <div className="h-4 w-36 bg-[#e9e9ea] rounded" />
              </div>
              <div className="h-8 w-20 bg-[#e9e9ea] rounded-lg" />
            </div>
            <div className="h-14 bg-white border border-[#e9e9ea] rounded-[24px] px-4 animate-pulse flex items-center">
              <div className="flex-1 space-y-2">
                <div className="h-5 w-28 bg-[#e9e9ea] rounded" />
                <div className="h-4 w-32 bg-[#e9e9ea] rounded" />
              </div>
              <div className="h-8 w-20 bg-[#e9e9ea] rounded-lg" />
            </div>
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
        accept=".pdf"
      />

      <AppHeader logoUrl={logoUrl} orgName={orgName} onLogout={handleLogout} />

      <div className="px-5 pt-28 pb-6">
        <h1 className="font-heading font-semibold text-[36px] leading-[44px] text-[#333]">
          Hi,<br />
          <span className="text-[#666]">{fullName || 'User'}</span>
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
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-sans text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#333]">Required Documents</h2>
            {renderDocCard('CV', 'resume', handleUploadClick)}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#333]">Additional Documents and Details</h2>
            <div className="flex flex-col gap-2">
              {renderDocCard('Passport', 'passport', handleUploadClick)}
              <div className="bg-white border border-[#e9e9ea] rounded-[24px] px-4 py-2 flex gap-3 items-stretch w-full">
                <div className="flex flex-col gap-1 flex-1 min-w-px justify-center">
                  <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Certificates</h3>
                  <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">STCW, GMDSS, medical...</p>
                </div>
                <div className="flex items-center self-stretch">
                  <div className="flex gap-2.5 h-full items-start py-2">
                    <button
                      onClick={() => handleUploadClick('certificate')}
                      className="flex items-center gap-1 px-3 py-2 border border-[#e9e9ea] rounded-lg hover:bg-gray-50 shrink-0"
                    >
                      <div className="flex items-center p-[2px]">
                        <RiUpload2Line size={16} className="text-[#313131]" />
                      </div>
                      <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131]">
                        Upload
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {renderBankAccount()}
            </div>
          </div>

          {getCerts().length > 0 && (
            <div className="flex flex-col gap-4 mt-2">
              <h2 className="font-heading font-medium text-[16px] text-[#313131]">Documents Uploaded</h2>
              {getCerts().map((cert) => (
                <UploadedCertificateCard
                  key={cert.id}
                  cert={cert}
                  router={router}
                  onEyeClick={() => handleEyeClick(cert.id)}
                  onEditClick={(c) => handleEditCertificate(c)}
                  onDeleteClick={(c) => handleDeleteCertificate(c)}
                />
              ))}
            </div>
          )}
        </div>

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
                className="w-full py-3 px-4 bg-[#1a1d26] disabled:bg-[#1a1d26]/50 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-[#2a2e3d] transition-colors"
              >
                {uploadingType === 'certificate' && <Spinner size={16} className="text-white" />}
                <span className="font-sans font-medium text-[14px] text-white">
                  {uploadingType === 'certificate' ? 'Uploading...' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
