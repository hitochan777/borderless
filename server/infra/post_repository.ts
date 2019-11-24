import knex from "knex";

import { Post } from "../entity/post";
import { ID } from "../types";
import { Language } from "../value/language";

interface RawPost {
  id: number;
  userId: number;
  language: number;
  content: string;
  isDraft: boolean;
}

interface RawRepliable {
  id: number;
}

export class PostRepository {
  posts: () => knex.QueryBuilder<RawPost, RawPost[]>;
  repliables: () => knex.QueryBuilder<RawRepliable, RawRepliable[]>;
  constructor(db: knex) {
    this.posts = () => db("post");
    this.repliables = () => db("repliable");
  }
  async create(postInput: Post): Promise<Post | null> {
    if (postInput.userId === null) {
      throw new Error("You cannot set userId to null");
    }
    const repliableIds = await this.repliables().insert({});
    if (repliableIds.length == 0) {
      return null;
    }
    const ids = await this.posts().insert({
      id: repliableIds[0],
      userId: postInput.userId,
      language: postInput.language,
      isDraft: postInput.isDraft
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
    return new Post(
      post.id,
      post.userId,
      post.language,
      JSON.parse(post.content),
      post.isDraft
    );
  }
  async update(post: Post) {
    if (!post.id) {
      throw new Error("ID is not set");
    }
    if (!post.userId) {
      throw new Error("You cannot set userId to null");
    }
    if (post.lines.some(line => line.isNotPersisted())) {
      throw new Error("Line ID should not be null during update");
    }

    const contentString = JSON.stringify(post.lines);
    const cnt = await this.posts()
      .where({ id: post.id })
      .update({
        userId: post.userId,
        language: post.language,
        content: contentString,
        isDraft: post.isDraft
      });

    if (cnt === 0) {
      return null;
    }

    const maybePost = await this.findById(post.id);
    if (!maybePost) {
      return null;
    }

    return maybePost;
  }

  async findByUser(userId: ID): Promise<Post[]> {
    const posts = await this.posts().where({
      userId
    });
    return posts.map(
      post =>
        new Post(
          post.id,
          post.userId,
          post.language,
          JSON.parse(post.content),
          post.isDraft
        )
    );
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
    return new Post(
      post.id,
      post.userId,
      post.language,
      JSON.parse(post.content),
      post.isDraft
    );
  }

  async findByLanguages(langs: Language[]): Promise<Post[]> {
    const posts = await this.posts().whereIn("language", langs);
    return posts.map(
      post =>
        new Post(
          post.id,
          post.userId,
          post.language,
          JSON.parse(post.content),
          post.isDraft
        )
    );
  }
}
