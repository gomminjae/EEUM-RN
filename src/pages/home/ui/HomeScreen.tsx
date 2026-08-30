import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppImage, fonts, images } from '@/shared/ui';
import { useShake } from '@/shared/lib/useShake';
import { getRandomPost, primePostDetail, type Post } from '@/entities/post';
import { HomeBottomNav } from '@/widgets/home-bottom-nav';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 HomeView 이식 — 흔들면 랜덤 사연 카드 등장 */
export function HomeScreen() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  // 원본 loadRandomPost: getRandomPosts().first, 없으면 알림, isLoading 가드
  const load = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const p = await getRandomPost();
      if (p) setPost(p);
      else Alert.alert('알림', '현재 받을 수 있는 게시글이 없습니다.');
    } catch {
      // 원본도 실패 시 조용히 무시
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useShake(load);

  const navigation = useNavigation<Nav>();
  // 원본: 카드 표시 중 toolbar principal 에 로고
  useEffect(() => {
    navigation.setOptions({
      headerTitle: post
        ? () => <AppImage source={images.logo} style={{ width: 28, height: 28 }} contentFit="contain" />
        : undefined,
    });
  }, [navigation, post]);

  return (
    <View className="flex-1 bg-main">
      <View className="flex-1">
        {post ? <RandomPostCard post={post} /> : <ShakePrompt onTrigger={load} />}
      </View>
      <HomeBottomNav />
    </View>
  );
}

/** 대기 화면 — 큰 "Shake" + 안내 (원본처럼 탭 폴백은 개발 환경 한정) */
function ShakePrompt({ onTrigger }: { onTrigger: () => void }) {
  return (
    <Pressable className="flex-1 bg-main justify-center" onPress={__DEV__ ? onTrigger : undefined}>
      <View className="px-lg gap-sm">
        <View className="flex-row items-end gap-sm">
          <Text
            className="text-black"
            style={{ fontFamily: fonts.helvetica.bold, fontSize: 96 }}
          >
            Shake
          </Text>
          <AppImage
            source={images.logo}
            className="w-[40px] h-[40px] mb-[12px]"
            contentFit="contain"
          />
        </View>
        <Text
          className="text-black leading-[24px]"
          style={{ fontFamily: fonts.helvetica.regular, fontSize: 18 }}
        >
          {'to receive someone’s letter\nanswer with music'}
        </Text>
      </View>
    </Pressable>
  );
}

/** 원본 RandomPostCard — 짧고 가벼운 흔들림으로 등장 */
function RandomPostCard({ post }: { post: Post }) {
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();

  const translateY = useSharedValue(12);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.98);

  useEffect(() => {
    // 새 사연마다 재생 (원본 .id(post.postId) + onAppear)
    translateY.value = 12;
    translateX.value = 0;
    opacity.value = 0;
    scale.value = 0.98;
    translateY.value = withTiming(0, { duration: 160 });
    opacity.value = withTiming(1, { duration: 120 });
    scale.value = withTiming(1, { duration: 160 });
    translateX.value = withSequence(
      withTiming(-6, { duration: 45 }),
      withTiming(6, { duration: 60 }),
      withTiming(-3, { duration: 50 }),
      withTiming(0, { duration: 45 }),
    );
  }, [post.postId]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="flex-1 bg-main pt-[12px]">
      <AppText size={18} color="systemGray" className="text-center leading-[24px]">
        {'Shake to receive someone’s letter\nanswer with music'}
      </AppText>

      <Animated.View
        className="mx-[42px] mt-[32px] p-lg min-h-[380px] rounded-[20px] bg-[#EAE8E0]/50 gap-[12px]"
        style={cardStyle}
      >
        <AppText size={18} weight="bold" color="black">
          {post.title ?? '제목 없음'}
        </AppText>
        <AppText size={14} color="systemGray" numberOfLines={8} className="leading-[20px]">
          {post.content ?? ''}
        </AppText>
      </Animated.View>

      <View className="flex-1" />

      {post.postId && (
        <Animated.View className="px-[32px] pb-lg" style={fadeStyle}>
          <Pressable
            className="h-[50px] rounded-[25px] bg-[#000000] items-center justify-center"
            onPress={() => {
              primePostDetail(queryClient, post);
              navigation.navigate('PostDetail', { postId: post.postId! });
            }}
          >
            <Text
              className="text-white"
              style={{ fontFamily: fonts.pretendard.medium, fontSize: 16 }}
            >
              view
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
