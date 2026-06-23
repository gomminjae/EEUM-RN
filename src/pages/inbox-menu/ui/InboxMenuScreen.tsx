import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors } from '@/shared/ui';
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

  return (
    <View style={styles.wrap}>
      {MENU.map((m) => (
        <Pressable
          key={m.label}
          onPress={() => navigation.navigate(m.route as 'PostsList' | 'CommentsList' | 'LikesList')}
          style={styles.item}
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

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.mainBackground,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: { paddingVertical: 12 },
});
