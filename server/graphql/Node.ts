import { interfaceType } from "nexus";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", {
      resolve() {
        return "";
      },
      description: "Unique identifier for the resource"
    });
    t.resolveType(() => null);
  }
});
