import { Tweet } from "./tweet";

export class Line {
  constructor(public text: String, public replies: Tweet[]) {}
}
