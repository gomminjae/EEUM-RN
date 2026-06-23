import { api, unwrapList, type ApiResponse } from '@/shared/api';
import type { Comment } from '../model/types';

/** 원본 CommentModelDTO */
export type CommentModelDTO = {
  commentId?: number | null;
  postId?: number | null;
  userId?: number | null;
  content?: string | null;
  createdAt?: string | null;
  albumName?: string | null;
  songName?: string | null;
  artistName?: string | null;
  artworkUrl?: string | null;
  appleMusicUrl?: string | null;
  modifiedAt?: string | null;
  isDeleted?: boolean | null;
};

const idToString = (v: number | null | undefined) => (v == null ? null : String(v));

export function fromCommentDTO(dto: CommentModelDTO): Comment {
  return {
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
  };
}

/** 댓글 목록 (원본 CommentAPI.getComments) — 상세 새로고침용 */
export async function getComments(postId: number): Promise<Comment[]> {
  const res = await api.get<ApiResponse<CommentModelDTO[]>>(`/comments/${postId}`);
  return unwrapList(res).map(fromCommentDTO);
}
