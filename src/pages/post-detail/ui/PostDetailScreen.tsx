import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Alert, useWindowDimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, images } from '@/shared/ui';
import { CommentItem, CommentCard, type Comment } from '@/entities/comment';
import { useToggleLike } from '@/features/like-post';
import { usePlayerStore } from '@/features/play-track';
import { useMusicPicker } from '@/features/music-search';
import { CommentInputBar, CommentSheet, ReportCommentSheet, useReportComment } from '@/features/comment';
import { PostActionSheet, useManagePost } from '@/features/manage-post';
import type { Music } from '@/entities/track';
import type { RootStackParamList } from '@/shared/config/navigation';
import { usePostDetail, useIsMyPost } from '../model/usePostDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { width } = useWindowDimensions();
  const heroSize = width - 48;

  const { data: detail, isLoading, isError, refetch } = usePostDetail(postId);
  const isMyPost = useIsMyPost(postId);
  const toggleLike = useToggleLike(postId);
  const manage = useManagePost(postId);
  const report = useReportComment();
  const togglePlay = usePlayerStore((s) => s.toggle);
  const playingUrl = usePlayerStore((s) => (s.isPlaying ? s.currentUrl : null));
  const consumePicked = useMusicPicker((s) => s.consume);

  const [actionSheet, setActionSheet] = useState(false);
  const [reportTarget, setReportTarget] = useState<Comment | null>(null);
  const [showCommentsList, setShowCommentsList] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  // 음악 검색 복귀 시 흡수 → 시트 자동 오픈 (원본 onChange(selectedMusic))
  useFocusEffect(
    useCallback(() => {
      const picked = consumePicked();
      if (picked) {
        setSelectedMusic(picked);
        setShowCommentSheet(true);
      }
    }, [consumePicked]),
  );

  const handlePlayComment = useCallback(
    (c: Comment) => {
      if (c.appleMusicUrl) togglePlay(c.appleMusicUrl);
    },
    [togglePlay],
  );
  // iOS 네이티브 모달은 dismiss 중 다른 모달 present 시 실패 → 시트가 열려있으면 닫고 나서 오픈
  const sheetOpenRef = useRef(false);
  useEffect(() => {
    sheetOpenRef.current = showCommentSheet;
  }, [showCommentSheet]);
  const handleReport = useCallback((c: Comment) => {
    if (sheetOpenRef.current) {
      setShowCommentSheet(false);
      setTimeout(() => setReportTarget(c), 350);
    } else {
      setReportTarget(c);
    }
  }, []);

  const isLiked = detail?.isLiked ?? false;
  const hasDetail = !!detail;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: !hasDetail
        ? undefined
        : isMyPost
          ? () => (
              <Pressable onPress={() => setActionSheet(true)} hitSlop={8} disabled={manage.remove.isPending}>
                <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
              </Pressable>
            )
          : () => (
              <Pressable
                onPress={() => toggleLike.mutate(isLiked)}
                disabled={toggleLike.isPending}
                hitSlop={8}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isLiked ? '#FF3B30' : '#000000'}
                />
              </Pressable>
            ),
    });
  }, [navigation, isMyPost, isLiked, hasDetail, toggleLike, manage.remove.isPending]);

  const confirmDelete = () => {
    setActionSheet(false);
    Alert.alert('사연을 삭제하시겠습니까?', '삭제된 사연은 복구할 수 없습니다.', [
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
        commentId: target.commentId,
        reportedUserId: target.userId,
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

  const isPostPlaying = !!detail.appleMusicUrl && playingUrl === detail.appleMusicUrl;
  const comments = detail.comments;

  return (
    <View className="flex-1 bg-main">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 히어로 아트워크 + 재생 오버레이 */}
        <View className="px-[24px]">
          <View
            className="items-center justify-center overflow-hidden bg-black/[0.06]"
            style={{ width: heroSize, height: heroSize }}
          >
            {detail.artworkUrl ? (
              <AppImage source={{ uri: detail.artworkUrl }} recyclingKey={detail.artworkUrl} style={StyleSheet.absoluteFill} />
            ) : null}
            {!!detail.appleMusicUrl && (
              <Pressable
                className="w-[70px] h-[70px] rounded-[35px] bg-black/70 items-center justify-center"
                onPress={() => togglePlay(detail.appleMusicUrl)}
                hitSlop={8}
              >
                <Ionicons name={isPostPlaying ? 'pause' : 'play'} size={30} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* 곡 / 아티스트 */}
        <View className="flex-row items-center px-[24px] pt-[16px]">
          <AppText size={20} weight="semiBold" style={{ color: colors.accentPrimary }} numberOfLines={1} className="flex-1">
            {detail.songName}
          </AppText>
          <AppText size={12} style={{ color: colors.black }} numberOfLines={1}>
            {detail.artistName}
          </AppText>
        </View>

        {/* 제목 */}
        <AppText size={18} weight="semiBold" className="px-[24px] pt-[24px]">
          {detail.title}
        </AppText>

        {/* 본문 */}
        <AppText size={14} className="px-[24px] pt-[12px] leading-[20px]">
          {detail.content}
        </AppText>

        {/* 글보기 / 커버보기 토글 — 원본 커스텀 에셋 musicbox/list */}
        <Pressable
          className="flex-row items-center gap-sm px-[24px] mt-[20px] py-[12px]"
          onPress={() => setShowCommentsList((v) => !v)}
        >
          <AppImage
            source={showCommentsList ? images.musicbox : images.list}
            style={{ width: 20, height: 20 }}
            contentFit="contain"
          />
          <AppText size={16} weight="medium" style={{ color: colors.black }}>
            {showCommentsList ? '커버보기' : '글보기'}
          </AppText>
        </Pressable>

        {/* 댓글 */}
        {comments.length > 0 && (
          <View className="px-[24px] pt-[16px]">
            {showCommentsList ? (
              <View className="gap-[16px]">
                {comments.map((c, i) => (
                  <CommentItem
                    key={c.commentId ?? `comment-${i}`}
                    comment={c}
                    isPlaying={!!c.appleMusicUrl && playingUrl === c.appleMusicUrl}
                    onPlay={handlePlayComment}
                    onReport={handleReport}
                  />
                ))}
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {comments.map((c, i) => (
                  <View key={c.commentId ?? `comment-${i}`} className="w-[48%] mb-[16px]">
                    <CommentCard
                      comment={c}
                      isPlaying={!!c.appleMusicUrl && playingUrl === c.appleMusicUrl}
                      onPlay={handlePlayComment}
                      onReport={handleReport}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 비소유자: 하단 가짜 입력바 → 시트 */}
      {!isMyPost && (
        <CommentInputBar
          selectedMusic={selectedMusic}
          onTapInput={() => setShowCommentSheet(true)}
          onTapAddMusic={() => navigation.navigate('Search')}
          onRemoveMusic={() => setSelectedMusic(null)}
        />
      )}

      {!isMyPost && (
        <CommentSheet
          visible={showCommentSheet}
          onClose={() => setShowCommentSheet(false)}
          postId={postId}
          comments={comments}
          selectedMusic={selectedMusic}
          playingUrl={playingUrl}
          onPlay={handlePlayComment}
          onReport={handleReport}
          onAddMusic={() => {
            setShowCommentSheet(false);
            navigation.navigate('Search');
          }}
          onRemoveMusic={() => setSelectedMusic(null)}
        />
      )}

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
    </View>
  );
}
