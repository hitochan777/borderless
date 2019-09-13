import { inputObjectType } from "nexus";

export const PostInput = inputObjectType({
  name: "PostInput",
  definition(t) {
    t.int("language", { required: true });
    t.list.field("lines", { type: "LineInput", required: true });
  }
});
