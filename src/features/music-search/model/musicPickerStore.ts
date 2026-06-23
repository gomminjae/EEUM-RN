import { create } from 'zustand';
import type { Music } from '@/entities/track';

/** 검색 화면에서 고른 음악을 호출한 화면(Share 등)으로 전달하는 brige.
 *  원본 coordinator.makeMusicSearchView(onSelect) 의 콜백을 대체 */
type MusicPickerState = {
  picked: Music | null;
  pick: (music: Music) => void;
  consume: () => Music | null;
  clear: () => void;
};

export const useMusicPicker = create<MusicPickerState>((set, get) => ({
  picked: null,
  pick: (music) => set({ picked: music }),
  consume: () => {
    const m = get().picked;
    if (m) set({ picked: null });
    return m;
  },
  clear: () => set({ picked: null }),
}));
