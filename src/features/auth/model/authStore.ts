import { create } from "zustand";
import { setOnUnauthorized } from "@/shared/api";
import { authProviderStorage, tokenStorage } from "@/shared/lib/storage";
import type { UserData } from "@/entities/user";
import {
  closeAccount as closeAccountRequest,
  socialLogin,
  type SocialAuthProvider,
} from "../api/authApi";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  user: UserData | null;
  error: string | null;
  /** 앱 시작 시 호출: 소셜 로그인으로 저장된 토큰이 있을 때만 인증 */
  bootstrap: () => Promise<void>;
  signInWithIdToken: (
    idToken: string,
    provider: SocialAuthProvider,
  ) => Promise<void>;
  closeAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  error: null,

  bootstrap: async () => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });
    try {
      const [existing, provider] = await Promise.all([
        tokenStorage.get(),
        authProviderStorage.get(),
      ]);
      if (existing && (provider === "APPLE" || provider === "KAKAO")) {
        set({ status: "authenticated" });
        return;
      }
      // 이전 빌드의 게스트 토큰 또는 불완전한 저장 상태는 소셜 로그인으로 전환한다.
      if (existing || provider) {
        await Promise.all([tokenStorage.clear(), authProviderStorage.clear()]);
      }
      set({ status: "unauthenticated" });
    } catch (e) {
      set({
        status: "unauthenticated",
        error:
          e instanceof Error ? e.message : "로그인 정보를 확인하지 못했어요",
      });
    }
  },

  signInWithIdToken: async (idToken, provider) => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });
    try {
      const user = await socialLogin(idToken, provider);
      await authProviderStorage.set(provider);
      await tokenStorage.set(user.accessToken);
      set({ status: "authenticated", user });
    } catch (e) {
      set({
        status: "unauthenticated",
        user: null,
        error: e instanceof Error ? e.message : "로그인에 실패했어요",
      });
    }
  },

  closeAccount: async () => {
    await closeAccountRequest();
    // 서버 탈퇴가 완료되면 로컬 저장소 정리 실패와 관계없이 세션을 종료한다.
    await Promise.allSettled([
      tokenStorage.clear(),
      authProviderStorage.clear(),
    ]);
    set({ status: "unauthenticated", user: null, error: null });
  },

  signOut: async () => {
    await Promise.all([tokenStorage.clear(), authProviderStorage.clear()]);
    set({ status: "unauthenticated", user: null });
  },
}));

/** 토큰 만료(401) → 저장된 세션을 폐기하고 로그인 화면으로 돌아간다. */
setOnUnauthorized(() => {
  if (useAuthStore.getState().status !== "authenticated") return;
  void Promise.all([tokenStorage.clear(), authProviderStorage.clear()]).then(
    () => useAuthStore.setState({ status: "unauthenticated", user: null }),
  );
});
