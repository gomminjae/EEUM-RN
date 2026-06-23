import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStory, type ShareDraft } from '../api/createStory';

/** 사연 공유(게시) — 성공 시 피드/내글 무효화 */
export function useShareStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: ShareDraft) => createStory(draft),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: ['myPostIds'] });
    },
  });
}
