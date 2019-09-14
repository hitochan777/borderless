import { objectType } from "nexus";

import * as value from "../value/language";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements("Node");
    t.list.field("lines", {
      type: "Line",
      async resolve(root, _, { repositories: { tweetRepository } }) {
        const lineTexts = root.text.split("\n");
        const replies = await tweetRepository.findTweetForLinesByPostId(
          root.id
        );
        const table: { [key: number]: any[] } = {};
        for (const reply of replies) {
          if (!reply.lineRef) {
            continue;
          }
          if (!table[reply.lineRef.lineNum]) {
            table[reply.lineRef.lineNum] = [];
          }
          table[reply.lineRef.lineNum].push(reply);
        }
        return lineTexts.map((text, index) => ({
          text,
          replies: table[index] || []
        }));
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
  }
});
