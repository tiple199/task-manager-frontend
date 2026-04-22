import { AuthToken } from '@/types';
import 'dotenv/config';

const TOKEN_KEY = process.env.NEXT_PUBLIC_NAME_TOKEN!;

export const setToken = (token: AuthToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }
};

export const getToken = (): AuthToken | null => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};
