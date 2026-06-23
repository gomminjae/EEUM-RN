import { z } from 'zod';
import { api, parseList } from '@/shared/api';
import type { Music } from '../model/types';

/** 원본 MusicDTO — Music 과 동일 shape */
const musicSchema = z.object({
  albumName: z.string(),
  songName: z.string(),
  artistName: z.string(),
  artworkUrl: z.string(),
  previewMusicUrl: z.string(),
});

/** 음악 검색 (원본 MusicAPI.search) — GET /apple-music/search */
export async function searchMusic(term: string): Promise<Music[]> {
  const json = await api.get<unknown>('/apple-music/search', {
    query: { term, types: 'songs', limit: '20' },
  });
  return parseList(musicSchema, json);
}
