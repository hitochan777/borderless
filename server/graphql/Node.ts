import { interfaceType } from "nexus";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", {
      nullable: true,
      description: "Unique identifier for the resource"
    });
    t.resolveType(() => null);
  }
});
