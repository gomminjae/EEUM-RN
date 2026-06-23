import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys, type PostDetail } from '@/entities/post';
import { likePost, unlikePost } from '../api/likeApi';

/** 좋아요 토글 — 원본 PostDetailViewModel.toggleLike 의 낙관적 갱신 이식 */
export function useToggleLike(postId: string) {
  const qc = useQueryClient();
  const key = postKeys.detail(postId);

  return useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      const id = Number(postId);
      if (currentlyLiked) await unlikePost(id);
      else await likePost(id);
      return !currentlyLiked;
    },
    onMutate: async (currentlyLiked) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<PostDetail>(key);
      if (prev) qc.setQueryData<PostDetail>(key, { ...prev, isLiked: !currentlyLiked });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
  });
}
