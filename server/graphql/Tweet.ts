import { objectType } from "nexus";

export const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements("Node");
    t.string("text");
    t.int("inReplyTo", {
      nullable: true
    });
    t.field("postedBy", {
      type: "User",
      async resolve(root, _, { repositories: { userRepository } }) {
        const user = await userRepository.findById(root.userId);
        if (!user) {
          throw new Error("user not found");
        }
        return user;
      }
    });
    t.field("post", {
      type: "Post",
      async resolve(root, _, { repositories: { postRepository } }) {
        const post = await postRepository.findById(root.postId);
        if (!post) {
          throw new Error("post not found");
        }
        return post;
      }
    });
    t.list.field("replies", {
      type: "Tweet",
      async resolve(root, _, { repositories: { tweetRepository } }) {
        const replies = await tweetRepository.findRepliesTo(root.id);
        return replies;
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
      async resolve(post, _, { repositories: { tweetRepository } }) {
        const count = await tweetRepository.countLike(post.id);
        return count;
      }
    });
    t.boolean("likedByMe", {
      async resolve(tweet, _, { uid, repositories: { tweetRepository } }) {
        return await tweetRepository.likedByMe(uid as string, tweet.id);
      }
    });
  }
});
