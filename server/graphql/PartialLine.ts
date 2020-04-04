import { objectType } from "@nexus/schema";

export const PartialLine = objectType({
  name: "PartialLine",
  definition(t) {
    t.string("text");
    // TODO: add markers field each of which contains comments
  },
});
