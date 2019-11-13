import { objectType } from "nexus";

export const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements("Node");
    t.list.field("partialLines", {
      type: "PartialLine",
      resolve(root) {
        return [{ text: root.text }];
      }
    });
    t.list.field("replies", {
      type: "Tweet",
      resolve() {
        return [];
      }
    });
  }
});
