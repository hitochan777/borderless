import { ID } from "../types";

import { Post } from "./post";
import { Tweet } from "./tweet";
import { LineContent } from "./line_content";

export class Line {
  constructor(
    public id: ID | null,
    public post: Post | null,
    public lineContent: LineContent,
    public replies: Tweet[]
  ) {}

  static create({
    post,
    line,
    replies = []
  }: {
    post: Post | null;
    line: LineContent | string;
    replies: Tweet[];
  }) {
    let lineContent!: LineContent;
    if (typeof line === "string") {
      lineContent = {
        partialLines: [
          {
            subtext: line,
            referers: []
          }
        ]
      };
    } else {
      lineContent = line;
    }
    return new Line(null, post, lineContent, replies);
  }

  static createFromString(line: string) {
    return Line.create({ post: null, line, replies: [] });
  }
}
