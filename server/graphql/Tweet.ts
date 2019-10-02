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
    t.list.field("replies", {
      type: "Tweet",
      async resolve(root, _, { repositories: { tweetRepository } }) {
        const replies = await tweetRepository.findRepliesTo(root.id);
        return replies;
      }
    });
  }
});
