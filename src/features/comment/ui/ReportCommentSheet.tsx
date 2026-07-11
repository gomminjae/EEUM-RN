import { useState } from 'react';
import { Modal, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, colors } from '@/shared/ui';

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
};

/** 원본 ReportReasonView 이식 — 풀스크린. 헤더(뒤로 + "신고하기") + 질문 + 사유 목록.
 *  OTHER 는 직접 입력 후 "신고하기". */
export function ReportCommentSheet({ visible, onClose, onSubmit }: ReportCommentSheetProps) {
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
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={close}>
      <SafeAreaView className="flex-1 bg-main" edges={['top']}>
        {/* 헤더 */}
        <View className="flex-row items-center px-[20px] py-md">
          <Pressable onPress={close} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color="#000000" />
          </Pressable>
          <View className="flex-1 items-center">
            <AppText size={17} weight="semiBold" style={{ color: colors.black }}>
              신고하기
            </AppText>
          </View>
          <View style={{ width: 18 }} />
        </View>

        {/* 질문 */}
        <AppText size={16} weight="semiBold" style={{ color: colors.black }} className="px-[20px] pt-lg">
          이 게시물을 신고하는 이유가 무엇인가요?
        </AppText>

        {/* 사유 목록 */}
        <View className="mt-lg">
          {REASONS.map(({ code, label }, i) => (
            <View key={code}>
              <Pressable className="px-[20px] py-md" onPress={() => pick(code)}>
                {code === 'OTHER' ? (
                  <AppText size={15} style={{ color: colors.black }}>
                    기타: <AppText size={15} style={{ color: colors.systemGray }}>입력해주세요</AppText>
                  </AppText>
                ) : (
                  <AppText size={15} style={{ color: colors.black }}>{label}</AppText>
                )}
              </Pressable>
              {i < REASONS.length - 1 && (
                <View className="mx-[20px] bg-black/10" style={{ height: hairline }} />
              )}
            </View>
          ))}
        </View>

        {/* 기타 입력 */}
        {showCustom && (
          <View className="px-[20px] pt-lg gap-md">
            <TextInput
              className="px-md py-md bg-black/[0.06] rounded-[8px] font-regular text-[15px] text-primary"
              value={custom}
              onChangeText={setCustom}
              placeholder="신고 사유를 입력해주세요"
              placeholderTextColor={colors.textFootnote}
              autoFocus
            />
            <Pressable
              className="items-center py-[14px] rounded-[8px]"
              style={{ backgroundColor: custom.trim() ? '#000000' : colors.systemGray }}
              disabled={!custom.trim()}
              onPress={submitCustom}
            >
              <AppText size={16} weight="semiBold" style={{ color: '#FFFFFF' }}>
                신고하기
              </AppText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
