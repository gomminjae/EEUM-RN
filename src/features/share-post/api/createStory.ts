import { api } from '@/shared/api';
import type { Music } from '@/entities/track';

export type CompletionType = 'AUTO_COMPLETION' | 'MANUAL_COMPLETION';

export type ShareDraft = {
  title: string;
  description: string;
  story: string;
  music: Music | null;
  completionType: CompletionType;
  commentCountLimit: number;
};

/** 원본 ShareUseCase.shareStory → PostAPI.createPost 매핑 (POST /posts) */
export function createStory(draft: ShareDraft) {
  const { music } = draft;
  return api.post('/posts', {
    title: draft.title,
    content: draft.story,
    albumName: music?.albumName ?? draft.description,
    songName: music?.songName ?? '',
    artistName: music?.artistName ?? '',
    artworkUrl: music?.artworkUrl ?? '',
    appleMusicUrl: music?.previewMusicUrl ?? '',
    completionType: draft.completionType,
    commentCountLimit: draft.commentCountLimit,
  });
}
