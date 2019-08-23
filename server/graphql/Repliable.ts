import { interfaceType } from "nexus";

export const Repliable = interfaceType({
  name: "Repliable",
  definition(t) {
    t.field("text", { type: "String" });
    t.resolveType(() => null);
  }
});
