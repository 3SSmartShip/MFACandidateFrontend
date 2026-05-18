'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiLoader4Line } from '@remixicon/react';
import { getDocumentDetail } from '@/api/dashboard';
import AppHeader from './AppHeader';

export default function ViewDataFields() {
  const searchParams = useSearchParams();
  const sectionSlug = searchParams.get('section');
  const docId = searchParams.get('docId');
  const [orgId, setOrgId] = useState(null);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

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
      window.location.href = '/candidate/login';
    }
  }

  useEffect(() => {
    if (!orgId || !docId) return;
    async function fetchDoc() {
      try {
        const data = await getDocumentDetail(orgId, docId);
        setDoc(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [orgId, docId]);

  function findSection(data) {
    if (!data?.docStructuredData) return null;
    const sd = data.docStructuredData;

    if (sd.sections) {
      for (const s of sd.sections) {
        if (s.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') === sectionSlug) {
          return {
            name: s.name,
            type: 'section',
            fields: (s.fields || []).map((f) => ({ label: f.name, value: String(f.value ?? '') })),
          };
        }
      }
    }

    if (sd.tables) {
      for (const t of sd.tables) {
        if (t.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') === sectionSlug) {
          return {
            name: t.title,
            type: 'table',
            headers: t.headers || [],
            rows: t.rows || [],
          };
        }
      }
    }

    return null;
  }

  const section = loading || !sectionSlug ? null : findSection(doc);

  if (loading || !sectionSlug || !section) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#e9e9ea] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#e9e9ea] animate-pulse" />
            <div className="w-px h-6 bg-[#e9e9ea]"></div>
            <div className="h-4 w-24 bg-[#e9e9ea] rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-[#e9e9ea] rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <RiLoader4Line size={24} className="text-[#313131] animate-spin" />
          ) : (
            <p className="font-sans text-[14px] text-[#666]">Section not found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
      <AppHeader onLogout={handleLogout} />

      <div className="bg-[#f5f5f7] px-5 py-6" style={{ marginTop: '96px' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-px">
            <h1 className="font-heading font-semibold text-[24px] text-[#333] leading-[32px]">
              View Data
            </h1>
            <p className="font-sans font-normal text-[12px] text-[#333] leading-[16px] tracking-[0.4px]">
              {doc?.fileName || `${doc?.documentType || 'document'}.pdf`}
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

        <div className="flex-1 flex flex-col gap-4 p-4 overflow-x-auto">
          {section.type === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f5f5f7]">
                    {section.headers.map((h, i) => (
                      <th key={i} className="border border-[#e9e9ea] px-2 py-1.5 text-left font-heading font-medium text-[12px] text-[#4f5657] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-[#e9e9ea] px-2 py-1.5 font-sans text-[12px] text-[#313131] whitespace-nowrap">
                          {cell || '\u2014'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            section.fields.length === 0 ? (
              <p className="font-sans text-[14px] text-[#666] text-center py-10">No fields available.</p>
            ) : (
              section.fields.map((field, index) => (
                <div key={index} className="flex flex-col gap-2 w-full">
                  <div className="flex items-center w-full">
                    <p className="font-heading font-medium text-[16px] text-[#4f5657] leading-[1.2] tracking-[0.15px]">
                      {field.label}
                    </p>
                  </div>
                  <div className="bg-white border border-[#e6e6e6] flex items-center min-h-[36px] overflow-clip px-3 py-1 rounded-lg w-full">
                    <p className="flex-1 font-sans font-medium text-[14px] text-[#79797e] leading-[1.6] tracking-[0.1px] break-words">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))
            )
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
