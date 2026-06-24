import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { AppText, BottomSheet, colors } from '@/shared/ui';

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
      <AppText size={18} weight="bold" className="mb-sm">
        신고하기
      </AppText>
      {REASONS.map(({ code, label }) => (
        <Pressable key={code} onPress={() => pick(code)} className="py-md">
          <AppText size={16}>{label}</AppText>
        </Pressable>
      ))}
      {showCustom && (
        <View className="flex-row items-center gap-sm mt-sm">
          <TextInput
            className="flex-1 px-md py-sm bg-content rounded-[12px] font-regular text-[15px] text-primary"
            value={custom}
            onChangeText={setCustom}
            placeholder="신고 사유를 입력해주세요"
            placeholderTextColor={colors.textFootnote}
            autoFocus
          />
          <Pressable onPress={submitCustom} className="px-md py-sm bg-accent rounded-[12px]">
            <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
              제출
            </AppText>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
}
