import { api } from '@/shared/api';

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
export const createComment = (draft: CommentDraft) =>
  api.post('/comments', {
    postId: draft.postId,
    content: draft.content,
    albumName: draft.albumName ?? '',
    songName: draft.songName ?? '',
    artistName: draft.artistName ?? '',
    artworkUrl: draft.artworkUrl ?? '',
    appleMusicUrl: draft.appleMusicUrl ?? '',
  });

/** 원본 CommentAPI.reportComment — POST /report/comment */
export const reportComment = (params: {
  commentId: string;
  reportedUserId: string;
  reportReason: string;
}) => api.post('/report/comment', params);
