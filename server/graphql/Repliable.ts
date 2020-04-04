import { unionType } from "@nexus/schema";

export const Repliable = unionType({
  name: "Repliable",
  description: "Anything that can be replied",
  definition(t) {
    t.members("Tweet", "Line");
    t.resolveType((_) => "Line");
  },
});
