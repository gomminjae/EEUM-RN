import { z } from 'zod';
import { ApiError } from './client';

/** 원본 ApiResponse<T> { result, data, error } 봉투 — data 는 단계 분리 검증 */
const apiErrorBodySchema = z.object({
  code: z.string().nullish(),
  message: z.string().nullish(),
  data: z.record(z.string(), z.string()).nullish(),
});

const envelopeSchema = z.object({
  result: z.string().nullish(),
  error: apiErrorBodySchema.nullish(),
  data: z.unknown().nullish(),
});

function toApiError(error: z.infer<typeof apiErrorBodySchema>): ApiError {
  return new ApiError(200, error?.message ?? error?.code ?? 'Unknown error', error);
}

/** 봉투 검증 후 data 를 dataSchema 로 파싱. 앱레벨 에러/빈 데이터는 ApiError */
export function parseData<T extends z.ZodTypeAny>(dataSchema: T, json: unknown): z.infer<T> {
  const env = envelopeSchema.parse(json);
  if (env.error) throw toApiError(env.error);
  if (env.data == null) throw new ApiError(200, 'Empty response data');
  return dataSchema.parse(env.data);
}

/** 리스트 응답: data 가 null 이면 빈 배열 */
export function parseList<T extends z.ZodTypeAny>(itemSchema: T, json: unknown): z.infer<T>[] {
  const env = envelopeSchema.parse(json);
  if (env.error) throw toApiError(env.error);
  if (env.data == null) return [];
  return z.array(itemSchema).parse(env.data);
}
