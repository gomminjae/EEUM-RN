import { Platform } from 'react-native';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'deviceId';

async function getNativeDeviceId(): Promise<string | null> {
  if (Platform.OS === 'ios') {
    return Application.getIosIdForVendorAsync();
  }
  if (Platform.OS === 'android') {
    return Application.getAndroidId();
  }
  return null;
}

export async function getDeviceId(): Promise<string> {
  const cached = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (cached) return cached;

  const id = await getNativeDeviceId();
  if (!id) {
    throw new Error('기기 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
  }

  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
