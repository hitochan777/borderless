import { Base } from "./base";
import { NullableID, ID } from "../types";
import { LineContent } from "./line_content";

interface LineFactoryInput {
  postId: NullableID;
  lineContent: LineContent;
  replies: ID[];
}

export class Line extends Base {
  constructor(
    _id: NullableID,
    public postId: NullableID,
    public lineContent: LineContent,
    public replies: ID[],
    public createdAt: Date | null = null,
    public updatedAt: Date | null = null
  ) {
    super(_id);
  }

  static create({ postId, lineContent, replies }: LineFactoryInput) {
    return new Line(null, postId, lineContent, replies);
  }
}
