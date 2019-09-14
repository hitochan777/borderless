import { Tweet } from "./tweet";

export class Line {
  constructor(public text: string, public replies: Tweet[]) {}
}
