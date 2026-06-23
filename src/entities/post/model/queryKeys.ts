import type { FeedKind } from './types';

/** post 도메인 쿼리 키 — pages/features 가 공유 (레이어 규칙상 entities 에 위치) */
export const postKeys = {
  detail: (postId: string) => ['post', postId] as const,
  feed: (kind: FeedKind) => ['feed', kind] as const,
};
