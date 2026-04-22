import { create } from 'zustand';
import { User } from '@/types';
import { getToken, clearToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!getToken(), // initial check synchronously
  isLoading: false, // change to false so it doesn't block UI forever before profile fetch
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  logout: () => {
    clearToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
