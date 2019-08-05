import knex from "knex";

import { Post } from "../entity/post";
import { ID } from "../types";
import { Language } from "../value/language";

interface RawPost {
  id: number;
  userId: number;
  language: number;
  text: string;
}

interface PostInput {
  userId: ID;
  language: number;
  text: string;
}

export class PostRepository {
  posts: () => knex.QueryBuilder<RawPost, RawPost[]>;
  constructor(db: knex) {
    this.posts = () => db("post");
  }
  async create({ userId, language, text }: PostInput) {
    const ids = await this.posts().insert({
      userId,
      language,
      text
    });
    if (ids.length === 0) {
      return null;
    }
    const post = await this.posts()
      .where("id", ids[0])
      .first();
    if (!post) {
      return null;
    }
    if (!Language[post.language]) {
      throw new Error(`Invalid language ID ${post.language}`);
    }
    return new Post(post.id, post.userId, post.language, post.text);
  }
  async findByUid(uid: string): Promise<Post[]> {
    return [];
  }
}
