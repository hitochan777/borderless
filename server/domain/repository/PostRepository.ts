import { Post } from "../../entity/post";
import { ID } from "../../types";
import { Language } from "../../value/language";

export interface PostRepository {
  create(postInput: Post): Promise<Post | null>;
  update(post: Post): Promise<Post>;
  findByUser(userId: ID): Promise<Post[]>;
  findById(id: ID): Promise<Post | null>;
  findAll(currentUserId?: ID): Promise<Post[]>;
  findByLanguages(
    langs: Language[],
    currentUserId?: ID,
    { offset, limit }?: { offset?: number; limit?: number }
  ): Promise<Post[]>;
  toggleLike(userId: ID, postId: ID): Promise<void>;
  countLike(postId: ID): Promise<number>;
  likedByMe(userId: ID, postId: ID): Promise<boolean>;
}
