import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../api/postApi';
import { postKeys } from './queryKeys';

/** 게시물 상세 쿼리 — post-detail / edit-post 페이지가 공유 (entities 에 위치) */
export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
  });
}
