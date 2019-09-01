import { ID } from "../types";

export type RepliableType = "Tweet" | "Line";

export class Tweet {
  constructor(
    public id: string,
    public userId: ID,
    public replyIds: ID[],
    public inReplyToId: ID,
    public inReplyToType: RepliableType,
    public text: String
  ) {}
}
