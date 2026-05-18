'use client';
import React from 'react';
import { RiLogoutBoxLine } from '@remixicon/react';

export default function AppHeader({ logoUrl, orgName, onLogout }) {
  return (
    <div className="fixed top-0 z-10 flex items-center justify-between px-5 pt-14 pb-4 border-b border-[#e9e9ea] bg-white w-full max-w-[412px]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
          <img src={logoUrl || '/Thumbnail.svg'} alt="Company Logo" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = '/Thumbnail.svg'; }} />
        </div>
        <div className="w-px h-6 bg-[#e9e9ea]"></div>
        <span className="font-sans font-medium text-[16px] text-[#313131]">{orgName || 'Company'}</span>
      </div>
      <button
        onClick={onLogout}
        className="w-10 h-10 text-[#666] border border-[#e9e9ea] rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
      >
        <RiLogoutBoxLine size={20} />
      </button>
    </div>
  );
}
