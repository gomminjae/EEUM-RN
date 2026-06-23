/** 네비게이션 라우트 파라미터 — pages/app 양쪽이 참조하므로 shared 에 둔다
 *  원본 iOS: NavigationStack 한 개. Home 이 루트, feed/share/settings 는 push.
 *  탭바 없음.
 *  Inbox 흐름: Feed → PostsList → InboxMenu → CommentsList/LikesList (원본 그대로) */
export type RootStackParamList = {
  Home: undefined;
  Feed: undefined;
  Share: undefined;
  Settings: undefined;
  PostDetail: { postId: string };
  EditPost: { postId: string };
  Search: undefined;
  PostsList: undefined;
  InboxMenu: undefined;
  CommentsList: undefined;
  LikesList: undefined;
};
