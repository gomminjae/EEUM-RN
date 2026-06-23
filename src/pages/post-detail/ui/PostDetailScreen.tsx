import { useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, colors, spacing } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import { CommentItem, type Comment } from '@/entities/comment';
import { useToggleLike } from '@/features/like-post';
import { usePlayerStore } from '@/features/play-track';
import { CommentInputBar, ReportCommentSheet, useReportComment } from '@/features/comment';
import { PostActionSheet, EditPostSheet, useManagePost } from '@/features/manage-post';
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
  const [editSheet, setEditSheet] = useState(false);
  const [reportTarget, setReportTarget] = useState<Comment | null>(null);

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
      <View style={styles.center}>
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }

  if (isError || !detail) {
    return (
      <View style={styles.center}>
        <AppText color="textFootnote">불러오지 못했어요</AppText>
        <Pressable onPress={() => refetch()} style={styles.retry}>
          <AppText weight="semiBold" style={{ color: colors.accentPrimary }}>
            다시 시도
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <AppText size={26} weight="bold">
          {detail.title}
        </AppText>
        <AppText size={13} color="textFootnote">
          {formatDate(detail.createdAt)}
        </AppText>
        <AppText size={16} style={styles.body}>
          {detail.content}
        </AppText>

        <View style={styles.player}>
          {detail.artworkUrl ? (
            <Image source={{ uri: detail.artworkUrl }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, styles.artworkEmpty]} />
          )}
          <View style={styles.songInfo}>
            <AppText size={16} weight="semiBold" numberOfLines={1}>
              {detail.songName || '음악 정보 없음'}
            </AppText>
            <AppText size={14} color="textFootnote" numberOfLines={1}>
              {detail.artistName}
            </AppText>
          </View>
          <View style={styles.songActions}>
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

        <AppText size={15} weight="semiBold" style={styles.commentsHeader}>
          댓글 {detail.comments.length}
        </AppText>
        {detail.comments.map((c) => (
          <CommentItem
            key={c.commentId ?? Math.random().toString()}
            comment={c}
            isPlaying={!!c.appleMusicUrl && playingUrl === c.appleMusicUrl}
            onPlay={c.appleMusicUrl ? () => togglePlay(c.appleMusicUrl!) : undefined}
            onReport={c.userId ? () => setReportTarget(c) : undefined}
          />
        ))}
        {detail.comments.length === 0 && (
          <AppText color="textFootnote" style={styles.empty}>
            첫 댓글을 남겨보세요
          </AppText>
        )}
      </ScrollView>

      <CommentInputBar postId={postId} />

      {isMyPost && (
        <>
          <PostActionSheet
            visible={actionSheet}
            onClose={() => setActionSheet(false)}
            isCompleted={false}
            onEdit={() => {
              setActionSheet(false);
              setEditSheet(true);
            }}
            onComplete={() => {
              setActionSheet(false);
              manage.complete.mutate();
            }}
            onDelete={confirmDelete}
          />
          <EditPostSheet
            visible={editSheet}
            detail={detail}
            pending={manage.update.isPending}
            onClose={() => setEditSheet(false)}
            onSave={({ title, content }) =>
              manage.update.mutate(
                {
                  title,
                  content,
                  albumName: '',
                  songName: detail.songName,
                  artistName: detail.artistName,
                  artworkUrl: detail.artworkUrl,
                  appleMusicUrl: detail.appleMusicUrl,
                },
                { onSuccess: () => setEditSheet(false) },
              )
            }
          />
        </>
      )}

      <ReportCommentSheet
        visible={reportTarget != null}
        onClose={() => setReportTarget(null)}
        onSubmit={submitReport}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.mainBackground },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
  body: { lineHeight: 24, marginTop: spacing.sm },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
  },
  artwork: { width: 56, height: 56, borderRadius: 8 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  songInfo: { flex: 1, gap: spacing.xs },
  songActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  commentsHeader: { marginTop: spacing.lg },
  empty: { marginTop: spacing.md },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.mainBackground,
  },
  retry: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});
