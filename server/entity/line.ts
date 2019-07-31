import { ID } from "../types"

export class Line {
  constructor(
    public id: ID,
    public tweet_ids: ID[],
    public post_id: ID,
    public text: String
  ) {}
}
