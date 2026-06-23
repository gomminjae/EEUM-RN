/** 원본 eeum_iOS `Env.swift` 이식: DEBUG → /dev, RELEASE → prod */
export const ENV = {
  baseURL: __DEV__ ? 'https://eeum.xyz/dev' : 'https://eeum.xyz',
} as const;
