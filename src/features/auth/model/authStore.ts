import { create } from "zustand";
import { setOnUnauthorized } from "@/shared/api";
import {
  authProviderStorage,
  currentUserIdStorage,
  tokenStorage,
} from "@/shared/lib/storage";
import type { UserData } from "@/entities/user";
import {
  closeAccount as closeAccountRequest,
  completeRegistration as completeRegistrationRequest,
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
  currentUserId: string | null;
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
  rememberCurrentUserId: (userId: string) => void;
  closeAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

const readUserIdFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const claims = JSON.parse(atob(padded)) as Record<string, unknown>;
    const candidate = claims.userId ?? claims.user_id ?? claims.id ?? claims.sub;
    const userId = typeof candidate === "number" ? String(candidate) : candidate;

    return typeof userId === "string" && /^\d+$/.test(userId) ? userId : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  currentUserId: null,
  pendingProvider: null,
  error: null,

  bootstrap: async () => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });
    try {
      const [existing, provider, storedUserId] = await Promise.all([
        tokenStorage.get(),
        authProviderStorage.get(),
        currentUserIdStorage.get(),
      ]);
      if (existing && (provider === "APPLE" || provider === "KAKAO")) {
        set({
          status: "authenticated",
          currentUserId: readUserIdFromToken(existing) ?? storedUserId,
        });
        return;
      }
      // 이전 빌드의 게스트 토큰 또는 불완전한 저장 상태는 소셜 로그인으로 전환한다.
      if (existing || provider) {
        await Promise.all([
          tokenStorage.clear(),
          authProviderStorage.clear(),
          currentUserIdStorage.clear(),
        ]);
      }
      set({ status: "unauthenticated", currentUserId: null });
    } catch (e) {
      set({
        status: "unauthenticated",
        currentUserId: null,
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
      await tokenStorage.set(user.accessToken);
      const currentUserId = readUserIdFromToken(user.accessToken);
      if (currentUserId) await currentUserIdStorage.set(currentUserId);
      if (!user.isRegistered) {
        set({
          status: "registration_terms_required",
          user,
          currentUserId,
          pendingProvider: provider,
        });
        return;
      }
      await authProviderStorage.set(provider);
      set({
        status: "authenticated",
        user,
        currentUserId,
        pendingProvider: null,
      });
    } catch (e) {
      await Promise.allSettled([
        tokenStorage.clear(),
        authProviderStorage.clear(),
        currentUserIdStorage.clear(),
      ]);
      set({
        status: "unauthenticated",
        user: null,
        currentUserId: null,
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
      await completeRegistrationRequest(profile);
      await authProviderStorage.set(pendingProvider);
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
    set({ status: "loading", error: null });
    void Promise.allSettled([
      tokenStorage.clear(),
      authProviderStorage.clear(),
      currentUserIdStorage.clear(),
    ]).then(() => {
      set({
        status: "unauthenticated",
        user: null,
        currentUserId: null,
        pendingProvider: null,
        error: null,
      });
    });
  },

  rememberCurrentUserId: (userId) => {
    set({ currentUserId: userId });
    void currentUserIdStorage.set(userId);
  },

  closeAccount: async () => {
    await closeAccountRequest();
    // 서버 탈퇴가 완료되면 로컬 저장소 정리 실패와 관계없이 세션을 종료한다.
    await Promise.allSettled([
      tokenStorage.clear(),
      authProviderStorage.clear(),
      currentUserIdStorage.clear(),
    ]);
    set({
      status: "unauthenticated",
      user: null,
      currentUserId: null,
      pendingProvider: null,
      error: null,
    });
  },

  signOut: async () => {
    await Promise.all([
      tokenStorage.clear(),
      authProviderStorage.clear(),
      currentUserIdStorage.clear(),
    ]);
    set({
      status: "unauthenticated",
      user: null,
      currentUserId: null,
      pendingProvider: null,
    });
  },
}));

/** 토큰 만료(401) → 저장된 세션을 폐기하고 로그인 화면으로 돌아간다. */
setOnUnauthorized(() => {
  if (useAuthStore.getState().status !== "authenticated") return;
  void Promise.all([
    tokenStorage.clear(),
    authProviderStorage.clear(),
    currentUserIdStorage.clear(),
  ]).then(
    () =>
      useAuthStore.setState({
        status: "unauthenticated",
        user: null,
        currentUserId: null,
        pendingProvider: null,
      }),
  );
});
