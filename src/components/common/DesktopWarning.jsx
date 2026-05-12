import React from 'react';

export default function DesktopWarning() {
  return (
    <div className="hidden md:flex fixed inset-0 z-[9999] bg-white items-center justify-center size-full">
      <div className="flex flex-col gap-10 items-center max-w-[645px] px-6 text-center">
        <div className="flex gap-3 items-center">
          <div className="shrink-0 w-[32px] h-[32px] relative">
            <img alt="MFA Thumbnail" className="w-full h-full object-contain" src="/Thumbnail.svg" />
          </div>
          <p className="font-heading font-semibold text-[22px] leading-[28px] whitespace-nowrap">
            <span className="text-[#313131]">MFA </span>
            <span className="text-[#666]">Candidate</span>
          </p>
        </div>
        
        <div className="flex flex-col gap-3 items-center w-full">
          <p className="font-heading font-semibold text-[22px] leading-[28px] text-[#050608] text-center w-full">
            Mobile experience only.
          </p>
          <p className="font-sans font-medium text-[16px] leading-[24px] tracking-[0.5px] text-[#333] text-center w-full">
            Scan the QR code or open this link on your smartphone to access the interface.
          </p>
        </div>
      </div>
    </div>
  );
}
