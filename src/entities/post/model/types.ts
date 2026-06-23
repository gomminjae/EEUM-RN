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
