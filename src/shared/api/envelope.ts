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

/** 봉투를 벗겨 data 를 돌려주고, 앱 레벨 에러는 ApiError 로 던진다 */
export function unwrap<T>(res: ApiResponse<T>): T {
  if (res.error) {
    throw new ApiError(200, res.error.message ?? res.error.code ?? 'Unknown error', res.error);
  }
  if (res.data == null) {
    throw new ApiError(200, 'Empty response data');
  }
  return res.data;
}
