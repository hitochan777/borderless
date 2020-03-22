import { inputObjectType } from "nexus";

export const SearchInput = inputObjectType({
  name: "SearchInput",
  definition(t) {
    t.string("language");
  },
});
