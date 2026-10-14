import { mockDelay } from '../mockDelay';
import { Session } from '../../types/models';
import { generateId } from '../../utils/id';

export const authRepository = {
  sendOtp(_phone: string): Promise<{ sent: true }> {
    return mockDelay({ sent: true }, 600);
  },

  verifyOtp(phone: string, code: string): Promise<Session> {
    if (code.trim().length !== 6) {
      return Promise.reject(new Error('Enter the 6-digit code'));
    }
    const session: Session = { id: generateId('usr'), phone, isGuest: false, walletBalance: 3200 };
    return mockDelay(session, 600);
  },

  continueWithProvider(provider: 'google' | 'apple'): Promise<Session> {
    const session: Session = {
      id: generateId('usr'),
      name: provider === 'google' ? 'Adaeze Okafor' : 'A. Okafor',
      isGuest: false,
      walletBalance: 3200,
    };
    return mockDelay(session, 500);
  },

  continueAsGuest(): Promise<Session> {
    const session: Session = { id: generateId('guest'), isGuest: true, walletBalance: 0 };
    return mockDelay(session, 150);
  },
};
