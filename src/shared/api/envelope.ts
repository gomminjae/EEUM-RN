import { ApiError } from './client';

/** 원본 ApiResponse<T> { result, data, error } 봉투 */
export type ApiResponse<T> = {
  result: string;
  data: T | null;
  error: ApiErrorBody | null;
};

export type ApiErrorBody = {
  code?: string;
  message?: string;
  data?: Record<string, string> | null;
};

function toError(error: ApiErrorBody): ApiError {
  return new ApiError(200, error.message ?? error.code ?? 'Unknown error', error);
}

/** 봉투를 벗겨 data 를 돌려주고, 앱 레벨 에러는 ApiError 로 던진다 */
export function unwrap<T>(res: ApiResponse<T>): T {
  if (res.error) throw toError(res.error);
  if (res.data == null) throw new ApiError(200, 'Empty response data');
  return res.data;
}

/** 리스트 응답: 에러면 throw, data 가 null 이면 빈 배열 */
export function unwrapList<T>(res: ApiResponse<T[]>): T[] {
  if (res.error) throw toError(res.error);
  return res.data ?? [];
}
