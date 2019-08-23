import { objectType } from "nexus";

export const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements("Node");
    t.implements("Repliable");
    t.list.field("replies", {
      type: "Tweet",
      resolve() {
        return [];
      }
    });
    t.field("inReplyTo", {
      type: "Repliable",
      resolve() {
        // TODO: replace with a correct logic
        return { id: 1, post_id: 1, order: 2, text: "" };
      }
    });
  }
});
