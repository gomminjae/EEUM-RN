import { z } from 'zod';
import { api, parseData } from '@/shared/api';

const idSchema = z.union([z.number(), z.string()]);

const requestId = (id: string): number | string => {
  const value = Number(id);
  return Number.isSafeInteger(value) ? value : id;
};

const postReportSchema = z.object({
  reporterUserId: idSchema.nullish(),
  reportedUserId: idSchema.nullish(),
  reportedPostId: idSchema.nullish(),
  reportReason: z.string().nullish(),
  reportTime: z.string().nullish(),
});

export type ReportPostParams = {
  postId: string;
  reportedUserId?: string | null;
  reportReason: string;
};

/** OpenAPI: POST /report/posts */
export async function reportPost(params: ReportPostParams) {
  const json = await api.post<unknown>('/report/posts', {
    postId: requestId(params.postId),
    ...(params.reportedUserId
      ? { reportedUserId: requestId(params.reportedUserId) }
      : {}),
    reportReason: params.reportReason,
  });
  return parseData(postReportSchema, json);
}
