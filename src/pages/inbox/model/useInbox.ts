import { useQuery } from '@tanstack/react-query';
import { getMyPosts, getLikedPosts, getCommentedPosts } from '@/entities/post';

export type InboxTab = 'posts' | 'comments' | 'likes';

const fetchers = {
  posts: getMyPosts,
  comments: getCommentedPosts,
  likes: getLikedPosts,
};

/** 원본 FeedViewModel.loadMyPosts/loadLikedPosts/loadCommentedPosts 대체 */
export function useInbox(tab: InboxTab) {
  return useQuery({
    queryKey: ['inbox', tab],
    queryFn: fetchers[tab],
  });
}
