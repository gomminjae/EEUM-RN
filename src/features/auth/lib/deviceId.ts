import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'deviceId';

/** 외부 의존성 없는 UUID v4 (보안용 아님 — 디바이스 식별자용) */
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 최초 1회 생성 후 영속화 — 원본 iOS identifierForVendor 역할 */
export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
