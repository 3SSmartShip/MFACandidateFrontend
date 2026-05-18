'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import {
  RiArrowLeftLine,
  RiMore2Fill,
  RiEditBoxLine,
  RiDeleteBin5Line,
  RiCloseLine,
  RiLoader4Line,
} from '@remixicon/react';
import { getData } from 'country-list';
import { createBankDetails, updateBankDetails, deleteBankDetails } from '@/api/bank-details';
import { getDirectory } from '@/api/directory';
import Toast from './Toast';
import AppHeader from './AppHeader';

const countryOptions = getData().map(({ code, name }) => ({
  value: code,
  label: name,
}));

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
  { value: 'THB', label: 'THB - Thai Baht' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
];

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

const inputClass =
  'w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg font-sans text-[14px] text-[#313131] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#1a1d26]';
const labelClass =
  'font-heading font-medium text-[16px] text-[#313131] leading-[24px] tracking-[0.15px]';

function FormField({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-1 items-center">
        <label className={labelClass}>{label}</label>
        {required && <span className="text-[#EF4444]">*</span>}
      </div>
      {children}
    </div>
  );
}

export default function BankDetails() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orgId, setOrgId] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  const [form, setForm] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    swiftCode: '',
    ifscCode: '',
    bankCountry: '',
    currency: '',
  });

  useEffect(() => {
    setMounted(true);
    const storedOrgId = localStorage.getItem('orgId');
    setOrgId(storedOrgId);
    if (storedOrgId) {
      getDirectory(storedOrgId).then((data) => {
        if (data?.bankDetails?.bankName) {
          setBankDetails(data.bankDetails);
          setForm(data.bankDetails);
        } else {
          setShowForm(true);
        }
      }).catch(() => {
        setShowForm(true);
      }).finally(() => {
        setPageLoading(false);
      });
    } else {
      setShowForm(true);
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function isFormValid() {
    return (
      form.bankName.trim() &&
      form.accountHolderName.trim() &&
      form.accountNumber.trim() &&
      form.swiftCode.trim() &&
      form.bankCountry &&
      form.currency
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid() || !orgId) return;
    setIsSubmitting(true);
    setError('');
    try {
      const payload = { ...form };
      const res = bankDetails
        ? await updateBankDetails(orgId, payload)
        : await createBankDetails(orgId, payload);
      const saved = res;
      setBankDetails(saved);
      setForm(saved);
      localStorage.setItem('bankDetails', JSON.stringify(saved));
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit() {
    setMenuOpen(false);
    setForm({ ...bankDetails });
    setShowForm(true);
  }

  async function handleDelete() {
    setMenuOpen(false);
    if (!orgId) return;
    setIsDeleting(true);
    setError('');
    try {
      await deleteBankDetails(orgId);
      setBankDetails(null);
      setForm({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        swiftCode: '',
        ifscCode: '',
        bankCountry: '',
        currency: '',
      });
      localStorage.removeItem('bankDetails');
      setShowDeleteConfirm(false);
      setShowForm(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancel() {
    router.push('/candidate/dashboard');
  }

  async function handleLogout() {
    try {
      const { candidateLogout } = await import('@/api/auth');
      await candidateLogout();
    } catch (e) {
    } finally {
      localStorage.clear();
      router.push('/candidate/login');
    }
  }

  function getCountryLabel(code) {
    const country = countryOptions.find((c) => c.value === code);
    return country ? country.label : code;
  }

  function renderFormFields() {
    return (
      <>
        <FormField label="Bank Name" required>
          <input
            type="text"
            className={inputClass}
            placeholder="eg. HDFC Bank"
            value={form.bankName}
            onChange={(e) => updateField('bankName', e.target.value)}
          />
        </FormField>

        <FormField label="Account Holder Name" required>
          <input
            type="text"
            className={inputClass}
            placeholder="As per bank records"
            value={form.accountHolderName}
            onChange={(e) => updateField('accountHolderName', e.target.value)}
          />
        </FormField>

        <FormField label="Account Number" required>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter account number"
            value={form.accountNumber}
            onChange={(e) => updateField('accountNumber', e.target.value)}
          />
        </FormField>

        <FormField label="Country" required>
          {mounted ? (
            <Select
              options={countryOptions}
              placeholder="Select bank's country"
              isClearable
              isSearchable
              styles={selectStyles}
              className="w-full"
              classNamePrefix="country-select"
              noOptionsMessage={() => 'No countries found'}
              value={countryOptions.find((c) => c.value === form.bankCountry) || null}
              onChange={(opt) => updateField('bankCountry', opt ? opt.value : '')}
            />
          ) : (
            <div className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg" />
          )}
        </FormField>

        <FormField label="Currency" required>
          {mounted ? (
            <Select
              options={currencyOptions}
              placeholder="Select currency"
              isClearable
              isSearchable
              styles={selectStyles}
              className="w-full"
              classNamePrefix="currency-select"
              noOptionsMessage={() => 'No currencies found'}
              value={currencyOptions.find((c) => c.value === form.currency) || null}
              onChange={(opt) => updateField('currency', opt ? opt.value : '')}
            />
          ) : (
            <div className="w-full h-[36px] px-3 py-1 bg-white border border-[#e9e9ea] rounded-lg" />
          )}
        </FormField>

        <FormField label="SWIFT Code" required>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter your swift code"
            value={form.swiftCode}
            onChange={(e) => updateField('swiftCode', e.target.value)}
          />
        </FormField>

        {form.bankCountry === 'IN' && (
          <FormField label="IFSC Code">
            <input
              type="text"
              className={inputClass}
              placeholder="eg. HDFC0001234"
              value={form.ifscCode}
              onChange={(e) => updateField('ifscCode', e.target.value)}
            />
          </FormField>
        )}
      </>
    );
  }

  if (pageLoading) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
        <AppHeader onLogout={handleLogout} />
        <div className="bg-[#f5f5f7] px-5 pt-10 pb-6" style={{ marginTop: '96px' }}>
          <div className="h-8 w-36 bg-[#e9e9ea] rounded animate-pulse" />
        </div>
        <div className="bg-white border-t border-[#e9e9ea] px-5 py-6 flex flex-col gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-[#e9e9ea] rounded animate-pulse" />
              <div className="h-9 w-full bg-[#e9e9ea] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white border-t border-b border-[#e9e9ea] px-5 py-6">
          <div className="flex gap-3">
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-lg animate-pulse" />
            <div className="flex-1 h-11 bg-[#e9e9ea] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#F9FAFB] flex flex-col mx-auto relative">
      <AppHeader onLogout={handleLogout} />

      <div className="bg-[#f5f5f7] px-5 pt-10 pb-6" style={{ marginTop: '96px' }}>
        <h1 className="font-heading font-semibold text-[24px] text-[#313131] leading-[32px]">
          Bank Details
        </h1>
      </div>

      <Toast message={error} onClose={() => setError('')} />

      {!bankDetails || showForm ? (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="bg-white border-t border-[#e9e9ea] px-5 py-6 flex-1">
            <div className="flex flex-col gap-5 w-full">{renderFormFields()}</div>
          </div>
          <div className="bg-white border-t border-b border-[#e9e9ea] px-5 py-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : bankDetails ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="bg-white border-t border-[#e9e9ea] px-5 py-6 flex-1">
            {bankDetails ? (
              <div className="relative">
                <div className="bg-[#f9fafb] border border-[#e9e9ea] rounded-[16px] p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading font-semibold text-[18px] text-[#313131]">
                      {bankDetails.bankName}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="border border-[#e9e9ea] rounded-lg p-2 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50"
                      >
                        <RiMore2Fill size={16} className="text-[#313131]" />
                      </button>
                      {menuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-10 bg-white rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.09),0px_8px_5px_0px_rgba(0,0,0,0.05),0px_15px_6px_0px_rgba(0,0,0,0.01)] flex flex-col p-1 z-10 animate-fade-in-up min-w-[140px]"
                        >
                          <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-[6px] text-left"
                          >
                            <RiEditBoxLine size={16} className="text-[#79797e]" />
                            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#79797e]">
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setShowDeleteConfirm(true);
                            }}
                            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-[6px] text-left"
                          >
                            <RiDeleteBin5Line size={16} className="text-[#79797e]" />
                            <span className="font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px] text-[#79797e]">
                              Delete
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                        Account Holder
                      </p>
                      <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                        {bankDetails.accountHolderName}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                        Account Number
                      </p>
                      <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                        {bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                        SWIFT Code
                      </p>
                      <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                        {bankDetails.swiftCode}
                      </p>
                    </div>
                    {bankDetails.bankCountry === 'IN' && (
                      <div>
                        <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                          IFSC Code
                        </p>
                        <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                          {bankDetails.ifscCode || '\u2014'}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                        Country
                      </p>
                      <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                        {getCountryLabel(bankDetails.bankCountry)}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[12px] text-[#666] leading-[16px] tracking-[0.4px]">
                        Currency
                      </p>
                      <p className="font-sans font-medium text-[14px] text-[#313131] leading-[20px]">
                        {bankDetails.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-sans text-[14px] text-[#666] text-center py-10">
                No bank details found.
              </p>
            )}
          </div>
          <div className="bg-white border-t border-b border-[#e9e9ea] px-5 py-6">
            <div className="flex gap-3">
              <Link href="/candidate/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] flex items-center justify-center gap-1 hover:bg-gray-50 transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
                >
                  <RiArrowLeftLine size={16} />
                  Back
                </button>
              </Link>
              {bankDetails && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 py-3 px-4 bg-[#1a1d26] rounded-lg font-sans font-medium text-[14px] text-white flex items-center justify-center hover:bg-[#2a2e3d] transition-all shadow-[0px_1px_2px_0px_rgba(185,185,185,0.1),0px_4px_4px_0px_rgba(185,185,185,0.09)]"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-[16px] p-6 w-full max-w-[360px] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-[18px] text-[#313131]">
                Delete Bank Details
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <RiCloseLine size={20} className="text-[#666]" />
              </button>
            </div>
            <p className="font-sans text-[14px] text-[#666] leading-[20px] mb-6">
              Are you sure you want to delete your bank details? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 bg-white border border-[#e9e9ea] rounded-lg font-sans font-medium text-[14px] text-[#313131] hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-[#EF4444] rounded-lg font-sans font-medium text-[14px] text-white hover:bg-[#dc2626] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting && <RiLoader4Line size={16} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
