import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, BottomSheet, colors } from '@/shared/ui';

const hairline = StyleSheet.hairlineWidth;

const REASONS = [
  { code: 'VIOLENCE', label: '폭력 및 혐오 표현' },
  { code: 'SEXUAL', label: '성적 불쾌감을 일으키는 표현' },
  { code: 'SPAM', label: '스팸 및 사기' },
  { code: 'OTHER', label: '기타' },
] as const;

type ReportCommentSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  subject?: '댓글' | '게시글';
};

/** 신고 사유를 선택하는 바텀시트. OTHER는 사유를 직접 입력한다. */
export function ReportCommentSheet({
  visible,
  onClose,
  onSubmit,
  subject = '댓글',
}: ReportCommentSheetProps) {
  const [custom, setCustom] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const close = () => {
    setCustom('');
    setShowCustom(false);
    onClose();
  };

  const pick = (code: string) => {
    if (code === 'OTHER') {
      setShowCustom(true);
      return;
    }
    onSubmit(code);
    setCustom('');
    setShowCustom(false);
  };

  const submitCustom = () => {
    if (!custom.trim()) return;
    onSubmit(custom.trim());
    setCustom('');
    setShowCustom(false);
  };

  return (
    <BottomSheet visible={visible} onClose={close}>
      <View>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-md">
            <AppText size={22} weight="bold">
              신고하기
            </AppText>
            <AppText size={14} color="textFootnote" className="mt-xs leading-[20px]">
              이 {subject}을 신고하는 이유를 선택해주세요.
            </AppText>
          </View>
          <Pressable
            accessibilityLabel="신고 화면 닫기"
            accessibilityRole="button"
            className="h-[36px] w-[36px] items-center justify-center rounded-full bg-content"
            hitSlop={8}
            onPress={close}
          >
            <Ionicons name="close" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View className="mt-lg overflow-hidden rounded-[14px] bg-content">
          {REASONS.map(({ code, label }, i) => (
            <View key={code}>
              <Pressable
                accessibilityRole="button"
                className="min-h-[56px] flex-row items-center justify-between px-md py-[14px]"
                onPress={() => pick(code)}
              >
                {code === 'OTHER' ? (
                  <View className="flex-row items-center">
                    <AppText size={15}>기타</AppText>
                    <AppText size={14} color="textFootnote" className="ml-sm">
                      직접 입력
                    </AppText>
                  </View>
                ) : (
                  <AppText size={15}>{label}</AppText>
                )}
                <Ionicons name="chevron-forward" size={17} color={colors.textFootnote} />
              </Pressable>
              {i < REASONS.length - 1 && (
                <View className="ml-md bg-black/10" style={{ height: hairline }} />
              )}
            </View>
          ))}
        </View>

        {showCustom && (
          <View className="mt-md">
            <TextInput
              accessibilityLabel="기타 신고 사유"
              className="min-h-[96px] rounded-[14px] bg-content px-md py-[14px] font-regular text-[15px] leading-[21px] text-primary"
              value={custom}
              onChangeText={setCustom}
              placeholder="신고 사유를 입력해주세요"
              placeholderTextColor={colors.textFootnote}
              autoFocus
              maxLength={300}
              multiline
              textAlignVertical="top"
            />
            <AppText size={12} color="textFootnote" className="mt-xs text-right">
              {custom.length}/300
            </AppText>
            <Pressable
              accessibilityRole="button"
              className="mt-md h-[52px] items-center justify-center rounded-[12px]"
              style={{
                backgroundColor: custom.trim()
                  ? colors.accentPrimary
                  : colors.systemGray5,
              }}
              disabled={!custom.trim()}
              onPress={submitCustom}
            >
              <AppText
                size={16}
                weight="bold"
                style={{ color: custom.trim() ? '#FFFFFF' : colors.systemGray }}
              >
                신고하기
              </AppText>
            </Pressable>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
