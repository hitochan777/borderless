import { ID } from "../types";

export class Tweet {
  constructor(
    public id: ID,
    public userId: ID,
    public inReplyTo: ID | null,
    public postId: ID,
    public text: string
  ) {}
}
// repliable = id, like
//   post
//   tweet
//   marker -> line, characters
