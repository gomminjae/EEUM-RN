import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys, type PostDetail } from '@/entities/post';
import {
  blockUserAndReportComment,
  createComment,
  deleteComment,
  reportComment,
  type CommentDraft,
} from '../api/commentActions';

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

export function useBlockCommentAuthor(postId: string) {
  const qc = useQueryClient();
  const detailKey = postKeys.detail(postId);

  return useMutation({
    mutationFn: blockUserAndReportComment,
    onMutate: async ({ blockedUserId }) => {
      await qc.cancelQueries({ queryKey: detailKey });
      const previous = qc.getQueryData<PostDetail>(detailKey);

      // 네트워크 응답을 기다리지 않고 차단 사용자의 댓글을 현재 화면에서 제거한다.
      qc.setQueryData<PostDetail>(detailKey, (current) =>
        current
          ? {
              ...current,
              comments: current.comments.filter(
                (comment) => comment.userId !== blockedUserId,
              ),
            }
          : current,
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) qc.setQueryData(detailKey, context.previous);
    },
    onSettled: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: detailKey }),
        qc.invalidateQueries({ queryKey: ['feed'] }),
        qc.invalidateQueries({ queryKey: ['inbox'] }),
      ]),
  });
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => invalidateCommentQueries(qc, postId),
  });
}
