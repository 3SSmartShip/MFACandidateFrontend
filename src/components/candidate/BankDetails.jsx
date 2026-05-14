'use client';
import React from 'react';
import Link from 'next/link';
import Select from 'react-select';
import { RiArrowLeftLine, RiLogoutBoxLine } from '@remixicon/react';
import { getData } from 'country-list';

const countryOptions = getData().map(({ code, name }) => ({
  value: code,
  label: name,
}));

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '36px',
    height: '36px',
    borderRadius: '8px',
    borderColor: state.isFocused ? '#1a1d26' : '#e9e9ea',
    boxShadow: state.isFocused ? '0 0 0 2px #1a1d26' : 'none',
    '&:hover': { borderColor: '#e9e9ea' },
    backgroundColor: '#ffffff',
    paddingLeft: '0',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 12px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#666',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
  }),
  singleValue: (base) => ({
    ...base,
    color: '#313131',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: '#313131',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#666',
    padding: '0 8px',
    '&:hover': { color: '#666' },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    border: '1px solid #e9e9ea',
    boxShadow: '0px 4px 14px rgba(0,0,0,0.1)',
    marginTop: '4px',
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '200px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f5f5f7' : 'transparent',
    color: '#313131',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: state.isSelected ? 600 : 500,
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#e9e9ea' },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#666',
  }),
};

export default function BankDetails() {
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

      <div className="bg-[#f5f5f7] px-5 pt-10 pb-6">
        <h1 className="font-heading font-semibold text-[24px] text-[#313131] leading-[32px]">
          Bank Details
        </h1>
      </div>

      <div className="bg-white border-t border-[#e9e9ea] px-5 py-6 flex-1">
        <form className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">Bank Name</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input type="text" className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="eg. HDFC Bank" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">Account Holder Name</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input type="text" className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="As per bank records" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">Account Number</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input type="text" className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="Enter account number" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">Country</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <Select
              options={countryOptions}
              placeholder="Select bank's country"
              isClearable
              isSearchable
              styles={selectStyles}
              className="w-full"
              classNamePrefix="country-select"
              noOptionsMessage={() => 'No countries found'}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">SWIFT Code</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input type="text" className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="Enter your swift code" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]">IFSC Code</label>
            </div>
            <input type="text" className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" placeholder="eg. HDFC0001234" />
          </div>
        </form>
      </div>

      <div className="bg-white border-t border-b border-[#e9e9ea] px-5 py-6">
        <div className="flex gap-3">
          <Link href="/candidate/dashboard" className="flex-1">
            <button type="button" className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
              <RiArrowLeftLine size={16} />
              Back
            </button>
          </Link>
          <button type="button" className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
