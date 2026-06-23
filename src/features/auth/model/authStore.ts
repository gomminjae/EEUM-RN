import { create } from 'zustand';
import { tokenStorage } from '@/shared/lib/storage';
import type { UserData } from '@/entities/user';
import { getDeviceId } from '../lib/deviceId';
import { guestLogin } from '../api/authApi';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: UserData | null;
  error: string | null;
  /** 앱 시작 시 호출: 저장된 토큰이 있으면 인증, 없으면 게스트 로그인 */
  bootstrap: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  error: null,

  bootstrap: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const existing = await tokenStorage.get();
      if (existing) {
        set({ status: 'authenticated' });
        return;
      }
      const deviceId = await getDeviceId();
      const user = await guestLogin(deviceId);
      await tokenStorage.set(user.accessToken);
      set({ status: 'authenticated', user });
    } catch (e) {
      set({
        status: 'unauthenticated',
        error: e instanceof Error ? e.message : '로그인에 실패했어요',
      });
    }
  },

  signOut: async () => {
    await tokenStorage.clear();
    set({ status: 'unauthenticated', user: null });
  },
}));
