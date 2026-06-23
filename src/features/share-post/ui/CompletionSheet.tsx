import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText, BottomSheet, colors, spacing } from '@/shared/ui';
import type { CompletionType } from '../api/createStory';

const LIMIT_OPTIONS = [10, 20, 30, 50, 100];

type CompletionSheetProps = {
  visible: boolean;
  pending?: boolean;
  onClose: () => void;
  onConfirm: (type: CompletionType, commentCountLimit: number) => void;
};

/** 원본 SharePopupView 이식 — 완료 방식(자동/수동) + 자동일 때 댓글 수 제한 */
export function CompletionSheet({ visible, pending, onClose, onConfirm }: CompletionSheetProps) {
  const [type, setType] = useState<CompletionType>('AUTO_COMPLETION');
  const [limit, setLimit] = useState(20);

  const isAuto = type === 'AUTO_COMPLETION';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText size={18} weight="bold" style={styles.heading}>
        완료 방식
      </AppText>

      <View style={styles.typeRow}>
        <TypeChip label="자동 완료" active={isAuto} onPress={() => setType('AUTO_COMPLETION')} />
        <TypeChip label="수동 완료" active={!isAuto} onPress={() => setType('MANUAL_COMPLETION')} />
      </View>

      {isAuto && (
        <>
          <AppText size={14} color="textFootnote" style={styles.subhead}>
            댓글 수 제한
          </AppText>
          <View style={styles.limitRow}>
            {LIMIT_OPTIONS.map((n) => (
              <TypeChip key={n} label={String(n)} active={limit === n} onPress={() => setLimit(n)} />
            ))}
          </View>
        </>
      )}

      <Pressable
        style={[styles.confirm, pending && styles.disabled]}
        disabled={pending}
        onPress={() => onConfirm(type, isAuto ? limit : 0)}
      >
        <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
          공유하기
        </AppText>
      </Pressable>
    </BottomSheet>
  );
}

function TypeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <AppText
        size={14}
        weight={active ? 'semiBold' : 'regular'}
        style={{ color: active ? '#FFFFFF' : colors.textPrimary }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.md },
  subhead: { marginTop: spacing.md, marginBottom: spacing.sm },
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  limitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.contentBackground,
  },
  chipActive: { backgroundColor: colors.accentPrimary },
  confirm: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.accentPrimary,
    borderRadius: 12,
  },
  disabled: { opacity: 0.5 },
});
