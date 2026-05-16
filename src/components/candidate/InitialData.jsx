'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RiEyeOffLine, RiEyeLine } from '@remixicon/react';
import { onboardCandidate } from '@/api/onboard';

export default function InitialData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAutoSyncing = searchParams.get('syncing') === 'true';

  useEffect(() => {
    const inviteToken = searchParams.get('t');
    if (inviteToken && typeof window !== 'undefined') {
      localStorage.setItem('invite-token', inviteToken);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    passportId: '',
    password: '',
    rePassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isAutoSyncing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setFormData({
          name: 'Abhyuday Deshpande',
          dob: '1990-01-01',
          passportId: 'P1234567',
          password: '',
          rePassword: ''
        });
        setIsSyncing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAutoSyncing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSyncing(true);

    try {
      const inviteToken = typeof window !== 'undefined' ? localStorage.getItem('invite-token') : null;
      if (!inviteToken) {
        setSubmitError('Missing invitation token. Please use the invitation link.');
        setIsSyncing(false);
        return;
      }

      const res = await onboardCandidate({
        inviteToken,
        passportId: formData.passportId,
        fullName: formData.name,
        dateOfBirth: formData.dob,
      });

      const { orgId, directoryId } = res;

      if (typeof window !== 'undefined') {
        localStorage.setItem('orgId', orgId);
        localStorage.setItem('directoryId', directoryId);
        localStorage.setItem('passportUploaded', 'true');
      }

      router.push('/candidate/dashboard');
    } catch (err) {
      setSubmitError(err?.response?.data?.error || err.message || 'Onboarding failed. Please try again.');
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative pb-10">
      {/* Progress Bar */}
      <div className="flex gap-1 w-full px-[20px] py-[2px] mt-14 mb-14">
        <div className="h-1 flex-1 rounded-full bg-[#ccc]" />
        <div className="h-1 flex-1 rounded-full bg-[#ccc]" />
        <div className="h-1 flex-1 rounded-full bg-[#050608]" />
      </div>

      <div className="flex-1 flex flex-col w-full px-[40px] mx-auto">
        <div className="flex flex-col gap-4 items-center w-full mb-10">
          <div className="w-10 h-10 shrink-0">
            <img src="/Thumbnail.svg" alt="Thumbnail" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 items-center w-full text-center">
            <h1 className="font-heading font-semibold text-[24px] leading-[32px] text-[#313131]">
              Lets Get Your Initial Data
            </h1>
            <p className="font-sans font-normal text-[14px] leading-[20px] tracking-[0.25px] text-[#666]">
              Add the details for passport, name and DOB
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Name */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Name</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" 
              placeholder="Enter your name" 
            />
          </div>

          {/* Date Of Birth */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Date Of Birth</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" 
              placeholder="Enter your date of birth" 
            />
          </div>

          {/* Passport Id */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Passport Id</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <input 
              type="text" 
              name="passportId"
              value={formData.passportId}
              onChange={handleChange}
              className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" 
              placeholder="Enter your passport id" 
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Password</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[36px] pl-3 pr-10 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" 
                placeholder="Enter your password" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
                {showPassword ? <RiEyeLine size={16} /> : <RiEyeOffLine size={16} />}
              </button>
            </div>
          </div>

          {/* Re-enter Password */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 items-center">
              <label className="font-heading font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#313131]">Re-enter Password</label>
              <span className="text-[#EF4444]">*</span>
            </div>
            <div className="relative">
              <input 
                type={showRePassword ? 'text' : 'password'} 
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange}
                className="w-full h-[36px] pl-3 pr-10 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]" 
                placeholder="Enter your password" 
              />
              <button type="button" onClick={() => setShowRePassword(!showRePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
                {showRePassword ? <RiEyeLine size={16} /> : <RiEyeOffLine size={16} />}
              </button>
            </div>
          </div>

          {submitError && (
            <p className="font-sans text-[12px] leading-[16px] text-[#EF4444] text-center">{submitError}</p>
          )}

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isSyncing}
              className={`w-full py-3 px-4 rounded-lg shadow-sm font-sans font-medium text-[14px] flex items-center justify-center gap-2 transition-all ${isSyncing ? 'bg-[#9CA3AF] text-white cursor-not-allowed' : 'bg-[#1a1d26] hover:bg-[#2a2e3d] text-white'}`}
            >
              {isSyncing ? (
                <>
                  Syncing... <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
