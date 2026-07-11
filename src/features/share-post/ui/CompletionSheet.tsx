import { useRef, useState } from 'react';
import { Modal, View, Pressable, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors } from '@/shared/ui';
import type { CompletionType } from '../api/createStory';

const LIMIT_OPTIONS = [10, 20, 30, 50, 100];

type CompletionSheetProps = {
  visible: boolean;
  pending?: boolean;
  onClose: () => void;
  onConfirm: (type: CompletionType, commentCountLimit: number) => void;
};

/** 원본 SharePopupView 이식 — 중앙 드래그 모달(설정 팝업)
 *  라디오 원 + 자동/수동 완료 섹션 + 최대 댓글 갯수 pill 드롭다운 + 취소|공유 분할바 */
export function CompletionSheet({ visible, pending, onClose, onConfirm }: CompletionSheetProps) {
  const [type, setType] = useState<CompletionType>('AUTO_COMPLETION');
  const [limit, setLimit] = useState(20);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuto = type === 'AUTO_COMPLETION';

  const translateY = useRef(new Animated.Value(0)).current;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) {
          onClose();
          translateY.setValue(0);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="flex-1 items-center justify-center px-[40px]">
          <Pressable onPress={() => {}} className="w-full">
            <Animated.View
              className="h-[410px] w-full rounded-[18px] bg-main overflow-hidden"
              style={{ transform: [{ translateY }] }}
              {...pan.panHandlers}
            >
              {/* Header */}
              <View className="py-[20px] items-center">
                <AppText size={18} weight="semiBold">
                  설정
                </AppText>
              </View>
              <View className="h-[1px] bg-system-gray/15" />

              {/* Content */}
              <View className="px-[24px] pt-[24px] pb-[28px] gap-[28px]">
                {/* Auto */}
                <View style={{ opacity: isAuto ? 1 : 0.45, zIndex: 10 }} className="gap-[10px]">
                  <Pressable
                    className="flex-row items-center gap-[12px]"
                    onPress={() => setType('AUTO_COMPLETION')}
                  >
                    <RadioCircle selected={isAuto} />
                    <AppText size={16} weight={isAuto ? 'semiBold' : 'regular'}>
                      플레이리스트 자동 완료
                    </AppText>
                  </Pressable>

                  <AppText size={13} color="textFootnote" className="pl-[34px] leading-[21px]">
                    추가되는 댓글 및 음악 수를 설정하면{'\n'}자동으로 플레이리스트가 완료처리됩니다.
                  </AppText>

                  <View className="flex-row items-center pl-[34px] pt-[4px]">
                    <AppText size={16} weight="semiBold">
                      최대 댓글 갯수
                    </AppText>
                    <View className="flex-1" />

                    <View className="relative">
                      <Pressable
                        className="flex-row items-center gap-[8px] px-[16px] h-[36px] rounded-[18px] bg-black/[0.06]"
                        disabled={!isAuto}
                        onPress={() => setMenuOpen((v) => !v)}
                      >
                        <AppText size={15} weight="semiBold">
                          {limit}개
                        </AppText>
                        <Ionicons name="caret-down" size={10} color={colors.textPrimary} />
                      </Pressable>

                      {menuOpen && (
                        <View
                          className="absolute right-0 top-[42px] rounded-[12px] bg-main py-[4px] min-w-[88px]"
                          style={{
                            zIndex: 20,
                            elevation: 6,
                            shadowColor: '#000',
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 2 },
                          }}
                        >
                          {LIMIT_OPTIONS.map((n) => (
                            <Pressable
                              key={n}
                              className="px-[16px] py-[10px]"
                              onPress={() => {
                                setLimit(n);
                                setMenuOpen(false);
                              }}
                            >
                              <AppText size={15} weight={limit === n ? 'semiBold' : 'regular'}>
                                {n}개
                              </AppText>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Manual */}
                <View style={{ opacity: isAuto ? 0.45 : 1 }} className="gap-[10px]">
                  <Pressable
                    className="flex-row items-center gap-[12px]"
                    onPress={() => setType('MANUAL_COMPLETION')}
                  >
                    <RadioCircle selected={!isAuto} />
                    <AppText size={16} weight={isAuto ? 'regular' : 'semiBold'}>
                      수동 완료 처리
                    </AppText>
                  </Pressable>

                  <AppText size={13} color="textFootnote" className="pl-[34px] leading-[21px]">
                    inbox 내 작성한 사연에서 직접{'\n'}플레이리스트를 완료할 수 있습니다.
                  </AppText>
                </View>
              </View>

              <View className="flex-1" />

              {/* Bottom bar */}
              <View className="h-[1px] bg-system-gray/15" />
              <View className="flex-row items-center">
                <Pressable
                  className="flex-1 py-[20px] items-center"
                  onPress={onClose}
                  disabled={pending}
                >
                  <AppText size={17} weight="semiBold">
                    취소
                  </AppText>
                </Pressable>
                <View className="w-[1px] h-[24px] bg-system-gray/15" />
                <Pressable
                  className="flex-1 py-[20px] items-center"
                  style={pending ? { opacity: 0.5 } : undefined}
                  disabled={pending}
                  onPress={() => !pending && onConfirm(type, isAuto ? limit : 0)}
                >
                  <AppText size={17} weight="semiBold">
                    공유
                  </AppText>
                </Pressable>
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

/** 원본 RadioCircle 이식 */
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <View
      className="w-[22px] h-[22px] rounded-[11px] items-center justify-center border-2"
      style={{ borderColor: selected ? '#000000' : 'rgba(142,142,147,0.35)' }}
    >
      {selected && <View className="w-[12px] h-[12px] rounded-[6px] bg-black" />}
    </View>
  );
}
