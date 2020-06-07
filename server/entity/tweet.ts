import { Base } from "./base";
import { ID, NullableID } from "../types";

export class TweetNoContentError extends Error {
  constructor() {
    super("text or correction must be specified");
  }
}

export class Tweet extends Base {
  constructor(
    _id: ID | NullableID,
    public userId: ID,
    public inReplyTo: ID | null,
    public postId: ID,
    public text: string,
    public correction: string | null,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {
    super(_id);
    const isTextEmpty = text.trim().length === 0;
    const isCorrectionEmpty = correction?.trim().length === 0;
    if (isTextEmpty || isCorrectionEmpty) {
      throw new TweetNoContentError();
    }
  }
}
// repliable = id, like
//   post
//   tweet
//   marker -> line, characters
