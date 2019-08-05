import { ID } from "../types"

export class Line {
  constructor(
    public id: ID,
    public post_id: ID,
    public text: String,
    public order: number,
  ) {}
}
