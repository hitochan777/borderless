import { inputObjectType } from "nexus";

export const LineInput = inputObjectType({
  name: "LineInput",
  definition(t) {
    t.string("text", { required: true });
    t.string("comment");
  }
});
