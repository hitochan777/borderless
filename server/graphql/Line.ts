import { objectType } from "nexus";

export const Line = objectType({
  name: "Line",
  definition(t) {
    t.string("text");
    t.list.field("replies", {
      type: "Tweet"
    });
  }
});
