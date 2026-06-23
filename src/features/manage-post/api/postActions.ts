import { api } from '@/shared/api';

/** 원본 PostAPI.updatePostState — PATCH /posts/{id}/complete */
export const completePost = (postId: number) => api.patch(`/posts/${postId}/complete`);

/** 원본 PostAPI.deletePost — DELETE /posts/{id} */
export const deletePost = (postId: number) => api.delete(`/posts/${postId}`);

export type UpdatePostDraft = {
  postId: number;
  title: string;
  content: string;
  albumName: string;
  songName: string;
  artistName: string;
  artworkUrl: string;
  appleMusicUrl: string;
};

/** 원본 PostAPI.updatePost — PATCH /posts */
export const updatePost = (draft: UpdatePostDraft) => api.patch('/posts', draft);
