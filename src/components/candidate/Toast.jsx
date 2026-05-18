'use client';
import React, { useEffect } from 'react';
import { RiCloseLine, RiErrorWarningLine } from '@remixicon/react';

export default function Toast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up w-[calc(100%-32px)] max-w-[380px]">
      <div className="bg-[#1a1d26] text-white rounded-[12px] px-4 py-3 shadow-lg flex items-start gap-3">
        <RiErrorWarningLine size={18} className="text-[#EF4444] shrink-0 mt-0.5" />
        <p className="flex-1 font-sans text-[14px] leading-[20px]">{message}</p>
        <button onClick={onClose} className="shrink-0 p-0.5 hover:opacity-70">
          <RiCloseLine size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
