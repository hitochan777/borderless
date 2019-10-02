import { ID } from "../types";

interface LineRef {
  postId: ID;
  lineNum: number;
}
export class Tweet {
  constructor(
    public id: ID,
    public userId: ID,
    public inReplyTo: ID | null,
    public text: string,
    public lineRef?: LineRef
  ) {}
}
