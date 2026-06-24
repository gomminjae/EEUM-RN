import { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, spacing } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import { CommentItem, type Comment } from '@/entities/comment';
import { useToggleLike } from '@/features/like-post';
import { usePlayerStore } from '@/features/play-track';
import { CommentInputBar, ReportCommentSheet, useReportComment } from '@/features/comment';
import { PostActionSheet, useManagePost } from '@/features/manage-post';
import type { RootStackParamList } from '@/shared/config/navigation';
import { usePostDetail, useIsMyPost } from '../model/usePostDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { data: detail, isLoading, isError, refetch } = usePostDetail(postId);
  const isMyPost = useIsMyPost(postId);
  const toggleLike = useToggleLike(postId);
  const manage = useManagePost(postId);
  const report = useReportComment();
  const togglePlay = usePlayerStore((s) => s.toggle);
  const playingUrl = usePlayerStore((s) => (s.isPlaying ? s.currentUrl : null));

  const [actionSheet, setActionSheet] = useState(false);
  const [reportTarget, setReportTarget] = useState<Comment | null>(null);

  const handlePlay = useCallback(
    (c: Comment) => {
      if (c.appleMusicUrl) togglePlay(c.appleMusicUrl);
    },
    [togglePlay],
  );
  const handleReport = useCallback((c: Comment) => setReportTarget(c), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: isMyPost
        ? () => (
            <Pressable onPress={() => setActionSheet(true)} hitSlop={8}>
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
            </Pressable>
          )
        : undefined,
    });
  }, [navigation, isMyPost]);

  const confirmDelete = () => {
    setActionSheet(false);
    Alert.alert('게시물 삭제', '정말 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => manage.remove.mutate(undefined, { onSuccess: () => navigation.goBack() }),
      },
    ]);
  };

  const submitReport = (reason: string) => {
    const target = reportTarget;
    setReportTarget(null);
    if (!target?.commentId || !target.userId) return;
    report.mutate(
      {
        commentId: Number(target.commentId),
        reportedUserId: Number(target.userId),
        reportReason: reason,
      },
      {
        onSuccess: () => Alert.alert('신고 완료', '신고가 접수되었어요'),
        onError: () => Alert.alert('신고 실패', '잠시 후 다시 시도해주세요'),
      },
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-sm bg-main">
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }

  if (isError || !detail) {
    return (
      <View className="flex-1 items-center justify-center gap-sm bg-main">
        <AppText color="textFootnote">불러오지 못했어요</AppText>
        <Pressable onPress={() => refetch()} className="py-sm px-md">
          <AppText weight="semiBold" style={{ color: colors.accentPrimary }}>
            다시 시도
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-main"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        className="flex-1 bg-main"
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl }}
      >
        <AppText size={26} weight="bold">
          {detail.title}
        </AppText>
        <AppText size={13} color="textFootnote">
          {formatDate(detail.createdAt)}
        </AppText>
        <AppText size={16} className="leading-[24px] mt-sm">
          {detail.content}
        </AppText>

        <View className="flex-row items-center gap-md p-md mt-md bg-content rounded-[12px]">
          {detail.artworkUrl ? (
            <AppImage source={{ uri: detail.artworkUrl }} recyclingKey={detail.artworkUrl} className="w-[56px] h-[56px] rounded-[8px]" />
          ) : (
            <View className="w-[56px] h-[56px] rounded-[8px] bg-black/10" />
          )}
          <View className="flex-1 gap-xs">
            <AppText size={16} weight="semiBold" numberOfLines={1}>
              {detail.songName || '음악 정보 없음'}
            </AppText>
            <AppText size={14} color="textFootnote" numberOfLines={1}>
              {detail.artistName}
            </AppText>
          </View>
          <View className="flex-row items-center gap-md">
            {!!detail.appleMusicUrl && (
              <Pressable onPress={() => togglePlay(detail.appleMusicUrl)} hitSlop={8}>
                <Ionicons
                  name={playingUrl === detail.appleMusicUrl ? 'pause' : 'play'}
                  size={26}
                  color={colors.textPrimary}
                />
              </Pressable>
            )}
            <Pressable
              onPress={() => toggleLike.mutate(detail.isLiked)}
              disabled={toggleLike.isPending}
              hitSlop={8}
            >
              <Ionicons
                name={detail.isLiked ? 'heart' : 'heart-outline'}
                size={26}
                color={detail.isLiked ? colors.accentPrimary : colors.textPrimary}
              />
            </Pressable>
          </View>
        </View>

        <AppText size={15} weight="semiBold" className="mt-lg">
          댓글 {detail.comments.length}
        </AppText>
        {detail.comments.map((c, i) => (
          <CommentItem
            key={c.commentId ?? `comment-${i}`}
            comment={c}
            isPlaying={!!c.appleMusicUrl && playingUrl === c.appleMusicUrl}
            onPlay={handlePlay}
            onReport={handleReport}
          />
        ))}
        {detail.comments.length === 0 && (
          <AppText color="textFootnote" className="mt-md">
            첫 댓글을 남겨보세요
          </AppText>
        )}
      </ScrollView>

      <CommentInputBar postId={postId} />

      {isMyPost && (
        <PostActionSheet
          visible={actionSheet}
          onClose={() => setActionSheet(false)}
          isCompleted={false}
          onEdit={() => {
            setActionSheet(false);
            navigation.navigate('EditPost', { postId });
          }}
          onComplete={() => {
            setActionSheet(false);
            manage.complete.mutate();
          }}
          onDelete={confirmDelete}
        />
      )}

      <ReportCommentSheet
        visible={reportTarget != null}
        onClose={() => setReportTarget(null)}
        onSubmit={submitReport}
      />
    </KeyboardAvoidingView>
  );
}
