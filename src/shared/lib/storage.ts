import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** 원본의 UserDefaults "accessToken" 을 SecureStore 로 대체 */
const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_PROVIDER_KEY = "authProvider";

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
