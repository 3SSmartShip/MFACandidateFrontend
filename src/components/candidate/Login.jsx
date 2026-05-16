'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPhoneOtp, verifyPhoneOtp } from '@/api/auth';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const countries = [
  { dial: '+1', code: 'US', name: 'United States/Canada' },
  { dial: '+91', code: 'IN', name: 'India' },
  { dial: '+44', code: 'GB', name: 'United Kingdom' },
  { dial: '+61', code: 'AU', name: 'Australia' },
  { dial: '+81', code: 'JP', name: 'Japan' },
  { dial: '+86', code: 'CN', name: 'China' },
  { dial: '+49', code: 'DE', name: 'Germany' },
  { dial: '+33', code: 'FR', name: 'France' },
  { dial: '+39', code: 'IT', name: 'Italy' },
  { dial: '+34', code: 'ES', name: 'Spain' },
  { dial: '+55', code: 'BR', name: 'Brazil' },
  { dial: '+971', code: 'AE', name: 'UAE' },
  { dial: '+966', code: 'SA', name: 'Saudi Arabia' },
  { dial: '+974', code: 'QA', name: 'Qatar' },
  { dial: '+65', code: 'SG', name: 'Singapore' },
  { dial: '+82', code: 'KR', name: 'South Korea' },
  { dial: '+7', code: 'RU', name: 'Russia' },
  { dial: '+52', code: 'MX', name: 'Mexico' },
  { dial: '+63', code: 'PH', name: 'Philippines' },
];

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const e164Number = useMemo(() => {
    if (!phoneDigits) return '';
    const raw = `${selectedCountry.dial}${phoneDigits}`;
    try {
      const parsed = parsePhoneNumber(raw, selectedCountry.code);
      return parsed?.number || raw;
    } catch {
      return raw;
    }
  }, [selectedCountry, phoneDigits]);

  const handleSubmitPhone = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneDigits) {
      setError('Please enter a phone number');
      return;
    }

    if (!isValidPhoneNumber(e164Number)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await sendPhoneOtp(e164Number);
      setPhone(e164Number);
      setStep('otp');
    } catch (err) {
      if (err.message === 'Supabase is not configured') {
        setError('Supabase is not configured. Please check your environment variables.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }


  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const token = otp.join('');
    if (token.length !== 6) return;

    setLoading(true);
    try {
      await verifyPhoneOtp(phone, token);
      router.push('/candidate/initial-data');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
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
                <div className="flex gap-2 w-full">
                  <div className="relative">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const country = countries.find(c => c.code === e.target.value);
                        setSelectedCountry(country || countries[0]);
                        if (error) setError('');
                      }}
                      className="w-[80px] h-[36px] pl-2.5 pr-5 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] leading-[20px] text-[#313131] appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a1d26] focus:border-transparent transition-all cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.dial}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#313131" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneDigits}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setPhoneDigits(digits);
                      if (error) setError('');
                    }}
                    className="flex-1 h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26] focus:border-transparent transition-all"
                    placeholder="Phone number"
                  />
                </div>
                {error && (
                  <p className="font-sans text-[12px] leading-[16px] text-[#EF4444]">{error}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full mt-auto pt-20">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg shadow-sm font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Submit'}
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
                  Code sent to {(() => { try { const p = parsePhoneNumber(phone); return p?.formatInternational() || phone; } catch { return phone; } })()}
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col flex-1 mt-16">
              <div className="flex flex-col gap-2 items-center w-full">
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
                {error && (
                  <p className="font-sans text-[12px] leading-[16px] text-[#EF4444]">{error}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full mt-auto pt-20">
                <button
                  id="verify-otp-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1a1d26] rounded-lg shadow-sm font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmitPhone}
                  className="w-full py-3 px-4 rounded-lg font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#313131] flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
