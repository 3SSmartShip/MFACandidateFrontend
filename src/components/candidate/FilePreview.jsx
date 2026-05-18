'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiImageLine,
  RiLoader4Line,
  RiDownload2Line,
} from '@remixicon/react';
import { getDocumentUrl, getDocumentDetail } from '@/api/dashboard';
import AppHeader from './AppHeader';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('orgId');
    setOrgId(stored);
  }, []);

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

  const loadingRef = useRef(null);

  useEffect(() => {
    if (!orgId || !docId) {
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
        await new Promise((r) => { loadingRef.current = setTimeout(r, 1500); });
      } catch (e) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { if (loadingRef.current) clearTimeout(loadingRef.current); };
  }, [orgId, docId]);

  const fileType = getFileType(fileName);

  function renderPreview() {
    if (!docUrl) return null;

    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full relative">
            <iframe
              src={docUrl}
              className="w-full h-full border-0"
              title={fileName}
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
            <img
              src={docUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-[12px]"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full relative">
            <iframe
              src={docUrl}
              className="w-full h-full border-0"
              title={fileName}
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

  const showSkeleton = loading;

  if (!docId || showSkeleton) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <AppHeader onLogout={handleLogout} />
        <div className="px-5 pt-4 pb-4 border-b border-[#e9e9ea] bg-[#F4F5F7]" style={{ marginTop: '96px' }}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-7 w-40 bg-[#e9e9ea] rounded animate-pulse" />
              <div className="h-4 w-28 bg-[#e9e9ea] rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-[#e9e9ea] rounded-xl animate-pulse shrink-0 ml-3" />
          </div>
        </div>
        <div className="px-5 pt-6 flex-1 flex flex-col">
          <div className="w-full flex-1 bg-[#F4F5F7] rounded-xl flex flex-col items-center justify-center gap-4 border border-[#e9e9ea]">
            <RiLoader4Line size={40} className="text-[#666] animate-spin" />
            <p className="font-sans text-[14px] text-[#666] animate-pulse">Loading document...</p>
          </div>
        </div>
        <div className="px-5 pt-6 border-t border-[#e9e9ea] bg-white py-6">
          <div className="flex gap-4">
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-xl animate-pulse" />
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10">
        <AppHeader onLogout={handleLogout} />

      <div className="px-5 pt-4 pb-4 border-b border-[#e9e9ea] bg-[#F4F5F7]" style={{ marginTop: '96px' }}>
        <h1 className="font-heading font-semibold text-[24px] text-[#313131] truncate">
          {fileName || 'File Name'}
        </h1>
        <p className="font-sans font-normal text-[12px] text-[#666] truncate">
          {fileName || 'File Name.pdf'}
        </p>
      </div>

      <div className="px-5 pt-6 flex-1 flex flex-col">
        {error ? (
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
            disabled={!docId}
            className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-xl font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>

    </div>
  );
}


