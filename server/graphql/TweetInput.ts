import { inputObjectType } from "nexus";

export const TweetInput = inputObjectType({
  name: "TweetInput",
  definition(t) {
    t.int("inReplyTo", { required: true });
    t.int("postId", { required: true });
    t.string("text", { required: true });
  }
});
