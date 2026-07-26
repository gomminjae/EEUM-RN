import { create } from 'zustand';
import { setOnUnauthorized } from '@/shared/api';
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

/** 토큰 만료(401) → 저장된 토큰 폐기 후 deviceId 게스트 재로그인.
 *  status 가 loading 으로 바뀌면 AuthGate 가 네비게이터를 갈아끼우므로
 *  재로그인 완료 시 자동으로 Home 초기 화면으로 돌아간다.
 *  ponytail: 재로그인 직후 뒤늦게 도착한 401이 한 번 더 태울 수 있음 — 게스트 로그인이라 무해 */
setOnUnauthorized(() => {
  if (useAuthStore.getState().status !== 'authenticated') return;
  void tokenStorage.clear().then(() => useAuthStore.getState().bootstrap());
});
