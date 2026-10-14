import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types/models';
import { authRepository } from '../data/repositories/authRepository';

type AuthState = {
  session: Session | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  continueWithProvider: (provider: 'google' | 'apple') => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => void;
  adjustWallet: (delta: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      sendOtp: async (phone) => {
        await authRepository.sendOtp(phone);
      },

      verifyOtp: async (phone, code) => {
        const session = await authRepository.verifyOtp(phone, code);
        set({ session });
      },

      continueWithProvider: async (provider) => {
        const session = await authRepository.continueWithProvider(provider);
        set({ session });
      },

      continueAsGuest: async () => {
        const session = await authRepository.continueAsGuest();
        set({ session });
      },

      signOut: () => set({ session: null }),

      adjustWallet: (delta) => {
        const session = get().session;
        if (!session) return;
        set({ session: { ...session, walletBalance: Math.max(0, session.walletBalance + delta) } });
      },
    }),
    {
      name: 'henode-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
