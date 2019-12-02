import { queryType, stringArg, idArg } from "nexus";

import * as value from "../value/language";

export const Query = queryType({
  definition(t) {
    t.list.field("feed", {
      type: "Post",
      args: {
        uid: stringArg({ required: true })
      },
      async resolve(
        _,
        { uid },
        { repositories: { userRepository, postRepository } }
      ) {
        const user = await userRepository.findByUid(uid);
        if (!user) {
          throw new Error("User not found");
        }
        const posts = await postRepository.findByLanguages(
          user.fluentLanguages
        );
        return posts;
      }
    });
    t.list.field("posts", {
      type: "Post",
      args: {},
      resolve(_, __, ___) {
        return [];
      }
    });
    t.field("post", {
      type: "Post",
      args: {
        id: idArg({ required: true })
      },
      async resolve(_, { id }, { repositories: { postRepository } }) {
        const post = await postRepository.findById(id);
        if (!post) {
          throw new Error("post not found");
        }
        return post;
      }
    });
    t.field("tweet", {
      type: "Tweet",
      args: {
        id: idArg({ required: true, description: "tweet id" })
      },
      async resolve(_, { id }, { repositories: { tweetRepository } }) {
        const tweet = await tweetRepository.findTweetById(id);
        if (!tweet) {
          throw new Error("tweet not found");
        }
        return tweet;
      }
    });
    t.list.field("replies", {
      type: "Tweet",
      args: {
        id: idArg({ required: true, description: "repliable ID" })
      },
      async resolve(_, { id }, { repositories: { tweetRepository } }) {
        const tweets = await tweetRepository.findRepliesTo(id);
        return tweets;
      }
    });
    t.list.field("langs", {
      type: "Language",
      args: {},
      resolve(_, __, ___) {
        return Object.keys(value.Language)
          .filter(value => !isNaN(+value))
          .map(id => ({
            id,
            name: value.Language[+id]
          }));
      }
    });
    t.field("viewer", {
      authorize: (_, __, { uid }) => {
        return uid !== null;
      },
      type: "User",
      args: {},
      async resolve(_, __, { uid, repositories: { userRepository } }) {
        if (uid === null) {
          throw new Error("uid is empty");
        }
        const result = await userRepository.findByUid(uid);
        if (result === null) {
          throw new Error("User not found");
        }
        return result;
      }
    });
  }
});
