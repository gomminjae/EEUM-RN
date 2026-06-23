import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
  Share: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  // 이후 마일스톤에서 추가: Auth(게이트), PostDetail, Search
  PostDetail: { postId: string };
  Search: undefined;
};
