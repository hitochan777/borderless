import { objectType } from "nexus";

export const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements("Node");
    t.list.field("partialLines", {
      type: "PartialLine",
      resolve(root) {
        return root.lineContent.partialLines.map(partialLine => ({
          text: partialLine.subtext
        }));
      }
    });
    t.list.field("replies", {
      type: "Tweet",
      async resolve(root, _, { repositories: { tweetRepository } }) {
        if (!root.id) {
          throw new Error("Invalid tweet ID");
        }
        const tweets = await tweetRepository.findRepliesTo(root.id);
        return tweets;
      }
    });
  }
});
