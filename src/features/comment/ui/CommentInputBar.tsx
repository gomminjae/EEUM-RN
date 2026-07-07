import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors } from '@/shared/ui';
import type { Music } from '@/entities/track';

const hairline = StyleSheet.hairlineWidth;

type CommentInputBarProps = {
  selectedMusic: Music | null;
  onTapInput: () => void;
  onTapAddMusic: () => void;
  onRemoveMusic: () => void;
};

/** 원본 CommentInputBar(가짜 입력바) 이식 — 탭하면 CommentSheet 가 열린다.
 *  plus → 음악검색, 본문/전송 탭 → 시트 오픈. */
export function CommentInputBar({ selectedMusic, onTapInput, onTapAddMusic, onRemoveMusic }: CommentInputBarProps) {
  return (
    <View className="border-t border-t-black/10 bg-main" style={{ borderTopWidth: hairline }}>
      {selectedMusic && (
        <View className="flex-row items-center gap-sm mx-md mt-sm self-start px-md py-sm bg-content rounded-[999px]">
          <Ionicons name="musical-note" size={13} color={colors.textPrimary} />
          <AppText size={13} numberOfLines={1}>
            {selectedMusic.songName} · {selectedMusic.artistName}
          </AppText>
          <Pressable onPress={onRemoveMusic} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.textFootnote} />
          </Pressable>
        </View>
      )}
      <View className="flex-row items-center gap-sm px-md py-sm">
        <Pressable onPress={onTapAddMusic} hitSlop={8}>
          <Ionicons name="add-circle" size={28} color={colors.textPrimary} />
        </Pressable>
        <Pressable className="flex-1" onPress={onTapInput}>
          <View className="px-md py-[10px] bg-content rounded-[20px]">
            <AppText size={15} color="textFootnote" numberOfLines={1}>
              사연과 관련된 노래와 글을 추가해보세요.
            </AppText>
          </View>
        </Pressable>
        <Pressable onPress={onTapInput} hitSlop={8}>
          <Ionicons name="arrow-up-circle" size={32} color={colors.textFootnote} />
        </Pressable>
      </View>
    </View>
  );
}
