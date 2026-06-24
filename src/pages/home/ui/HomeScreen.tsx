import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, fonts, images } from '@/shared/ui';
import { useShake } from '@/shared/lib/useShake';
import { getRandomPost, type Post } from '@/entities/post';
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

  return (
    <View className="flex-1 bg-main">
      <View className="flex-1">
        {post ? <RandomPostCard post={post} /> : <ShakePrompt onTrigger={load} />}
      </View>
      <HomeBottomNav />
    </View>
  );
}

/** 대기 화면 — 큰 "Shake" + 안내 (시뮬레이터/탭 폴백으로 누르면 로드) */
function ShakePrompt({ onTrigger }: { onTrigger: () => void }) {
  return (
    <Pressable className="flex-1 bg-main justify-center" onPress={onTrigger}>
      <View className="px-lg gap-sm">
        <View className="flex-row items-end gap-sm">
          <Text
            className="text-primary"
            style={{ fontFamily: fonts.helvetica.bold, fontSize: 96 }}
          >
            Shake
          </Text>
          <Image
            source={images.logo}
            className="w-[40px] h-[40px] mb-[12px]"
            resizeMode="contain"
          />
        </View>
        <Text
          className="text-primary leading-[24px]"
          style={{ fontFamily: fonts.helvetica.regular, fontSize: 18 }}
        >
          {'to receive someone’s letter\nanswer with music'}
        </Text>
      </View>
    </Pressable>
  );
}

/** 원본 RandomPostCard — 슬라이드 등장 + 살짝 흔들리는 애니메이션 */
function RandomPostCard({ post }: { post: Post }) {
  const navigation = useNavigation<Nav>();

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // 새 사연마다 재생 (원본 .id(post.postId) + onAppear)
    translateY.value = 300;
    opacity.value = 0;
    rotate.value = 0;
    translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 400 });
    // gentle single shake: -4 → 3 → 0
    rotate.value = withDelay(
      200,
      withSequence(
        withTiming(-4, { duration: 150 }),
        withTiming(3, { duration: 150 }),
        withTiming(0, { duration: 200 }),
      ),
    );
  }, [post.postId]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));
  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="flex-1 bg-main pt-lg">
      <AppText size={18} color="textFootnote" className="text-center leading-[24px]">
        {'Shake to receive someone’s letter\nanswer with music'}
      </AppText>

      <Animated.View
        className="mx-[42px] mt-[32px] p-lg min-h-[380px] rounded-[20px] bg-[#EAE8E0]/50 gap-md"
        style={cardStyle}
      >
        <AppText size={18} weight="bold">
          {post.title ?? '제목 없음'}
        </AppText>
        <AppText size={14} color="textFootnote" numberOfLines={8} className="leading-[20px]">
          {post.content ?? ''}
        </AppText>
      </Animated.View>

      <View className="flex-1" />

      {post.postId && (
        <Animated.View className="px-[32px] pb-lg" style={fadeStyle}>
          <Pressable
            className="h-[50px] rounded-[25px] bg-[#000000] items-center justify-center"
            onPress={() => navigation.navigate('PostDetail', { postId: post.postId! })}
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
