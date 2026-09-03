import { z } from 'zod';
import { api, parseData, parseList } from '@/shared/api';
import { commentSchema } from '@/entities/comment/@x/post';
import type { Post, FeedKind, PostDetail, CommentedPosts } from '../model/types';

/** 서버 Long id — client 가 정밀도 보존을 위해 문자열로 줄 수 있어 둘 다 허용 */
const idSchema = z.union([z.number(), z.string()]);

/** Post 엔티티 기본값 채우기 (DTO → Post 변환 보조) */
function makePost(p: Partial<Post> & { postId: string }): Post {
  return {
    writerId: null,
    title: null,
    content: null,
    songName: null,
    artistName: null,
    artworkUrl: null,
    appleMusicUrl: null,
    createdAt: null,
    isCompleted: null,
    ...p,
  };
}

/** 원본 InfiniteScrollPostDTO → Post (Ing/Done 무한스크롤) */
const infiniteScrollPostSchema = z
  .object({
    postId: idSchema,
    userId: idSchema.nullish(),
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
      writerId: dto.userId == null ? null : String(dto.userId),
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
  lastPostId?: string,
): Promise<Post[]> {
  const json = await api.get<unknown>(FEED_PATH[kind], { query: { pageSize, lastPostId } });
  return parseList(infiniteScrollPostSchema, json);
}

/** 원본 PostDetailDTO → PostDetail (detail + comments + isLiked) */
const postDetailSchema = z
  .object({
    postId: idSchema,
    userId: idSchema.nullish(),
    // 구버전 응답과 랜덤 게시글 캐시도 안전하게 수용한다.
    writerId: idSchema.nullish(),
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
      writerId:
        dto.userId != null
          ? String(dto.userId)
          : dto.writerId != null
            ? String(dto.writerId)
            : null,
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
export async function getPostDetail(postId: string): Promise<PostDetail> {
  const json = await api.get<unknown>(`/posts/${encodeURIComponent(postId)}`, {
    timeoutMs: 12_000,
  });
  return parseData(postDetailSchema, json);
}

/** 랜덤 사연 1건 (원본 PostAPI.getRandomPosts) — Home "흔들기" */
const randomPostSchema = z
  .object({
    postId: idSchema,
    writerId: idSchema.nullish(),
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
  getMyPostResponses: z.array(z.object({ postId: idSchema.nullish() })).nullish(),
});
export async function getMyPostIds(): Promise<string[]> {
  const json = await api.get<unknown>('/posts/my');
  const data = parseData(myPostsSchema, json);
  return (data.getMyPostResponses ?? [])
    .map((p) => (p.postId == null ? null : String(p.postId)))
    .filter((v): v is string => v != null);
}

// ── Inbox: 내 사연 / 좋아요 / 댓글 단 사연 ──────────────────────────

const s = (v: string | null | undefined) => v ?? null;

/** 원본 PostModelDTO → Post (내 사연) */
const postModelSchema = z
  .object({
    postId: idSchema.nullish(),
    writerId: idSchema.nullish(),
    title: z.string().nullish(),
    content: z.string().nullish(),
    songName: z.string().nullish(),
    artistName: z.string().nullish(),
    artworkUrl: z.string().nullish(),
    appleMusicUrl: z.string().nullish(),
    createdAt: z.string().nullish(),
    isCompleted: z.boolean().nullish(),
  })
  .transform((d) =>
    makePost({
      postId: String(d.postId ?? ''),
      writerId: d.writerId == null ? null : String(d.writerId),
      title: s(d.title),
      content: s(d.content),
      songName: s(d.songName),
      artistName: s(d.artistName),
      artworkUrl: s(d.artworkUrl),
      appleMusicUrl: s(d.appleMusicUrl),
      createdAt: s(d.createdAt),
      isCompleted: d.isCompleted ?? null,
    }),
  );

const myPostsFullSchema = z
  .object({ getMyPostResponses: z.array(postModelSchema).nullish() })
  .transform((d) => d.getMyPostResponses ?? []);

/** 내 사연 목록 (원본 PostAPI.getMyPosts) — GET /posts/my */
export async function getMyPosts(): Promise<Post[]> {
  const json = await api.get<unknown>('/posts/my');
  return parseData(myPostsFullSchema, json);
}

/** 원본 LikedPostDTO → Post */
const likedPostSchema = z
  .object({
    postId: idSchema,
    artworkUrl: z.string().nullish(),
    title: z.string().nullish(),
    content: z.string().nullish(),
    songName: z.string().nullish(),
    artistName: z.string().nullish(),
    appleMusicUrl: z.string().nullish(),
    createdAt: z.string().nullish(),
  })
  .transform((d) =>
    makePost({
      postId: String(d.postId),
      title: s(d.title),
      content: s(d.content),
      songName: s(d.songName),
      artistName: s(d.artistName),
      artworkUrl: s(d.artworkUrl),
      appleMusicUrl: s(d.appleMusicUrl),
      createdAt: s(d.createdAt),
    }),
  );

const likedPostsFullSchema = z
  .object({ getLikedPostsResponses: z.array(likedPostSchema).nullish() })
  .transform((d) => d.getLikedPostsResponses ?? []);

/** 좋아요한 사연 (원본 PostAPI.getLikedPosts) — GET /posts/liked */
export async function getLikedPosts(): Promise<Post[]> {
  const json = await api.get<unknown>('/posts/liked', { query: { pageSize: 20 } });
  return parseData(likedPostsFullSchema, json);
}

/** 원본 CommentedPostDTO → Post */
const commentedPostSchema = z
  .object({
    postId: idSchema,
    artworkUrl: z.string().nullish(),
    title: z.string().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .transform((d) =>
    makePost({
      postId: String(d.postId),
      title: s(d.title),
      artworkUrl: s(d.artworkUrl),
      createdAt: s(d.createdAt),
      updatedAt: s(d.updatedAt),
    }),
  );

const commentedPostsFullSchema = z
  .object({
    CommentedPostsCount: z.number().nullish(),
    getCommentedPostsResponses: z.array(commentedPostSchema).nullish(),
  })
  .transform((d): CommentedPosts => {
    const posts = d.getCommentedPostsResponses ?? [];
    return { count: d.CommentedPostsCount ?? posts.length, posts };
  });

/** 댓글 단 사연 (원본 PostAPI.getCommentedPosts) — GET /posts/commented */
export async function getCommentedPosts(): Promise<CommentedPosts> {
  const json = await api.get<unknown>('/posts/commented');
  return parseData(commentedPostsFullSchema, json);
}
