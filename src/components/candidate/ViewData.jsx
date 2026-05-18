'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiArrowRightSLine, RiFileLine, RiCheckLine, RiLoader4Line } from '@remixicon/react';
import { getDocumentDetail } from '@/api/dashboard';
import { getMyProfile } from '@/api/auth';
import AppHeader from './AppHeader';

const badgeConfig = {
  review: 'bg-[rgba(245,158,11,0.32)]',
  completed: 'bg-[#b2e8d6]',
};

const statusConfig = {
  processing: { bg: 'bg-[#dde6fd]', text: 'text-[#334f94]', label: 'Processing' },
  review: { bg: 'bg-[#fdecce]', text: 'text-[#935f07]', label: 'Review' },
  success: { bg: 'bg-[#b2e8d6]', text: 'text-[#00704b]', label: 'Success' },
  error: { bg: 'bg-[#fcdada]', text: 'text-[#bf3636]', label: 'Error' },
};

export default function ViewData() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get('docId');
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('orgId');
    setOrgId(stored);

    const cachedOrgName = localStorage.getItem('orgName');
    const cachedLogoUrl = localStorage.getItem('orgLogoUrl');
    if (cachedOrgName) setOrgName(cachedOrgName);
    if (cachedLogoUrl) setLogoUrl(cachedLogoUrl);

    getMyProfile()
      .then((data) => {
        if (data?.org?.name) {
          setOrgName(data.org.name);
          localStorage.setItem('orgName', data.org.name);
        }
        if (data?.logoUrl) {
          setLogoUrl(data.logoUrl);
          localStorage.setItem('orgLogoUrl', data.logoUrl);
        }
      })
      .catch(() => {});
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

  useEffect(() => {
    if (!orgId || !docId) {
      return;
    }
    async function fetchDoc() {
      try {
        const data = await getDocumentDetail(orgId, docId);
        setDoc(data);
        const built = [];
        if (data.docStructuredData?.sections) {
          data.docStructuredData.sections.forEach((s, i) => {
            built.push({
              id: `section-${i}`,
              slug: s.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
              name: s.name,
              status: 'review',
              type: 'section',
              fields: (s.fields || []).map((f) => ({ label: f.name, value: String(f.value ?? '') })),
            });
          });
        }
        if (data.docStructuredData?.tables) {
          data.docStructuredData.tables.forEach((t, i) => {
            built.push({
              id: `table-${i}`,
              slug: t.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
              name: t.title,
              status: 'review',
              type: 'table',
              headers: t.headers || [],
              rows: t.rows || [],
            });
          });
        }
        setSections(built);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [orgId, docId]);

  const docStatus = doc ? statusConfig[doc.status] || statusConfig.review : null;

  if (loading) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <AppHeader logoUrl={logoUrl} orgName={orgName} onLogout={handleLogout} />
        <div className="bg-[#f5f5f7] px-5 py-6" style={{ marginTop: '96px' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-3 flex-1">
              <div className="h-8 w-28 bg-[#e9e9ea] rounded animate-pulse" />
              <div className="h-4 w-36 bg-[#e9e9ea] rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-[#e9e9ea] rounded-full animate-pulse" />
          </div>
        </div>
        <div className="bg-white flex-1 flex flex-col gap-2">
          <div className="border-b border-[#c5c7c9] flex h-14 items-center px-4">
            <div className="h-5 w-16 bg-[#e9e9ea] rounded animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-3 px-4 py-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#e6e6e6] rounded-xl px-4 py-3 flex flex-col gap-3 animate-pulse">
                <div className="h-5 w-32 bg-[#e9e9ea] rounded" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-12 bg-[#e9e9ea] rounded-full" />
                  <div className="h-5 w-5 bg-[#e9e9ea] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/60 border-t border-b border-[#e9e9ea] px-5 py-6">
          <div className="flex gap-3">
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-lg animate-pulse" />
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!docId || !doc) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <AppHeader logoUrl={logoUrl} orgName={orgName} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <RiLoader4Line size={24} className="text-[#313131] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
      <AppHeader logoUrl={logoUrl} orgName={orgName} onLogout={handleLogout} />

      <div className="bg-[#f5f5f7] px-5 py-6" style={{ marginTop: '96px' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-px">
            <h1 className="font-heading font-semibold text-[24px] text-[#333] leading-[32px]">
              View Data
            </h1>
            <p className="font-sans font-normal text-[12px] text-[#333] leading-[16px] tracking-[0.4px]">
              {doc.fileName || `${doc.documentType}.pdf`}
            </p>
          </div>
          {docStatus && (
            <div className={`flex items-center gap-1 px-2 py-1.5 rounded-full shrink-0 ${docStatus.bg}`}>
              <span className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${docStatus.text}`}>
                {docStatus.label}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white flex-1 flex flex-col gap-2">
        <div className="border-b border-[#c5c7c9] flex h-14 items-center px-4 shrink-0">
          <p className="font-heading font-medium text-[16px] text-[#4f5657] leading-[24px] tracking-[0.15px]">
            Sections
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-x-clip overflow-y-auto px-4 py-3">
          {sections.length === 0 ? (
            <p className="font-sans text-[14px] text-[#666] text-center py-10">No extracted data available.</p>
          ) : (
            sections.map((section) => (
              <Link
                key={section.id}
                href={`/candidate/view-data/fields?section=${section.slug}&docId=${docId}`}
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
                      section.status === 'completed' ? badgeConfig.completed : badgeConfig.review
                    }`}
                  >
                    <span
                      className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${
                        section.status === 'completed' ? 'text-[#00704b]' : 'text-[#8b5b0b]'
                      }`}
                    >
                      {section.type === 'table' ? section.rows?.length || 0 : section.fields?.length || 0}
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
            ))
          )}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-[2px] border-t border-b border-[#e9e9ea] px-5 py-6">
        <div className="flex">
          <Link href="/candidate/dashboard" className="w-full">
            <button
              type="button"
              className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
            >
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
