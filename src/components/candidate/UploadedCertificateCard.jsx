import React, { useState, useRef, useEffect } from 'react';
import { RiMore2Fill, RiArrowRightSLine, RiEditBoxLine, RiDeleteBin5Line } from '@remixicon/react';

export default function UploadedCertificateCard({ cert, onEditClick, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div className="bg-white border border-[#e9e9ea] rounded-2xl p-4 flex justify-between items-center relative shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-sans font-medium text-[16px] text-[#313131]">{cert.name}</h3>
        <p className="font-sans font-normal text-[12px] text-[#666]">{cert.date || cert.fileName || 'Last Updated Date'}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center border border-[#e9e9ea] rounded-lg hover:bg-gray-50 bg-white shadow-sm"
        >
          <RiMore2Fill size={16} className="text-[#313131]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-[#e9e9ea] rounded-lg hover:bg-gray-50 bg-white shadow-sm">
          <RiArrowRightSLine size={16} className="text-[#313131]" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute right-4 top-14 w-[140px] bg-white border border-[#e9e9ea] rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] flex flex-col p-1 z-10 animate-fade-in-up">
          <button 
            onClick={() => {
              setMenuOpen(false);
              if (onEditClick) onEditClick(cert);
            }}
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-left"
          >
            <RiEditBoxLine size={16} className="text-[#666]" />
            <span className="font-sans font-medium text-[14px] text-[#666]">Edit Form</span>
          </button>
          <button 
            onClick={() => {
              setMenuOpen(false);
              if (onDeleteClick) onDeleteClick(cert);
            }}
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-left"
          >
            <RiDeleteBin5Line size={16} className="text-[#666]" />
            <span className="font-sans font-medium text-[14px] text-[#666]">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
