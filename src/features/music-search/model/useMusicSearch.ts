import { useQuery } from '@tanstack/react-query';
import { searchMusic } from '@/entities/track';

/** 디바운스된 검색어로 음악 검색 (원본 MusicSearchUseCase) */
export function useMusicSearch(term: string) {
  const trimmed = term.trim();
  return useQuery({
    queryKey: ['music-search', trimmed],
    queryFn: () => searchMusic(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 5 * 60_000,
  });
}
