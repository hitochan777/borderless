import { Tweet } from "./tweet";
import { ID } from "../types";

export class Line {
  constructor(public id: ID, public text: string) {}
}
