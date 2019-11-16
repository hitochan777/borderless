import knex from "knex";

import { Line } from "../entity/line";
import { ID } from "../types";
import { Language } from "../value/language";
import { PartialLine } from "../graphql";

interface RawLine {
  id: number;
  postId: number;
  content: string;
}

interface RawRepliable {
  id: ID;
}

export class LineRepository {
  lines: () => knex.QueryBuilder<RawLine, RawLine[]>;
  repliables: () => knex.QueryBuilder<RawRepliable, RawRepliable[]>;
  constructor(db: knex) {
    this.lines = () => db("lines");
    this.repliables = () => db("repliable");
  }
  async create(lineInput: Line) {
    const repliableIds = await this.repliables().insert({});
    if (repliableIds.length == 0) {
      return null;
    }
    // TODO: create lines
    const ids = await this.lines().insert({
      id: repliableIds[0],
      postId: lineInput.postId,
      content: JSON.stringify(
        lineInput.lineContent.partialLines.map(
          partialLine => partialLine.subtext
        ),
        null,
        0
      )
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
    return new Post(post.id, post.userId, post.language, post.isDraft);
  }
  async update(
    id: number,
    { userId, language, lines, isDraft }: Partial<PostInput>
  ) {
    const cnt = await this.posts()
      .where({ id })
      .update({
        userId,
        language,
        content,
        isDraft
      });

    if (cnt === 0) {
      return null;
    }
    const maybePost = await this.findById(id);
    if (!maybePost) {
      return null;
    }

    return new Post(
      maybePost.id,
      maybePost.userId,
      maybePost.language,
      maybePost.content,
      maybePost.isDraft
    );
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
