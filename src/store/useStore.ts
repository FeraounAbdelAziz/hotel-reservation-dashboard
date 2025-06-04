import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Store, User, Task, StockItem } from './types';

interface StoreState {
  currentUser: User | null;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => Promise<boolean>;
}

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      error: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setError: (error) => set({ error }),
      login: async (code: string) => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('code', code)
            .single();

          if (error || !data) {
            set({ error: 'Invalid code', currentUser: null });
            return false;
          }

          const user = {
            id: data.id,
            name: data.name,
            role: data.role,
            code: data.code,
          };

          // Store session expiry
          const sessionExpiry = Date.now() + SESSION_DURATION;
          set({ 
            currentUser: user,
            error: null,
            sessionExpiry 
          });

          return true;
        } catch (error) {
          set({ error: 'Login failed', currentUser: null });
          return false;
        }
      },
      logout: () => {
        set({ currentUser: null, error: null });
      },
      checkSession: async () => {
        const state = get();
        const sessionExpiry = (state as any).sessionExpiry;

        // If no session expiry or expired, clear user
        if (!sessionExpiry || Date.now() > sessionExpiry) {
          set({ currentUser: null, error: null });
          return false;
        }

        // If we have a current user and valid session, return true
        if (state.currentUser) {
          return true;
        }

        return false;
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        sessionExpiry: (state as any).sessionExpiry,
      }),
    }
  )
);

export default useStore; 