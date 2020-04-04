import { objectType } from "@nexus/schema";

export const Language = objectType({
  name: "Language",
  definition(t) {
    t.language("id");
    t.string("name");
  },
});
