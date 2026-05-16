'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiImageLine,
  RiLogoutBoxLine,
  RiLoader4Line,
  RiDownload2Line,
} from '@remixicon/react';
import { getDocumentUrl, getDocumentDetail } from '@/api/dashboard';

function getFileType(name) {
  const ext = name?.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(ext)) return 'image';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx'].includes(ext)) return 'sheet';
  if (['txt'].includes(ext)) return 'text';
  return 'other';
}

function getFileNameFromUrl(url) {
  try {
    const path = new URL(url).pathname;
    const segments = path.split('/');
    const last = segments[segments.length - 1];
    return decodeURIComponent(last);
  } catch {
    return 'document';
  }
}

export default function FilePreview() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get('docId');

  const [orgId, setOrgId] = useState(null);
  const [docUrl, setDocUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('orgId');
    setOrgId(stored);
  }, []);

  useEffect(() => {
    if (!orgId || !docId) {
      setFetchLoading(false);
      return;
    }
    async function fetchData() {
      try {
        const [{ url }] = await Promise.all([
          getDocumentUrl(orgId, docId),
          getDocumentDetail(orgId, docId),
        ]);
        setDocUrl(url);
        const name = getFileNameFromUrl(url);
        setFileName(name);
      } catch (e) {
        setError('Failed to load document');
      } finally {
        setFetchLoading(false);
      }
    }
    fetchData();
  }, [orgId, docId]);

  useEffect(() => {
    if (!docUrl) return;
    setContentLoading(true);
    const timer = setTimeout(() => setContentLoading(false), 8000);
    return () => clearTimeout(timer);
  }, [docUrl]);

  const fileType = getFileType(fileName);
  const isLoading = fetchLoading || (docUrl && contentLoading);

  const handleContentLoad = useCallback(() => {
    setContentLoading(false);
  }, []);

  const handleContentError = useCallback(() => {
    setContentLoading(false);
  }, []);

  function renderPreview() {
    if (!docUrl) return null;

    const commonProps = {
      onLoad: handleContentLoad,
      onError: handleContentError,
    };

    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full relative">
            {contentLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f4] z-10 rounded-[12px]">
                <div className="flex flex-col items-center gap-3">
                  <RiLoader4Line size={32} className="text-[#666] animate-spin" />
                  <p className="font-sans text-[14px] text-[#666]">Loading PDF...</p>
                </div>
              </div>
            )}
            <iframe
              src={docUrl}
              className="w-full h-full border-0"
              title={fileName}
              {...commonProps}
            />
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 bg-white border border-[#e9e9ea] rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm hover:bg-gray-50 text-[#313131] font-sans font-medium text-[12px]"
            >
              <RiDownload2Line size={14} />
              Download
            </a>
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            {contentLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f4] z-10 rounded-[12px]">
                <RiLoader4Line size={32} className="text-[#666] animate-spin" />
              </div>
            )}
            <img
              src={docUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-[12px]"
              {...commonProps}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full relative">
            {contentLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f4] z-10 rounded-[12px]">
                <div className="flex flex-col items-center gap-3">
                  <RiLoader4Line size={32} className="text-[#666] animate-spin" />
                  <p className="font-sans text-[14px] text-[#666]">Loading document...</p>
                </div>
              </div>
            )}
            <iframe
              src={docUrl}
              className="w-full h-full border-0"
              title={fileName}
              {...commonProps}
            />
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 bg-white border border-[#e9e9ea] rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm hover:bg-gray-50 text-[#313131] font-sans font-medium text-[12px]"
            >
              <RiDownload2Line size={14} />
              Download
            </a>
          </div>
        );
    }
  }

  function renderFileIcon() {
    switch (fileType) {
      case 'pdf':
        return <RiFilePdfLine size={64} className="text-[#ccc]" />;
      case 'image':
        return <RiImageLine size={64} className="text-[#ccc]" />;
      default:
        return <RiFileTextLine size={64} className="text-[#ccc]" />;
    }
  }

  if (!docId) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-sans text-[14px] text-[#666]">No document selected.</p>
        </div>
        <div className="px-5 pt-6 border-t border-[#e9e9ea] bg-white py-6">
          <Link href="/candidate/dashboard" className="block">
            <button
              type="button"
              className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <RiArrowLeftLine size={18} />
              Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10">
      <Header />

      <div className="px-5 pt-4 pb-4 border-b border-[#e9e9ea] flex justify-between items-center bg-[#F4F5F7]">
        <div className="min-w-px flex-1">
          <h1 className="font-heading font-semibold text-[24px] text-[#313131] truncate">
            {fetchLoading ? 'Loading...' : fileName || 'File Name'}
          </h1>
          <p className="font-sans font-normal text-[12px] text-[#666] truncate">
            {fetchLoading ? 'Loading...' : fileName || 'File Name.pdf'}
          </p>
        </div>
        {!fetchLoading && docUrl && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-12 h-12 bg-white border border-[#e9e9ea] rounded-xl shadow-sm flex items-center justify-center text-[#313131] hover:bg-gray-50 shrink-0 ml-3"
          >
            <RiDeleteBinLine size={20} />
          </button>
        )}
      </div>

      <div className="px-5 pt-6 flex-1 flex flex-col">
        {fetchLoading ? (
          <div className="w-full flex-1 bg-[#F4F5F7] rounded-xl flex items-center justify-center border border-[#e9e9ea]">
            <div className="flex flex-col items-center gap-3">
              <RiLoader4Line size={32} className="text-[#666] animate-spin" />
              <p className="font-sans text-[14px] text-[#666]">Loading document...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full flex-1 bg-[#F4F5F7] rounded-xl flex flex-col items-center justify-center gap-4 border border-[#e9e9ea]">
            {renderFileIcon()}
            <p className="font-sans text-[14px] text-[#666]">{error}</p>
            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1a1d26] text-white rounded-lg font-sans font-medium text-[14px] flex items-center gap-2 hover:bg-[#2a2e3d]"
              >
                <RiDownload2Line size={16} />
                Download instead
              </a>
            )}
          </div>
        ) : docUrl ? (
          <div className="w-full flex-1 bg-[#f4f4f4] rounded-[12px] overflow-hidden border border-[#e9e9ea] relative">
            {renderPreview()}
          </div>
        ) : (
          <div className="w-full flex-1 bg-[#F4F5F7] rounded-xl flex items-center justify-center border border-[#e9e9ea]">
            {renderFileIcon()}
          </div>
        )}
      </div>

      <div className="px-5 pt-6 mt-auto border-t border-[#e9e9ea] bg-white">
        <div className="flex gap-4">
          <Link href="/candidate/dashboard" className="flex-1">
            <button
              type="button"
              className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <RiArrowLeftLine size={18} />
              Back
            </button>
          </Link>
          <button
            type="button"
            disabled={fetchLoading || !docId}
            className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-xl font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all disabled:opacity-50"
          >
            {fetchLoading ? (
              <>
                <RiLoader4Line size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] flex flex-col gap-4 shadow-xl">
            <h2 className="font-heading font-semibold text-[24px] text-[#313131]">
              Delete {fileName || 'File'}?
            </h2>
            <p className="font-sans font-normal text-[14px] leading-[22px] text-[#313131]">
              This action cannot be undone. This will permanently delete this document and its relevant data.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-5 bg-white border border-[#e9e9ea] rounded-xl font-sans font-medium text-[14px] text-[#313131] hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  router.push('/candidate/dashboard');
                }}
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

function Header() {
  return (
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
  );
}
