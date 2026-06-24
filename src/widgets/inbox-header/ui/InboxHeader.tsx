import { View } from 'react-native';
import { AppText } from '@/shared/ui';

type InboxHeaderProps = {
  title: string;
  count: number;
  description: string;
};

/** 원본 InboxHeaderView — 큰 44pt 타이틀 + {count}개 + 설명 */
export function InboxHeader({ title, count, description }: InboxHeaderProps) {
  return (
    <View className="px-[20px] pt-[20px] gap-sm">
      <AppText size={44} weight="bold">
        {title}
      </AppText>
      <AppText size={16} weight="medium">
        {count}개
      </AppText>
      <AppText size={14} color="textFootnote">
        {description}
      </AppText>
    </View>
  );
}
