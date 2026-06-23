import type { Comment } from '@/entities/comment/@x/post';

/** 원본 Domain/Entity/Post 이식 — 서버 필드가 대부분 nullable */
export type Post = {
  postId: string | null;
  writerId: string | null;
  title: string | null;
  content: string | null;
  songName: string | null;
  artistName: string | null;
  artworkUrl: string | null;
  appleMusicUrl: string | null;
  createdAt: string | null;
  isCompleted: boolean | null;
};

export type FeedKind = 'ing' | 'done';

/** 원본 Domain/Entity/PostDetail 이식 — getPostDetail 응답 (필드 non-null로 정규화) */
export type PostDetail = {
  postId: string;
  title: string;
  content: string;
  songName: string;
  artistName: string;
  artworkUrl: string;
  appleMusicUrl: string;
  createdAt: string;
  isLiked: boolean;
  comments: Comment[];
};
