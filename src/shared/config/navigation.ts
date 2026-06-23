import type { NavigatorScreenParams } from '@react-navigation/native';

/** 네비게이션 라우트 파라미터 — pages/app 양쪽이 참조하므로 shared 에 둔다
 *  (pages → app 상향 의존을 피하기 위한 FSD 표준 위치) */
export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
  Share: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  PostDetail: { postId: string };
  Search: undefined;
};
