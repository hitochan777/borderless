import { objectType } from "nexus";
import { Post } from "../entity/post";

export const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements("Node");
    t.implements("Repliable");
    t.list.field("tweets", {
      type: "Tweet",
      resolve() {
        return [];
      }
    });
    t.field("post", {
      type: "Post",
      // TODO: replace with a correct logic
      resolve() {
        return new Post(1, 1, 1, "");
      }
    });
  }
});
