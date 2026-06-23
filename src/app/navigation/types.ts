/** 네비게이션 파라미터의 정본은 shared 에 있음 (pages 가 상향 의존 없이 참조하도록).
 *  app 레이어는 여기서 재노출만 한다. */
export type { RootStackParamList, MainTabParamList } from '@/shared/config/navigation';
