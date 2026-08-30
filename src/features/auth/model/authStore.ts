import { create } from "zustand";
import { setOnUnauthorized } from "@/shared/api";
import { authProviderStorage, tokenStorage } from "@/shared/lib/storage";
import type { UserData } from "@/entities/user";
import {
  closeAccount as closeAccountRequest,
  completeRegistration as completeRegistrationRequest,
  getProfile,
  socialLogin,
  type RegistrationProfile,
  type SocialAuthProvider,
} from "../api/authApi";

export type AuthStatus =
  | "idle"
  | "loading"
  | "registration_terms_required"
  | "registration_required"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  user: UserData | null;
  pendingProvider: SocialAuthProvider | null;
  error: string | null;
  /** 앱 시작 시 호출: 소셜 로그인으로 저장된 토큰이 있을 때만 인증 */
  bootstrap: () => Promise<void>;
  signInWithIdToken: (
    idToken: string,
    provider: SocialAuthProvider,
  ) => Promise<void>;
  acceptRegistrationTerms: () => void;
  completeRegistration: (profile: RegistrationProfile) => Promise<void>;
  cancelRegistration: () => void;
  closeAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  pendingProvider: null,
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
      // 서버의 isRegistered 값만으로는 기존/신규 판별이 일관되지 않으므로
      // 실제 저장된 프로필을 우선 확인한다. 닉네임이 있으면 기존 회원이다.
      let needsRegistration: boolean;
      try {
        const profile = await getProfile(user);
        needsRegistration = !profile.nickname?.trim();
      } catch {
        // 프로필 조회 자체가 실패한 경우에만 로그인 응답을 보조 신호로 사용한다.
        needsRegistration = !user.isRegistered;
      }

      if (needsRegistration) {
        set({
          status: "registration_terms_required",
          user,
          pendingProvider: provider,
        });
        return;
      }
      await authProviderStorage.set(provider);
      await tokenStorage.set(user.accessToken);
      set({ status: "authenticated", user, pendingProvider: null });
    } catch (e) {
      set({
        status: "unauthenticated",
        user: null,
        pendingProvider: null,
        error: e instanceof Error ? e.message : "로그인에 실패했어요",
      });
    }
  },

  acceptRegistrationTerms: () => {
    if (get().status !== "registration_terms_required") return;
    set({ status: "registration_required", error: null });
  },

  completeRegistration: async (profile) => {
    const { status, user, pendingProvider } = get();
    if (status !== "registration_required" || !user || !pendingProvider) {
      throw new Error("회원가입 정보를 다시 확인해주세요.");
    }

    set({ error: null });
    try {
      await completeRegistrationRequest(user, profile);
      await authProviderStorage.set(pendingProvider);
      await tokenStorage.set(user.accessToken);
      set({
        status: "authenticated",
        user: { ...user, isRegistered: true },
        pendingProvider: null,
        error: null,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "회원가입을 완료하지 못했어요";
      set({ error: message });
      throw e;
    }
  },

  cancelRegistration: () => {
    set({
      status: "unauthenticated",
      user: null,
      pendingProvider: null,
      error: null,
    });
  },

  closeAccount: async () => {
    await closeAccountRequest();
    // 서버 탈퇴가 완료되면 로컬 저장소 정리 실패와 관계없이 세션을 종료한다.
    await Promise.allSettled([
      tokenStorage.clear(),
      authProviderStorage.clear(),
    ]);
    set({
      status: "unauthenticated",
      user: null,
      pendingProvider: null,
      error: null,
    });
  },

  signOut: async () => {
    await Promise.all([tokenStorage.clear(), authProviderStorage.clear()]);
    set({ status: "unauthenticated", user: null, pendingProvider: null });
  },
}));

/** 토큰 만료(401) → 저장된 세션을 폐기하고 로그인 화면으로 돌아간다. */
setOnUnauthorized(() => {
  if (useAuthStore.getState().status !== "authenticated") return;
  void Promise.all([tokenStorage.clear(), authProviderStorage.clear()]).then(
    () =>
      useAuthStore.setState({
        status: "unauthenticated",
        user: null,
        pendingProvider: null,
      }),
  );
});
