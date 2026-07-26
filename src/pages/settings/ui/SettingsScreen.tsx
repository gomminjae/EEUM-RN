import { useLayoutEffect } from 'react';
import { Pressable, Linking, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { AppText, colors } from '@/shared/ui';

/** 원본 SettingView 이식 — FAQ / Contacts us / Terms / Privacy */
const NOTION_URL = 'https://www.notion.so/220a8ad06b41800886aedbe718fa6c3c';

const ROWS: { title: string; action: () => void }[] = [
  { title: 'FAQ', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
  {
    title: 'Contacts us',
    // 메일 앱이 없으면(시뮬레이터 등) openURL 이 reject — 주소 안내로 폴백
    action: () =>
      Linking.openURL('mailto:eeum.app@gmail.com').catch(() =>
        Alert.alert('문의', 'eeum.app@gmail.com 으로 문의해주세요.'),
      ),
  },
  { title: 'Terms of services', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
  { title: 'Privacy Policy', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
];

export function SettingsScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-main" contentContainerStyle={{ paddingTop: 20 }}>
      {ROWS.map(({ title, action }) => (
        <Pressable key={title} className="px-lg py-[18px]" onPress={action}>
          <AppText size={16} weight="medium">
            {title}
          </AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}
