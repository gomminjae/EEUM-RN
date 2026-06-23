import { z } from 'zod';
import { api, parseList } from '@/shared/api';
import type { Comment } from '../model/types';

const idToString = (v: number | null | undefined) => (v == null ? null : String(v));

/** 원본 CommentModelDTO → Comment 매핑을 zod 스키마 + transform 으로 통합 */
export const commentSchema = z
  .object({
    commentId: z.number().nullish(),
    postId: z.number().nullish(),
    userId: z.number().nullish(),
    content: z.string().nullish(),
    createdAt: z.string().nullish(),
    albumName: z.string().nullish(),
    songName: z.string().nullish(),
    artistName: z.string().nullish(),
    artworkUrl: z.string().nullish(),
    appleMusicUrl: z.string().nullish(),
    modifiedAt: z.string().nullish(),
    isDeleted: z.boolean().nullish(),
  })
  .transform(
    (dto): Comment => ({
      commentId: idToString(dto.commentId),
      postId: idToString(dto.postId),
      userId: idToString(dto.userId),
      content: dto.content ?? null,
      createdAt: dto.createdAt ?? null,
      albumName: dto.albumName ?? null,
      songName: dto.songName ?? null,
      artistName: dto.artistName ?? null,
      artworkUrl: dto.artworkUrl ?? null,
      appleMusicUrl: dto.appleMusicUrl ?? null,
      modifiedAt: dto.modifiedAt ?? null,
      isDeleted: dto.isDeleted ?? null,
    }),
  );

/** 댓글 목록 (원본 CommentAPI.getComments) — 상세 새로고침용 */
export async function getComments(postId: number): Promise<Comment[]> {
  const json = await api.get<unknown>(`/comments/${postId}`);
  return parseList(commentSchema, json);
}
