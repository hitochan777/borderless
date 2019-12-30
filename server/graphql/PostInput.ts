import { inputObjectType } from "nexus";

export const PostInput = inputObjectType({
  name: "PostInput",
  definition(t) {
    t.string("language", { required: true });
    t.list.field("lines", { type: "LineInput", required: true });
    t.boolean("isDraft", { default: true, required: true });
  }
});
