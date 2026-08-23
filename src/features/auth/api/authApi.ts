import { z } from "zod";
import { api, parseData } from "@/shared/api";
import type { UserData } from "@/entities/user";

export type SocialAuthProvider = "APPLE" | "KAKAO";

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
  return parseData(userSchema, json);
}

/** 현재 인증된 사용자의 계정과 연관 데이터를 삭제한다. */
export async function closeAccount(): Promise<void> {
  await api.delete<unknown>("/user/close");
}
