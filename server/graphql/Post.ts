import { objectType } from "nexus";

import * as value from "../value/language";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements("Node");
    t.string("json", {
      async resolve(root, _) {
        return JSON.stringify(root.content);
      }
    });
    t.string("title", {
      resolve(root) {
        return root.title;
      }
    });
    t.list.field("lines", {
      type: "Line",
      async resolve(root, _) {
        return root.lines;
      }
    }),
      t.field("user", {
        type: "User",
        async resolve(root, _, { repositories: { userRepository } }) {
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
    t.list.field("replies", {
      type: "Tweet",
      resolve: async (root, _, { repositories: { tweetRepository } }) => {
        return await tweetRepository.findRepliesTo(root.id);
      }
    });
  }
});
