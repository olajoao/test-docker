import type { AuthState, Tokens } from '@/api/types/auth';
import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';



export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        tokens: null,
        isAuthenticated: false,
        isLoading: true,

        setAuth: (tokens: Tokens) => {
          set({
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        },

        logout: () => {
          set({
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
          // Remove apenas os dados antigos de compatibilidade
          localStorage.removeItem('app_data');
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),

        getAccessToken: () => get().tokens?.access_token ?? null,
        getRefreshToken: () => get().tokens?.refresh_token ?? null,
      }),
      {
        name: 'spx-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          tokens: state.tokens,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isLoading = false;
          }
        },
      }
    ),
    { name: 'AuthStore' }
  )
);
