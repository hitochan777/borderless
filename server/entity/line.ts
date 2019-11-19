import { ID } from "../types";

import { LineContent } from "./line_content";

interface LineFactoryInput {
  postId: ID | null;
  lineContent: LineContent;
  replies: ID[];
}

export class Line {
  constructor(
    public id: ID | null,
    public postId: ID | null,
    public lineContent: LineContent,
    public replies: ID[]
  ) {}

  static create({ postId, lineContent, replies }: LineFactoryInput) {
    return new Line(null, postId, lineContent, replies);
  }
}
