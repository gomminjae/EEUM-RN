import { useLayoutEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, fonts } from '@/shared/ui';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MENU: { label: string; route: keyof RootStackParamList }[] = [
  { label: 'Posts', route: 'PostsList' },
  { label: 'Comments', route: 'CommentsList' },
  { label: 'Likes', route: 'LikesList' },
];

/** 원본 InboxMenuListView — Posts / Comments / Likes 세로 28pt 메뉴 */
export function InboxMenuScreen() {
  const navigation = useNavigation<Nav>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'menu',
      headerTitleStyle: { fontFamily: fonts.pretendard.bold, color: '#000000' },
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-main px-[20px] pt-[20px]">
      {MENU.map((m) => (
        <Pressable
          key={m.label}
          onPress={() => navigation.navigate(m.route as 'PostsList' | 'CommentsList' | 'LikesList')}
          className="py-[12px]"
          hitSlop={8}
        >
          <AppText size={28} weight="bold">
            {m.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
