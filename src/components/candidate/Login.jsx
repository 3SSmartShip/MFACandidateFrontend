'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function Login() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleSubmitPhone = (e) => {
    e.preventDefault();
    if (phone) setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input automatically
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Verify OTP logic here
    window.location.href = '/candidate/initial-data';
  };

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10">
      {/* Progress Bar (approx y=56 in mobile layout) */}
      <div className="flex gap-1 w-full px-[20px] py-[2px] mt-14 mb-14">
        <div className={`h-1 flex-1 rounded-full ${step === 'phone' || step === 'otp' ? 'bg-[#050608]' : 'bg-[#ccc]'}`} />
        <div className={`h-1 flex-1 rounded-full ${step === 'otp' ? 'bg-[#050608]' : 'bg-[#ccc]'}`} />
        <div className="h-1 flex-1 rounded-full bg-[#ccc]" />
      </div>

      <div className="flex-1 flex flex-col w-full px-[40px] mx-auto">
        {step === 'phone' && (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="w-10 h-10 shrink-0">
                <img src="/Thumbnail.svg" alt="Thumbnail" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-1 items-center w-full text-center">
                <h1 className="font-heading font-semibold text-[24px] leading-[32px] text-[#313131]">
                  Welcome to Marine Form Automation
                </h1>
                <p className="font-heading font-semibold text-[24px] leading-[32px] text-[#666]">
                  Candidate Version
                </p>
              </div>
              <p className="font-sans font-normal text-[14px] leading-[20px] tracking-[0.25px] text-[#666] text-center mt-4">
                Enter your phone number to sign-in
              </p>
            </div>

            <form onSubmit={handleSubmitPhone} className="flex flex-col flex-1 mt-16">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-1 items-center w-full">
                  <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">
                    Phone Number
                  </label>
                  <span className="text-[#EF4444] text-[16px] leading-[24px]">*</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26] focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col gap-2 w-full mt-auto pt-20">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg shadow-sm font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131] flex items-center justify-center hover:bg-gray-100 transition-all"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="w-10 h-10 shrink-0">
                <img src="/Thumbnail.svg" alt="Thumbnail" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-1 items-center w-full text-center">
                <h1 className="font-heading font-semibold text-[24px] leading-[32px] text-[#313131]">
                  Enter Verification Code
                </h1>
                <p className="font-heading font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#666]">
                  Code sent to your phone number
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col flex-1 mt-16">
              <div className="flex justify-center items-center gap-[10px] w-full">
                <div className="flex gap-[12px]">
                  {[0, 1, 2].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-[41px] h-[60px] bg-white border border-[#e9e9ea] rounded-lg font-heading font-medium text-[24px] text-center text-[#313131] focus:outline-none focus:ring-2 focus:ring-[#1a1d26] transition-all"
                    />
                  ))}
                </div>
                <div className="w-[16px] h-[1px] bg-[#ccc]"></div>
                <div className="flex gap-[12px]">
                  {[3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-[41px] h-[60px] bg-white border border-[#e9e9ea] rounded-lg font-heading font-medium text-[24px] text-center text-[#313131] focus:outline-none focus:ring-2 focus:ring-[#1a1d26] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full mt-auto pt-20">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg shadow-sm font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all"
                >
                  Verify
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131] flex items-center justify-center hover:bg-gray-100 transition-all"
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
