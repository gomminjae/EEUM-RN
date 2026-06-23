import { api, unwrap, type ApiResponse } from '@/shared/api';
import type { UserData } from '@/entities/user';

/** 게스트 로그인 — 원본 LoginAPI.guestLogin / UserRepositoryImpl 이식
 *  POST /user/guest { deviceId, provider } → ApiResponse<UserData> */
export async function guestLogin(deviceId: string): Promise<UserData> {
  const res = await api.post<ApiResponse<UserData>>(
    '/user/guest',
    { deviceId, provider: 'GUEST' },
    { auth: false },
  );
  return unwrap(res);
}

/** 소셜 로그인 (원본 LoginAPI.login) — 추후 Apple/Kakao 연동 시 사용
 *  POST /user/login { idToken, provider } → ApiResponse<UserData> */
export async function socialLogin(idToken: string, provider: string): Promise<UserData> {
  const res = await api.post<ApiResponse<UserData>>(
    '/user/login',
    { idToken, provider },
    { auth: false },
  );
  return unwrap(res);
}
