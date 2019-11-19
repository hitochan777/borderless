import { ID } from "../types";

import { LineContent } from "./line_content";

export class Line {
  constructor(
    public id: ID | null,
    public postId: ID | null,
    public lineContent: LineContent,
    public replies: ID[]
  ) {}

  static create({
    postId,
    lineContent,
    replies
  }: {
    postId: ID | null;
    lineContent: LineContent;
    replies: ID[];
  }) {
    return new Line(null, postId, lineContent, replies);
  }
}
