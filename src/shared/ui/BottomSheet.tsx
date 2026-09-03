import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from './theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onDismiss?: () => void;
  children: ReactNode;
};

/** 공용 하단 시트 — 액션시트/신고/수정 시트의 컨테이너 */
export function BottomSheet({
  visible,
  onClose,
  onDismiss,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const mountedRef = useRef(visible);
  const onDismissRef = useRef(onDismiss);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(320)).current;
  const animationId = useRef(0);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const currentAnimationId = ++animationId.current;
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();

    if (visible) {
      mountedRef.current = true;
      setMounted(true);
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(320);

      requestAnimationFrame(() => {
        if (currentAnimationId !== animationId.current) return;
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sheetTranslateY, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
      return;
    }

    if (!mountedRef.current) return;

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 320,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && currentAnimationId === animationId.current) {
        mountedRef.current = false;
        setMounted(false);
        onDismissRef.current?.();
      }
    });
  }, [backdropOpacity, sheetTranslateY, visible]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        />
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View
          className="bg-main rounded-t-[24px] px-lg pt-sm"
          style={{
            paddingBottom: insets.bottom + spacing.md,
            transform: [{ translateY: sheetTranslateY }],
          }}
        >
          <View className="self-center w-[40px] h-[4px] rounded-[2px] bg-footnote/40 mb-md" />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
});
