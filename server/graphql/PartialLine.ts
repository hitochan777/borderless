import { objectType } from "nexus";

export const PartialLine = objectType({
  name: "PartialLine",
  definition(t) {
    t.string("text");
    // TODO: add markers field each of which contains comments
  },
});
