import { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing, images } from '@/shared/ui';
import { useShake } from '@/shared/lib/useShake';
import { getRandomPost, type Post } from '@/entities/post';
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

  if (post) {
    return <RandomPostCard post={post} />;
  }
  return <ShakePrompt onTrigger={load} />;
}

/** 대기 화면 — 큰 "Shake" + 안내 (시뮬레이터/탭 폴백으로 누르면 로드) */
function ShakePrompt({ onTrigger }: { onTrigger: () => void }) {
  return (
    <Pressable style={styles.promptContainer} onPress={onTrigger}>
      <View style={styles.promptText}>
        <View style={styles.shakeRow}>
          <Text style={styles.shake}>Shake</Text>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.shakeSub}>{'to receive someone’s letter\nanswer with music'}</Text>
      </View>
    </Pressable>
  );
}

/** 원본 RandomPostCard — 슬라이드 등장 + 살짝 흔들리는 애니메이션 */
function RandomPostCard({ post }: { post: Post }) {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.cardContainer, { paddingTop: insets.top + spacing.lg }]}>
      <AppText size={18} color="textFootnote" style={styles.cardCaption}>
        {'Shake to receive someone’s letter\nanswer with music'}
      </AppText>

      <Animated.View style={[styles.card, cardStyle]}>
        <AppText size={18} weight="bold">
          {post.title ?? '제목 없음'}
        </AppText>
        <AppText size={14} color="textFootnote" numberOfLines={8} style={styles.cardBody}>
          {post.content ?? ''}
        </AppText>
      </Animated.View>

      <View style={styles.spacer} />

      {post.postId && (
        <Animated.View style={[styles.viewWrap, { paddingBottom: insets.bottom + spacing.xl }, fadeStyle]}>
          <Pressable
            style={styles.viewButton}
            onPress={() => navigation.navigate('PostDetail', { postId: post.postId! })}
          >
            <Text style={styles.viewLabel}>view</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  promptContainer: { flex: 1, backgroundColor: colors.mainBackground, justifyContent: 'center' },
  promptText: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  shakeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  logo: { width: 40, height: 40, marginBottom: 12 },
  shake: { fontFamily: fonts.helvetica.bold, fontSize: 96, color: colors.textPrimary },
  shakeSub: { fontFamily: fonts.helvetica.regular, fontSize: 18, color: colors.textPrimary, lineHeight: 24 },

  cardContainer: { flex: 1, backgroundColor: colors.mainBackground },
  cardCaption: { textAlign: 'center', lineHeight: 24 },
  card: {
    marginHorizontal: 42,
    marginTop: 32,
    padding: 24,
    minHeight: 380,
    borderRadius: 20,
    backgroundColor: 'rgba(234,232,224,0.5)',
    gap: spacing.md,
  },
  cardBody: { lineHeight: 20 },
  spacer: { flex: 1 },
  viewWrap: { paddingHorizontal: 32 },
  viewButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLabel: { fontFamily: fonts.pretendard.medium, fontSize: 16, color: '#FFFFFF' },
});
