import { api, unwrapList, type ApiResponse } from '@/shared/api';
import type { Post, FeedKind } from '../model/types';

/** 원본 InfiniteScrollPostDTO (Ing/Done 무한스크롤 응답 요소) */
type InfiniteScrollPostDTO = {
  postId: number;
  title: string;
  content: string;
  songName?: string | null;
  artistName?: string | null;
  artworkUrl?: string | null;
  appleMusicUrl?: string | null;
  createdAt: string;
  isCompleted: boolean;
};

function fromInfiniteScroll(dto: InfiniteScrollPostDTO): Post {
  return {
    postId: String(dto.postId),
    writerId: null,
    title: dto.title,
    content: dto.content,
    songName: dto.songName ?? null,
    artistName: dto.artistName ?? null,
    artworkUrl: dto.artworkUrl ?? null,
    appleMusicUrl: dto.appleMusicUrl ?? null,
    createdAt: dto.createdAt,
    isCompleted: dto.isCompleted,
  };
}

const FEED_PATH: Record<FeedKind, string> = {
  ing: '/posts/ing/infinite-scroll',
  done: '/posts/done/infinite-scroll',
};

/** Ing/Done 피드 무한스크롤 — 커서는 마지막 postId (원본 PostAPI.getIngPosts/getDonePosts) */
export async function getFeedPosts(
  kind: FeedKind,
  pageSize: number,
  lastPostId?: number,
): Promise<Post[]> {
  const res = await api.get<ApiResponse<InfiniteScrollPostDTO[]>>(FEED_PATH[kind], {
    query: { pageSize, lastPostId },
  });
  return unwrapList(res).map(fromInfiniteScroll);
}
