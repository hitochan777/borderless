import { inputObjectType } from "@nexus/schema";

export const TweetInput = inputObjectType({
  name: "TweetInput",
  definition(t) {
    t.id("inReplyTo", { required: true });
    t.id("postId", { required: true });
    t.string("text", { required: true });
    t.string("correction", { required: false });
  },
});
