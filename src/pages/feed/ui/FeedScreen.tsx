import { useCallback, useLayoutEffect, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, fonts, images } from '@/shared/ui';
import { type FeedKind, type Post } from '@/entities/post';
import { usePlayerStore } from '@/features/play-track';
import type { RootStackParamList } from '@/shared/config/navigation';
import { useFeed } from '../model/useFeed';
import { IngCarousel } from './IngCarousel';
import { DoneGrid } from './DoneGrid';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: FeedKind; label: string }[] = [
  { key: 'ing', label: 'Ing' },
  { key: 'done', label: 'Done' },
];

export function FeedScreen() {
  const [tab, setTab] = useState<FeedKind>('ing');
  const query = useFeed(tab);
  const navigation = useNavigation<Nav>();
  const togglePlay = usePlayerStore((s) => s.toggle);
  const playingUrl = usePlayerStore((s) => (s.isPlaying ? s.currentUrl : null));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <AppImage
            source={images.home}
            style={{ width: 20, height: 20 }}
            tintColor={colors.textPrimary}
            contentFit="contain"
          />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('PostsList')}
          hitSlop={8}
          className="flex-row items-center gap-[4px] px-md py-[8px] bg-content rounded-[20px]"
        >
          <AppText size={15} weight="medium">
            Inbox
          </AppText>
          <Ionicons
            name="arrow-up"
            size={13}
            color={colors.textPrimary}
            style={{ transform: [{ rotate: '45deg' }] }}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  const posts = query.data?.pages.flat() ?? [];

  const openPost = useCallback(
    (post: Post) => {
      if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
    },
    [navigation],
  );

  return (
    <View className="flex-1 bg-main">
      <View className="flex-row gap-[20px] px-[20px] pt-[20px] pb-sm">
        {TABS.map(({ key, label }) => (
          <Pressable key={key} onPress={() => setTab(key)} hitSlop={8}>
            <AppText
              size={28}
              style={{
                fontFamily: fonts.helvetica.bold,
                color: tab === key ? colors.textPrimary : colors.textFootnote,
              }}
            >
              {label}
            </AppText>
          </Pressable>
        ))}
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center gap-sm pt-[80px]">
          <ActivityIndicator color={colors.accentPrimary} />
        </View>
      ) : tab === 'ing' ? (
        <IngCarousel
          query={query}
          posts={posts}
          onPressPost={openPost}
          playingUrl={playingUrl}
          onPlay={togglePlay}
        />
      ) : (
        <DoneGrid query={query} posts={posts} onPressPost={openPost} />
      )}
    </View>
  );
}
