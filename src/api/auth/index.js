import apiClient from '../axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const getMyProfile = async () => {
  return await apiClient.get('/auth/me');
};

export const updateMyProfile = async (data) => {
  return await apiClient.put('/auth/me', data);
};

export const candidateLogin = async (email, password) => {
  if (!supabase) throw new Error('Supabase is not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message || 'Unable to sign in');
  }

  const accessToken = data?.session?.access_token;

  if (accessToken && typeof window !== 'undefined') {
    localStorage.setItem('sb-access-token', accessToken);
  }

  return {
    ...data,
    accessToken,
  };
};

export const sendPhoneOtp = async (phone) => {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.auth.signInWithOtp({ phone });

  if (error) {
    throw new Error(error.message || 'Unable to send OTP');
  }

  return true;
};

export const verifyPhoneOtp = async (phone, token) => {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    throw new Error(error.message || 'Unable to verify OTP');
  }

  const accessToken = data?.session?.access_token;

  if (accessToken && typeof window !== 'undefined') {
    localStorage.setItem('sb-access-token', accessToken);
  }

  return {
    ...data,
    accessToken,
  };
};

export const candidateLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem('sb-access-token');
  }
};
