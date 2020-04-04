import { inputObjectType } from "@nexus/schema";

export const SearchInput = inputObjectType({
  name: "SearchInput",
  definition(t) {
    t.string("language");
  },
});
