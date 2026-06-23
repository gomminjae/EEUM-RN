/** FSD cross-import (@x): entities/post 가 entities/comment 를 참조하는 것을
 *  명시적으로 허용하는 공개 API. (PostDetail 이 댓글을 포함하는 aggregate 관계) */
export type { Comment } from '../model/types';
export { commentSchema } from '../api/commentApi';
