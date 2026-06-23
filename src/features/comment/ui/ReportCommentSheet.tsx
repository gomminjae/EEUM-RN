import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { AppText, BottomSheet, colors, fonts, spacing } from '@/shared/ui';

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
};

/** 원본 ReportReasonView 이식 — 사유 선택, OTHER 는 직접 입력 */
export function ReportCommentSheet({ visible, onClose, onSubmit }: ReportCommentSheetProps) {
  const [custom, setCustom] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const reset = () => {
    setCustom('');
    setShowCustom(false);
  };

  const pick = (code: string) => {
    if (code === 'OTHER') {
      setShowCustom(true);
      return;
    }
    onSubmit(code);
    reset();
  };

  const submitCustom = () => {
    const reason = custom.trim() || 'OTHER';
    onSubmit(reason);
    reset();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <AppText size={18} weight="bold" style={styles.title}>
        신고하기
      </AppText>
      {REASONS.map(({ code, label }) => (
        <Pressable key={code} onPress={() => pick(code)} style={styles.option}>
          <AppText size={16}>{label}</AppText>
        </Pressable>
      ))}
      {showCustom && (
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            value={custom}
            onChangeText={setCustom}
            placeholder="신고 사유를 입력해주세요"
            placeholderTextColor={colors.textFootnote}
            autoFocus
          />
          <Pressable onPress={submitCustom} style={styles.submit}>
            <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
              제출
            </AppText>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  option: { paddingVertical: spacing.md },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  customInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  submit: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentPrimary,
    borderRadius: 12,
  },
});
