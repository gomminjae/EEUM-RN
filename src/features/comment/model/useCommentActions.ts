import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { createComment, reportComment, type CommentDraft } from '../api/commentActions';

/** 댓글 작성 후 상세 무효화 (원본 createComment → loadPostDetail) */
export function useCreateComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: Omit<CommentDraft, 'postId'>) =>
      createComment({ ...draft, postId: Number(postId) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.detail(postId) }),
  });
}

export function useReportComment() {
  return useMutation({ mutationFn: reportComment });
}
