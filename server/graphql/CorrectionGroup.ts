import { objectType } from "nexus";

export const CorrectionGroup = objectType({
  name: "CorrectionGroup",
  definition(t) {
    t.implements("Node");
    t.field("postedBy", {
      type: "User",
      async resolve(root, _, { repositories: { userRepository } }) {
        const user = await userRepository.findById(root.userId);
        if (!user) {
          throw new Error("user not found");
        }
        return user;
      },
    });

    t.field("post", {
      type: "Post",
      async resolve(root, _, { repositories: { postRepository } }) {
        const post = await postRepository.findById(root.postId);
        if (!post) {
          throw new Error("post not found");
        }
        return post;
      },
    });

    t.field("summaryComment", {
      type: "Tweet",
      nullable: true,
      async resolve(root, _, { repositories: { tweetRepository } }) {
        if (!root.summaryCommentId) {
          return null;
        }
        const maybeTweet = await tweetRepository.findOneById(
          root.summaryCommentId
        );
        if (!maybeTweet) {
          throw new Error("Tweet not found");
        }
        return maybeTweet;
      },
    });

    t.list.field("lineCorrections", {
      type: "Tweet",
      async resolve(root, _, { repositories: { tweetRepository } }) {
        const tweets = await tweetRepository.findManyByIds(root.correctionIds);
        return tweets;
      },
    });

    t.date("createdAt", {
      nullable: true,
      resolve(root) {
        return root.createdAt;
      },
    });
    t.date("updatedAt", {
      nullable: true,
      resolve(root) {
        return root.updatedAt;
      },
    });
  },
});
