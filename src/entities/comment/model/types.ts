/** 원본 Domain/Entity/Comment 이식 */
export type Comment = {
  commentId: string | null;
  postId: string | null;
  userId: string | null;
  username: string | null;
  content: string | null;
  createdAt: string | null;
  albumName: string | null;
  songName: string | null;
  artistName: string | null;
  artworkUrl: string | null;
  appleMusicUrl: string | null;
  modifiedAt: string | null;
  isDeleted: boolean | null;
};
