import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

type Options = { threshold?: number; cooldown?: number };

/** 기기 흔들기 감지 — 원본 iOS UIWindow.motionEnded(.motionShake) 대체.
 *  가속도 크기(중력 포함, 정지 시 ≈1g)가 threshold 를 넘고 cooldown 이 지나면 발화 */
export function useShake(onShake: () => void, { threshold = 1.8, cooldown = 1000 }: Options = {}) {
  const last = useRef(0);
  const cb = useRef(onShake);
  cb.current = onShake;

  useEffect(() => {
    Accelerometer.setUpdateInterval(80);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (magnitude > threshold && now - last.current > cooldown) {
        last.current = now;
        cb.current();
      }
    });
    return () => sub.remove();
  }, [threshold, cooldown]);
}
