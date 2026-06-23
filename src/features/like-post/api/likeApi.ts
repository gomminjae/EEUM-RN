import { api } from '@/shared/api';

/** 원본 LikeAPI.postLike / deleteLike — 성공 여부만 사용 */
export const likePost = (postId: number) => api.post(`/like/posts/${postId}`);
export const unlikePost = (postId: number) => api.delete(`/like/posts/${postId}`);
