import { View, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, images } from '@/shared/ui';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 MainView 의 하단 커스텀 nav (탭바 아님).
 *  feed / share 두 NavigationLink — 90pt 간격, padding vertical 12. */
export function HomeBottomNav() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <View style={styles.row}>
        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate('Feed')}
          hitSlop={8}
        >
          <Image source={images.folder} style={styles.icon} resizeMode="contain" />
          <AppText size={12}>feed</AppText>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate('Share')}
          hitSlop={8}
        >
          <Image source={images.headphone} style={styles.icon} resizeMode="contain" />
          <AppText size={12}>share</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.mainBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 90,
  },
  item: {
    width: 60,
    alignItems: 'center',
    gap: 4,
  },
  icon: { width: 24, height: 24, tintColor: colors.textPrimary },
});
