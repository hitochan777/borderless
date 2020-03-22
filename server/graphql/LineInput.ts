import { inputObjectType } from "nexus";

export const LineInput = inputObjectType({
  name: "LineInput",
  definition(t) {
    t.id("id", { required: false });
    t.list.field("partialLines", { type: "PartialLineInput", required: true });
  },
});
