import * as SecureStore from 'expo-secure-store';

/** 원본의 UserDefaults "accessToken" 을 SecureStore 로 대체 */
const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};
