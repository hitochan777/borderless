import { objectType } from "nexus";

import * as value from "../value/language";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements("Node");
    t.string("content", {
      async resolve(root, _, { repositories: { tweetRepository } }) {
        const dummy = {
          type: "line"
        };
        return JSON.stringify(dummy);
      }
    });
    t.field("user", {
      type: "User",
      async resolve(root, args, { repositories: { userRepository } }) {
        const user = await userRepository.findById(root.userId);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      }
    });
    t.field("language", {
      type: "Language",
      resolve(root) {
        return {
          id: `${root.language}`,
          name: value.Language[root.language]
        };
      }
    });
    t.boolean("isDraft");
  }
});
