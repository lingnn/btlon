'use client';

import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'candidate' | 'content_admin' | 'system_admin';
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  },

  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('authUser');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch (e) {
          console.error('[v0] Failed to parse stored user:', e);
          localStorage.removeItem('authUser');
          localStorage.removeItem('authToken');
        }
      }
    }
  },
}));

