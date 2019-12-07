import { Base } from "./base";
import { ID, NullableID } from "../types";

export class Tweet extends Base {
  constructor(
    _id: ID | NullableID,
    public userId: ID,
    public inReplyTo: ID | null,
    public postId: ID,
    public text: string,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {
    super(_id);
  }
}
// repliable = id, like
//   post
//   tweet
//   marker -> line, characters
