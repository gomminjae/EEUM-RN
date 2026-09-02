import { z } from "zod";
import { api, parseData, parseSuccess } from "@/shared/api";
import type { UserData } from "@/entities/user";

export type SocialAuthProvider = "APPLE" | "KAKAO";

export type RegistrationProfile = {
  nickname: string;
  email?: string;
};

/** 원본 UserDTO — 로그인 응답 */
const userSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  role: z.string(),
  isRegistered: z.boolean(),
});

/** 게스트 로그인 — POST /user/guest { deviceId, provider } */
export async function guestLogin(deviceId: string): Promise<UserData> {
  const json = await api.post<unknown>(
    "/user/guest",
    { deviceId, provider: "GUEST" },
    { auth: false },
  );
  return parseData(userSchema, json);
}

/** 소셜 로그인 (추후 Apple/Kakao) — POST /user/login { idToken, provider } */
export async function socialLogin(
  idToken: string,
  provider: SocialAuthProvider,
): Promise<UserData> {
  const json = await api.post<unknown>(
    "/user/login",
    { idToken, provider },
    { auth: false },
  );
  const user = parseData(userSchema, json);
  const accessToken = user.accessToken.trim().replace(/^Bearer\s+/i, "");
  return { ...user, accessToken };
}

const profileSchema = z
  .object({
    nickname: z.string().nullish(),
    email: z.string().nullish(),
  });

/** 신규 사용자의 프로필을 저장해 회원가입을 완료한다. */
export async function completeRegistration(
  profile: RegistrationProfile,
): Promise<void> {
  const json = await api.patch<unknown>(
    "/user/profile",
    {
      nickname: profile.nickname,
      ...(profile.email ? { email: profile.email } : {}),
    },
  );
  parseData(profileSchema, json);
}

/** 현재 인증된 사용자의 계정과 연관 데이터를 삭제한다. */
export async function closeAccount(): Promise<void> {
  const json = await api.delete<unknown>("/user/close");
  parseSuccess(json);
}
