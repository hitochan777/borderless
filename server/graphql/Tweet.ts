import { objectType } from "nexus";

export const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements("Node");
    t.string("text");
    t.int("inReplyTo", {
      nullable: true
    });
    t.int("userId");
    t.list.field("replyIds", {
      type: "Int",
      resolve() {
        return [];
      }
    });
  }
});
