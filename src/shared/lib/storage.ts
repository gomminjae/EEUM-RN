import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** 원본의 UserDefaults "accessToken" 을 SecureStore 로 대체 */
const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_PROVIDER_KEY = "authProvider";
const CURRENT_USER_ID_KEY = "currentUserId";

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};

export const authProviderStorage = {
  get: () => AsyncStorage.getItem(AUTH_PROVIDER_KEY),
  set: (provider: string) => AsyncStorage.setItem(AUTH_PROVIDER_KEY, provider),
  clear: () => AsyncStorage.removeItem(AUTH_PROVIDER_KEY),
};

export const currentUserIdStorage = {
  get: () => AsyncStorage.getItem(CURRENT_USER_ID_KEY),
  set: (userId: string) => AsyncStorage.setItem(CURRENT_USER_ID_KEY, userId),
  clear: () => AsyncStorage.removeItem(CURRENT_USER_ID_KEY),
};
