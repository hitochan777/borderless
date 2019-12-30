import { objectType } from "nexus";

import * as value from "../value/language";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements("Node");
    t.string("json", {
      async resolve(root, _, { services: { editorService } }) {
        return JSON.stringify(
          editorService.transformLinesToSlateJson(root.lines)
        );
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
          id: root.language.code,
          name: root.language.name
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
    t.date("createdAt", {
      nullable: true,
      resolve(root) {
        return root.createdAt;
      }
    });
    t.date("updatedAt", {
      nullable: true,
      resolve(root) {
        return root.updatedAt;
      }
    });
    t.int("likeCount", {
      async resolve(root, _, { repositories: { postRepository } }) {
        const count = await postRepository.countLike(root.id);
        return count;
      }
    });
    t.boolean("likedByMe", {
      async resolve(post, _, { uid, repositories: { postRepository } }) {
        return await postRepository.likedByMe(uid as string, post.id);
      }
    });
  }
});
