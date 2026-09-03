import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';
import { reportPost } from '../api/reportPost';

export function useReportPost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: reportPost,
    onSuccess: async (_data, variables) => {
      // 신고된 게시글은 서버에서 삭제되므로 상세 캐시를 즉시 폐기한다.
      qc.removeQueries({
        queryKey: postKeys.detail(variables.postId),
        exact: true,
      });

      // 뒤로 돌아갔을 때 신고 전 목록 캐시가 노출되지 않도록 초기화 후 재조회한다.
      await Promise.all([
        qc.resetQueries({ queryKey: ['feed'] }),
        qc.resetQueries({ queryKey: ['inbox'] }),
      ]);
    },
  });
}
