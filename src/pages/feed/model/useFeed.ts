import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedPosts, type FeedKind } from '@/entities/post';

const PAGE_SIZE = 20;

/** Ing/Done 무한스크롤 (원본 FeedViewModel.loadIngPosts/loadDonePosts 대체)
 *  커서 = 마지막 페이지의 마지막 postId, 페이지가 PAGE_SIZE 미만이면 종료 */
export function useFeed(kind: FeedKind) {
  return useInfiniteQuery({
    queryKey: ['feed', kind],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => getFeedPosts(kind, PAGE_SIZE, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      const last = lastPage[lastPage.length - 1];
      const id = last?.postId != null ? Number(last.postId) : NaN;
      return Number.isFinite(id) ? id : undefined;
    },
  });
}
