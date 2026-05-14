import React, { useState, useRef, useEffect } from 'react';
import { RiMore2Fill, RiArrowRightSLine, RiEditBoxLine, RiDeleteBin5Line } from '@remixicon/react';

const badgeConfig = {
  processing: { bg: 'bg-[#dde6fd]', text: 'text-[#334f94]', label: 'Processing' },
  review: { bg: 'bg-[#fdecce]', text: 'text-[#935f07]', label: 'Review' },
  error: { bg: 'bg-[#fcdada]', text: 'text-[#bf3636]', label: 'Error' },
};

export default function UploadedCertificateCard({ cert, router, onEditClick, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const status = cert.status;
  const hasStatus = status && status !== 'completed';

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (hasStatus) {
    const badge = badgeConfig[status] || badgeConfig.processing;
    return (
      <div className="bg-white border border-[#e9e9ea] rounded-[16px] px-4 py-2 flex gap-3 items-center w-full">
        <div className="flex flex-col gap-1 flex-1 min-w-px">
          <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">{cert.name}</h3>
          <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">{cert.date || cert.fileName || 'Last Updated Date'}</p>
        </div>
        <div className={`px-3 py-2 rounded-full shrink-0 ${badge.bg}`}>
          <span className={`font-sans font-medium text-[11px] leading-[1.2] tracking-[0.5px] ${badge.text}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center self-stretch">
          <div className="flex gap-2.5 h-full items-start py-2">
            {status === 'review' ? (
              <button
                onClick={() => router?.push('/candidate/view-data')}
                className="border border-[#e9e9ea] rounded-lg p-2 flex items-center justify-center bg-white shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] shrink-0"
              >
                <RiArrowRightSLine size={16} className="text-[#313131]" />
              </button>
            ) : (
              <div className="border border-[#e9e9ea] rounded-lg p-2 flex items-center justify-center bg-white shrink-0">
                <RiArrowRightSLine size={16} className="text-[#313131]" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e9e9ea] rounded-[16px] px-4 py-2 flex items-center w-full relative">
      <div className="flex flex-col gap-1 flex-1 min-w-px">
        <h3 className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">{cert.name}</h3>
        <p className="font-sans font-normal text-[12px] leading-[16px] tracking-[0.4px] text-[#666]">{cert.date || cert.fileName || 'Last Updated Date'}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="border border-[#e9e9ea] rounded-lg p-2 flex items-center justify-center bg-white shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50"
        >
          <RiMore2Fill size={16} className="text-[#313131]" />
        </button>
        <button className="border border-[#e9e9ea] rounded-lg p-2 flex items-center justify-center bg-white shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] hover:bg-gray-50">
          <RiArrowRightSLine size={16} className="text-[#313131]" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 top-12 bg-white rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.09),0px_8px_5px_0px_rgba(0,0,0,0.05),0px_15px_6px_0px_rgba(0,0,0,0.01)] flex flex-col p-1 z-10 animate-fade-in-up min-w-[140px]"
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              if (onEditClick) onEditClick(cert);
            }}
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-[6px] text-left"
          >
            <RiEditBoxLine size={16} className="text-[#79797e]" />
            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#79797e]">Edit Form</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              if (onDeleteClick) onDeleteClick(cert);
            }}
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-[6px] text-left"
          >
            <RiDeleteBin5Line size={16} className="text-[#79797e]" />
            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#79797e]">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
