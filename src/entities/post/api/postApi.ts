import { z } from 'zod';
import { api, parseData, parseList } from '@/shared/api';
import { commentSchema } from '@/entities/comment/@x/post';
import type { Post, FeedKind, PostDetail } from '../model/types';

/** 원본 InfiniteScrollPostDTO → Post (Ing/Done 무한스크롤) */
const infiniteScrollPostSchema = z
  .object({
    postId: z.number(),
    title: z.string(),
    content: z.string(),
    songName: z.string().nullish(),
    artistName: z.string().nullish(),
    artworkUrl: z.string().nullish(),
    appleMusicUrl: z.string().nullish(),
    createdAt: z.string(),
    isCompleted: z.boolean(),
  })
  .transform(
    (dto): Post => ({
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
    }),
  );

const FEED_PATH: Record<FeedKind, string> = {
  ing: '/posts/ing/infinite-scroll',
  done: '/posts/done/infinite-scroll',
};

/** Ing/Done 피드 무한스크롤 — 커서는 마지막 postId */
export async function getFeedPosts(
  kind: FeedKind,
  pageSize: number,
  lastPostId?: number,
): Promise<Post[]> {
  const json = await api.get<unknown>(FEED_PATH[kind], { query: { pageSize, lastPostId } });
  return parseList(infiniteScrollPostSchema, json);
}

/** 원본 PostDetailDTO → PostDetail (detail + comments + isLiked) */
const postDetailSchema = z
  .object({
    postId: z.number(),
    title: z.string().nullish(),
    content: z.string().nullish(),
    songName: z.string().nullish(),
    artistName: z.string().nullish(),
    artworkUrl: z.string().nullish(),
    appleMusicUrl: z.string().nullish(),
    createdAt: z.string().nullish(),
    isLiked: z.boolean().nullish(),
    comments: z.array(commentSchema).nullish(),
  })
  .transform(
    (dto): PostDetail => ({
      postId: String(dto.postId),
      title: dto.title ?? '',
      content: dto.content ?? '',
      songName: dto.songName ?? '',
      artistName: dto.artistName ?? '',
      artworkUrl: dto.artworkUrl ?? '',
      appleMusicUrl: dto.appleMusicUrl ?? '',
      createdAt: dto.createdAt ?? '',
      isLiked: dto.isLiked ?? false,
      comments: dto.comments ?? [],
    }),
  );

/** 게시물 상세 (원본 PostAPI.getPostDetail) — GET /posts/{id} */
export async function getPostDetail(postId: number): Promise<PostDetail> {
  const json = await api.get<unknown>(`/posts/${postId}`);
  return parseData(postDetailSchema, json);
}

/** 랜덤 사연 1건 (원본 PostAPI.getRandomPosts) — Home "흔들기" */
const randomPostSchema = z
  .object({
    postId: z.number(),
    writerId: z.number().nullish(),
    title: z.string(),
    content: z.string(),
  })
  .transform(
    (dto): Post => ({
      postId: String(dto.postId),
      writerId: dto.writerId == null ? null : String(dto.writerId),
      title: dto.title,
      content: dto.content,
      songName: null,
      artistName: null,
      artworkUrl: null,
      appleMusicUrl: null,
      createdAt: null,
      isCompleted: null,
    }),
  );

export async function getRandomPost(): Promise<Post | null> {
  const json = await api.get<unknown>('/posts/random');
  // data 가 null 일 수 있어 parseData 대신 직접 처리
  const res = z
    .object({ result: z.string(), data: randomPostSchema.nullable(), error: z.unknown().nullish() })
    .parse(json);
  return res.data ?? null;
}

/** 내 게시물 id 목록 (원본 PostAPI.getMyPosts) — 소유 여부 판별용 */
const myPostsSchema = z.object({
  postCount: z.number().nullish(),
  getMyPostResponses: z.array(z.object({ postId: z.number().nullish() })).nullish(),
});
export async function getMyPostIds(): Promise<string[]> {
  const json = await api.get<unknown>('/posts/my');
  const data = parseData(myPostsSchema, json);
  return (data.getMyPostResponses ?? [])
    .map((p) => (p.postId == null ? null : String(p.postId)))
    .filter((v): v is string => v != null);
}
