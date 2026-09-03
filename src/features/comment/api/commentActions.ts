import { z } from 'zod';
import { commentSchema, type Comment } from '@/entities/comment';
import { api, parseData } from '@/shared/api';

export type CommentDraft = {
  postId: string;
  content: string;
  /** 첨부 음악 (M4 Search 연동) — 없으면 빈 문자열로 전송 */
  albumName?: string;
  songName?: string;
  artistName?: string;
  artworkUrl?: string;
  appleMusicUrl?: string;
};

/** 원본 CommentAPI.postComment — POST /comments */
/** OpenAPI 는 int64지만 앱은 정밀도 보존을 위해 ID를 문자열로 관리한다.
 *  안전한 범위의 ID는 JSON number로 보내고, 그보다 크면 손실 없는 숫자 문자열을 유지한다. */
const requestId = (id: string): number | string => {
  const value = Number(id);
  return Number.isSafeInteger(value) ? value : id;
};

const responseId = z.union([z.number(), z.string()]);
const blockUserSchema = z
  .object({
    blockerUserId: responseId,
    blockedUserId: responseId,
  })
  .transform((data) => ({
    blockerUserId: String(data.blockerUserId),
    blockedUserId: String(data.blockedUserId),
  }));
const commentReportSchema = z
  .object({
    reporterUserId: responseId.nullish(),
    reportedUserId: responseId.nullish(),
    reportedCommentId: responseId.nullish(),
    reportReason: z.string().nullish(),
    reportTime: z.string().nullish(),
  })
  .transform((data) => ({
    reporterUserId: data.reporterUserId == null ? null : String(data.reporterUserId),
    reportedUserId: data.reportedUserId == null ? null : String(data.reportedUserId),
    reportedCommentId: data.reportedCommentId == null ? null : String(data.reportedCommentId),
    reportReason: data.reportReason ?? null,
    reportTime: data.reportTime ?? null,
  }));

/** OpenAPI: POST /user/block */
export async function blockUser(blockedUserId: string) {
  const json = await api.post<unknown>('/user/block', {
    blockedUserId: requestId(blockedUserId),
  });
  return parseData(blockUserSchema, json);
}

export async function createComment(draft: CommentDraft): Promise<Comment> {
  const json = await api.post<unknown>('/comments', {
    postId: requestId(draft.postId),
    content: draft.content,
    albumName: draft.albumName ?? '',
    songName: draft.songName ?? '',
    artistName: draft.artistName ?? '',
    artworkUrl: draft.artworkUrl ?? '',
    appleMusicUrl: draft.appleMusicUrl ?? '',
  });
  return parseData(commentSchema, json);
}

/** 원본 CommentAPI.reportComment — POST /report/comment */
export async function reportComment(params: {
  commentId: string;
  reportedUserId: string;
  reportReason: string;
}): Promise<z.infer<typeof commentReportSchema>> {
  const json = await api.post<unknown>('/report/comment', {
    commentId: requestId(params.commentId),
    reportedUserId: requestId(params.reportedUserId),
    reportReason: params.reportReason,
  });
  return parseData(commentReportSchema, json);
}

/** 사용자 차단과 해당 댓글 신고를 함께 전송한다.
 * Apple Guideline 1.2: 차단 시 운영자에게 관련 부적절 콘텐츠도 전달되어야 한다. */
export async function blockUserAndReportComment(params: {
  commentId: string;
  blockedUserId: string;
}): Promise<void> {
  await Promise.all([
    blockUser(params.blockedUserId),
    reportComment({
      commentId: params.commentId,
      reportedUserId: params.blockedUserId,
      reportReason: '사용자 차단',
    }),
  ]);
}

/** OpenAPI: DELETE /comments/{commentId} */
export async function deleteComment(commentId: string): Promise<string> {
  const json = await api.delete<unknown>(`/comments/${encodeURIComponent(commentId)}`);
  return parseData(z.string(), json);
}
