import { api, unwrap, unwrapList, type ApiResponse } from '@/shared/api';
import { fromCommentDTO, type CommentModelDTO } from '@/entities/comment';
import type { Post, FeedKind, PostDetail } from '../model/types';

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

/** 원본 PostDetailDTO (detail + comments + isLiked 한 번에 반환) */
type PostDetailDTO = {
  postId: number;
  title?: string | null;
  content?: string | null;
  songName?: string | null;
  artistName?: string | null;
  artworkUrl?: string | null;
  appleMusicUrl?: string | null;
  createdAt?: string | null;
  isLiked?: boolean | null;
  comments?: CommentModelDTO[] | null;
};

function fromPostDetail(dto: PostDetailDTO): PostDetail {
  return {
    postId: String(dto.postId),
    title: dto.title ?? '',
    content: dto.content ?? '',
    songName: dto.songName ?? '',
    artistName: dto.artistName ?? '',
    artworkUrl: dto.artworkUrl ?? '',
    appleMusicUrl: dto.appleMusicUrl ?? '',
    createdAt: dto.createdAt ?? '',
    isLiked: dto.isLiked ?? false,
    comments: (dto.comments ?? []).map(fromCommentDTO),
  };
}

/** 게시물 상세 (원본 PostAPI.getPostDetail) — GET /posts/{id} */
export async function getPostDetail(postId: number): Promise<PostDetail> {
  const res = await api.get<ApiResponse<PostDetailDTO>>(`/posts/${postId}`);
  return fromPostDetail(unwrap(res));
}

/** 내 게시물 id 목록 (원본 PostAPI.getMyPosts) — 소유 여부 판별용 */
type MyPostsResponseDTO = {
  postCount?: number | null;
  getMyPostResponses?: { postId?: number | null }[] | null;
};
export async function getMyPostIds(): Promise<string[]> {
  const res = await api.get<ApiResponse<MyPostsResponseDTO>>('/posts/my');
  const list = res.data?.getMyPostResponses ?? [];
  return list.map((p) => (p.postId == null ? null : String(p.postId))).filter((v): v is string => v != null);
}
