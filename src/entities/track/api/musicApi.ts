import { api, unwrapList, type ApiResponse } from '@/shared/api';
import type { Music } from '../model/types';

/** 원본 MusicDTO — Music 과 동일 shape */
type MusicDTO = Music;

/** 음악 검색 (원본 MusicAPI.search) — GET /apple-music/search */
export async function searchMusic(term: string): Promise<Music[]> {
  const res = await api.get<ApiResponse<MusicDTO[]>>('/apple-music/search', {
    query: { term, types: 'songs', limit: '20' },
  });
  return unwrapList(res);
}
