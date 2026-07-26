import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { completePost, deletePost, updatePost, type UpdatePostDraft } from '../api/postActions';

/** 내 게시물 관리 — 완료/삭제/수정 (원본 PostDetailViewModel 의 mark/delete/update) */
export function useManagePost(postId: string) {
  const qc = useQueryClient();
  const invalidateDetail = () => qc.invalidateQueries({ queryKey: postKeys.detail(postId) });
  const invalidateFeed = () => qc.invalidateQueries({ queryKey: ['feed'] });

  const complete = useMutation({
    mutationFn: () => completePost(postId),
    onSuccess: () => {
      invalidateDetail();
      invalidateFeed();
    },
  });

  const remove = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: invalidateFeed,
  });

  const update = useMutation({
    mutationFn: (draft: Omit<UpdatePostDraft, 'postId'>) => updatePost({ ...draft, postId }),
    onSuccess: invalidateDetail,
  });

  return { complete, remove, update };
}
