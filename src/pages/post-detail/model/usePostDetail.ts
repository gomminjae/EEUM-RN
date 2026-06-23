import { useQuery } from '@tanstack/react-query';
import { getPostDetail, getMyPostIds, postKeys } from '@/entities/post';

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(Number(postId)),
  });
}

/** 소유 여부 — 원본 PostDetailViewModel.checkIfMyPost (getMyPosts 캐시 공유) */
export function useIsMyPost(postId: string) {
  const { data } = useQuery({
    queryKey: ['myPostIds'],
    queryFn: getMyPostIds,
    staleTime: 60_000,
  });
  return (data ?? []).includes(postId);
}
