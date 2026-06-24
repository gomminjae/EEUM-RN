import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, images } from '@/shared/ui';

const hairline = StyleSheet.hairlineWidth;
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 MainView 의 하단 커스텀 nav (탭바 아님).
 *  feed / share 두 NavigationLink — 90pt 간격, padding vertical 12. */
export function HomeBottomNav() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-main border-t border-t-black/[0.04]"
      style={{ borderTopWidth: hairline, paddingBottom: insets.bottom }}
    >
      <View className="flex-row justify-center py-[12px] gap-[90px]">
        <Pressable
          className="w-[60px] items-center gap-xs"
          onPress={() => navigation.navigate('Feed')}
          hitSlop={8}
        >
          <AppImage
            source={images.folder}
            className="w-[24px] h-[24px]"
            tintColor={colors.textPrimary}
            contentFit="contain"
          />
          <AppText size={12}>feed</AppText>
        </Pressable>

        <Pressable
          className="w-[60px] items-center gap-xs"
          onPress={() => navigation.navigate('Share')}
          hitSlop={8}
        >
          <AppImage
            source={images.headphone}
            className="w-[24px] h-[24px]"
            tintColor={colors.textPrimary}
            contentFit="contain"
          />
          <AppText size={12}>share</AppText>
        </Pressable>
      </View>
    </View>
  );
}
