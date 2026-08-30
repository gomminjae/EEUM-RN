import { useQuery, type QueryClient } from '@tanstack/react-query';
import { getPostDetail } from '../api/postApi';
import type { Post, PostDetail } from './types';
import { postKeys } from './queryKeys';

/** 게시물 상세 쿼리 — post-detail / edit-post 페이지가 공유 (entities 에 위치) */
export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
    retry: false,
  });
}

/** 목록에서 이미 받은 내용을 상세 캐시에 넣어 서버 지연 중에도 기본 사연을 보여준다. */
export function primePostDetail(queryClient: QueryClient, post: Post): void {
  if (!post.postId) return;
  const key = postKeys.detail(post.postId);
  if (!queryClient.getQueryData<PostDetail>(key)) {
    queryClient.setQueryData<PostDetail>(key, {
      postId: post.postId,
      title: post.title ?? '',
      content: post.content ?? '',
      songName: post.songName ?? '',
      artistName: post.artistName ?? '',
      artworkUrl: post.artworkUrl ?? '',
      appleMusicUrl: post.appleMusicUrl ?? '',
      createdAt: post.createdAt ?? '',
      isLiked: false,
      comments: [],
    });
    void queryClient.invalidateQueries({ queryKey: key, exact: true });
  }
}
