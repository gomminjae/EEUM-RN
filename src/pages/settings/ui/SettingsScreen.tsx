import { Pressable, Linking, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { AppText, spacing } from '@/shared/ui';

/** 원본 SettingView 이식 — FAQ / Contacts us / Terms / Privacy */
const NOTION_URL = 'https://www.notion.so/220a8ad06b41800886aedbe718fa6c3c';

const ROWS: { title: string; action: () => void }[] = [
  { title: 'FAQ', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
  { title: 'Contacts us', action: () => Linking.openURL('mailto:eeum.app@gmail.com') },
  { title: 'Terms of services', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
  { title: 'Privacy Policy', action: () => WebBrowser.openBrowserAsync(NOTION_URL) },
];

export function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-main" contentContainerStyle={{ paddingTop: spacing.md }}>
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
