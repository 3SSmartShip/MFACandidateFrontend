'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RiArrowLeftLine, RiEditBoxLine, RiLogoutBoxLine, RiLoader4Line } from '@remixicon/react';
import { getDocumentDetail } from '@/api/dashboard';

export default function ViewDataFields() {
  const searchParams = useSearchParams();
  const sectionId = searchParams.get('section');
  const docId = searchParams.get('docId');
  const [orgId, setOrgId] = useState(null);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('orgId');
    setOrgId(stored);
  }, []);

  useEffect(() => {
    if (!orgId || !docId) {
      setLoading(false);
      return;
    }
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

  let section = null;
  if (doc?.docStructuredData && typeof doc.docStructuredData === 'object') {
    const entries = Object.entries(doc.docStructuredData);
    for (const [key, value] of entries) {
      const slug = key.toLowerCase().replace(/\s+/g, '-');
      if (slug === sectionId) {
        section = {
          name: key.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          fields:
            typeof value === 'object' && !Array.isArray(value)
              ? Object.entries(value).map(([k, v]) => ({ label: k, value: String(v ?? '') }))
              : [{ label: key, value: String(value ?? '') }],
        };
        break;
      }
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative items-center justify-center gap-3">
        <RiLoader4Line size={24} className="text-[#313131] animate-spin" />
        <p className="font-sans text-[14px] text-[#666]">Loading...</p>
      </div>
    );
  }

  if (!section) {
    section = {
      name: 'Section',
      fields: [],
    };
  }

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

        <div className="flex-1 flex flex-col gap-4 p-4">
          {section.fields.length === 0 ? (
            <p className="font-sans text-[14px] text-[#666] text-center py-10">No fields available.</p>
          ) : (
            section.fields.map((field, index) => (
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
            ))
          )}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-[2px] border-t border-b border-[#e9e9ea] px-5 py-6">
        <div className="flex gap-3">
          <Link
            href={`/candidate/view-data${docId ? `?docId=${docId}` : ''}`}
            className="flex-1"
          >
            <button
              type="button"
              className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
            >
              <RiArrowLeftLine size={16} />
              Back
            </button>
          </Link>
          <Link href="/candidate/dashboard" className="flex-1">
            <button
              type="button"
              className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
            >
              Ready
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
