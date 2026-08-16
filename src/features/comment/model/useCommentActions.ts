import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { createComment, deleteComment, reportComment, type CommentDraft } from '../api/commentActions';

const invalidateCommentQueries = (qc: ReturnType<typeof useQueryClient>, postId: string) =>
  Promise.all([
    qc.invalidateQueries({ queryKey: postKeys.detail(postId) }),
    qc.invalidateQueries({ queryKey: ['inbox', 'comments'] }),
  ]);

/** 댓글 작성 후 상세 무효화 (원본 createComment → loadPostDetail) */
export function useCreateComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: Omit<CommentDraft, 'postId'>) =>
      createComment({ ...draft, postId }),
    onSuccess: () => invalidateCommentQueries(qc, postId),
  });
}

export function useReportComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reportComment,
    onSuccess: () => invalidateCommentQueries(qc, postId),
  });
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => invalidateCommentQueries(qc, postId),
  });
}
