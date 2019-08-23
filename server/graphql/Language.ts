import { objectType } from "nexus";

export const Language = objectType({
  name: "Language",
  definition(t) {
    t.implements("Node");
    t.string("name");
  }
});
