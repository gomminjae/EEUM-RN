import { useQuery } from '@tanstack/react-query';
import { getMyPostIds, usePostDetail } from '@/entities/post';

export { usePostDetail };

/** 소유 여부 — 원본 PostDetailViewModel.checkIfMyPost (getMyPosts 캐시 공유) */
export function useIsMyPost(postId: string) {
  const { data } = useQuery({
    queryKey: ['myPostIds'],
    queryFn: getMyPostIds,
    staleTime: 60_000,
  });
  return (data ?? []).includes(postId);
}
