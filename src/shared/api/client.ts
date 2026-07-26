import { ENV } from '@/shared/config/env';
import { tokenStorage } from '@/shared/lib/storage';

/** 서버 에러를 단일 타입으로 정규화 (원본 Moya 에러 처리 대체) */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

/** 401(토큰 만료) 시 호출될 핸들러 — features/auth 가 등록 (레이어 역전 방지) */
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Query;
  /** 기본 true — Authorization 헤더에 토큰 주입 (원본 AccessTokenPlugin 대체) */
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: Query): string {
  const base = path.startsWith('http') ? path : `${ENV.baseURL}${path}`;
  if (!query) return base;
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `${base}?${qs}` : base;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true, headers, signal } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (auth) {
    const token = await tokenStorage.get();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await res.text();
  // 서버 Long id(2^53 초과)가 JSON.parse 에서 정밀도를 잃지 않도록 값 위치의 16자리+ 정수를 문자열로 감싼다
  // ponytail: 문자열 내용에 `: <16자리수>,` 꼴이 있으면 오탐 가능 — 실데이터엔 없어 허용
  // 서버가 401 등에서 JSON 이 아닌 평문("Invalid access token!")을 주는 경우가 있어 파싱 가드
  let data: unknown;
  try {
    data = text
      ? JSON.parse(text.replace(/(:\s*)(-?\d{16,})(?=\s*[,}\]])/g, '$1"$2"'))
      : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized?.();
    throw new ApiError(res.status, `Request failed (${res.status})`, data);
  }
  return data as T;
}

/** fetch 기반 얇은 클라이언트 — 서드파티 HTTP 의존성 없음 */
export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
};
