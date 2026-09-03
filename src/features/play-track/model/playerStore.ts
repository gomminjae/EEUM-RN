import { create } from 'zustand';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** 앱 전역 단일 오디오 플레이어 — 원본 AudioPlayerService(싱글톤) 이식.
 *  한 번에 한 트랙만 재생, 같은 url 토글 시 일시정지/재개. */
type PlayerState = {
  currentUrl: string | null;
  isPlaying: boolean;
  error: string | null;
  toggle: (url: string) => void;
  /** 항상 처음부터 재생 (원본 stop→play) — 카드 전환 자동재생용, 같은 url 토글 방지 */
  play: (url: string) => void;
  stop: () => void;
};

let player: AudioPlayer | null = null;
let audioModePromise: Promise<void> | null = null;
let playbackOperation = 0;
let lastReportedError: string | null = null;

function configureAudio(): Promise<void> {
  if (!audioModePromise) {
    audioModePromise = setAudioModeAsync({ playsInSilentMode: true }).catch((error: unknown) => {
      audioModePromise = null;
      throw error;
    });
  }
  return audioModePromise;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function ensurePlayer(set: (partial: Partial<PlayerState>) => void): AudioPlayer {
  if (!player) {
    player = createAudioPlayer();
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.error) {
        if (lastReportedError !== status.error) {
          lastReportedError = status.error;
          console.warn('[audio] playback failed', {
            error: status.error,
            playbackState: status.playbackState,
            reasonForWaitingToPlay: status.reasonForWaitingToPlay,
          });
        }
        set({ isPlaying: false, error: status.error });
        return;
      }

      if (status.playing) lastReportedError = null;
      set({
        isPlaying: status.didJustFinish ? false : status.playing,
        error: null,
      });
    });
  }
  return player;
}

function startPlayback(
  url: string,
  operation: number,
  set: (partial: Partial<PlayerState>) => void,
  replaceSource: boolean,
) {
  void configureAudio()
    .then(() => {
      if (operation !== playbackOperation) return;

      const activePlayer = ensurePlayer(set);
      if (replaceSource) activePlayer.replace({ uri: url });
      activePlayer.play();
      set({ currentUrl: url, error: null });
    })
    .catch((error: unknown) => {
      if (operation !== playbackOperation) return;

      const message = errorMessage(error);
      console.warn('[audio] setup failed', { error: message });
      set({ currentUrl: null, isPlaying: false, error: message });
    });
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentUrl: null,
  isPlaying: false,
  error: null,

  toggle: (url) => {
    if (!url) return;
    const { currentUrl, isPlaying } = get();

    if (currentUrl === url && player) {
      if (isPlaying) {
        playbackOperation += 1;
        player.pause();
        set({ isPlaying: false });
      } else {
        const operation = ++playbackOperation;
        startPlayback(url, operation, set, false);
      }
      return;
    }

    const operation = ++playbackOperation;
    startPlayback(url, operation, set, true);
  },

  play: (url) => {
    if (!url) return;
    const operation = ++playbackOperation;
    startPlayback(url, operation, set, true);
  },

  stop: () => {
    playbackOperation += 1;
    player?.pause();
    set({ currentUrl: null, isPlaying: false, error: null });
  },
}));

/** 특정 url 이 지금 재생 중인지 (원본 isCurrentlyPlaying) */
export function useIsPlaying(url: string | null | undefined): boolean {
  return usePlayerStore((s) => !!url && s.currentUrl === url && s.isPlaying);
}
