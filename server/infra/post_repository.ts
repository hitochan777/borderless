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
  async findByUser(userId: ID): Promise<Post[]> {
    const posts = await this.posts().where({
      userId
    });
    return posts.map(post => ({
      id: post.id,
      userId: post.userId,
      language: post.language,
      text: post.text
    }));
  }
  async findById(id: ID): Promise<Post | null> {
    const posts = await this.posts().where({
      id
    });
    if (posts.length > 1) {
      throw new Error("Multiple posts found");
    }
    if (posts.length === 0) {
      return null;
    }
    const post = posts[0];
    return {
      id: post.id,
      userId: post.userId,
      language: post.language,
      text: post.text
    };
  }
}
