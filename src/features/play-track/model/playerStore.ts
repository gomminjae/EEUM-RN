import { create } from 'zustand';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** 앱 전역 단일 오디오 플레이어 — 원본 AudioPlayerService(싱글톤) 이식.
 *  한 번에 한 트랙만 재생, 같은 url 토글 시 일시정지/재개. */
type PlayerState = {
  currentUrl: string | null;
  isPlaying: boolean;
  toggle: (url: string) => void;
  /** 항상 처음부터 재생 (원본 stop→play) — 카드 전환 자동재생용, 같은 url 토글 방지 */
  play: (url: string) => void;
  stop: () => void;
};

let player: AudioPlayer | null = null;
let configured = false;

function ensurePlayer(set: (partial: Partial<PlayerState>) => void): AudioPlayer {
  if (!configured) {
    configured = true;
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }
  if (!player) {
    player = createAudioPlayer();
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) set({ isPlaying: false });
      else set({ isPlaying: status.playing });
    });
  }
  return player;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentUrl: null,
  isPlaying: false,

  toggle: (url) => {
    if (!url) return;
    const p = ensurePlayer(set);
    const { currentUrl, isPlaying } = get();

    if (currentUrl === url) {
      if (isPlaying) {
        p.pause();
        set({ isPlaying: false });
      } else {
        p.play();
        set({ isPlaying: true });
      }
      return;
    }

    p.replace(url);
    p.play();
    set({ currentUrl: url, isPlaying: true });
  },

  play: (url) => {
    if (!url) return;
    const p = ensurePlayer(set);
    p.replace(url);
    p.play();
    set({ currentUrl: url, isPlaying: true });
  },

  stop: () => {
    player?.pause();
    set({ currentUrl: null, isPlaying: false });
  },
}));

/** 특정 url 이 지금 재생 중인지 (원본 isCurrentlyPlaying) */
export function useIsPlaying(url: string | null | undefined): boolean {
  return usePlayerStore((s) => !!url && s.currentUrl === url && s.isPlaying);
}
