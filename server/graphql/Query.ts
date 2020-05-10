import {
  queryType,
  stringArg,
  idArg,
  arg,
  intArg,
  booleanArg,
} from "@nexus/schema";

import { UserNotFoundError } from "../errors/user_not_found_error";
import * as value from "../value";

export const Query = queryType({
  definition(t) {
    t.list.field("search", {
      type: "Post",
      args: {
        query: arg({ type: "SearchInput", required: true }),
      },
      async resolve(_, { query }, { repositories: { postRepository } }) {
        if (!query.language) {
          const posts = await postRepository.findAll();
          return posts;
        }
        const posts = await postRepository.findByLanguages([
          new value.Language(query.language),
        ]);
        return posts;
      },
    });

    t.list.field("feed", {
      type: "Post",
      args: {
        offset: intArg({ default: 0, required: true }),
        limit: intArg({ default: 20, required: true }),
      },
      async resolve(
        _,
        { offset, limit },
        { uid, repositories: { userRepository, postRepository } }
      ) {
        if (!uid) {
          const posts = await postRepository.findByLanguages([], "", {
            offset,
            limit,
          });
          return posts;
        }
        const user = await userRepository.findById(uid);
        if (!user) {
          throw new UserNotFoundError(uid);
        }
        const posts = await postRepository.findByLanguages(
          user.fluentLanguages,
          user.id,
          { offset, limit }
        );
        return posts;
      },
    });

    t.list.field("posts", {
      type: "Post",
      args: {},
      resolve() {
        return [];
      },
    });

    t.field("post", {
      type: "Post",
      args: {
        id: idArg({ required: true }),
      },
      async resolve(_, { id }, { repositories: { postRepository } }) {
        const post = await postRepository.findById(id);
        if (!post) {
          throw new Error("post not found");
        }
        return post;
      },
    });
    t.field("tweet", {
      type: "Tweet",
      args: {
        id: idArg({ required: true, description: "tweet id" }),
      },
      async resolve(_, { id }, { repositories: { tweetRepository } }) {
        const tweet = await tweetRepository.findOneById(id);
        if (!tweet) {
          throw new Error("tweet not found");
        }
        return tweet;
      },
    });
    t.list.field("replies", {
      type: "Tweet",
      args: {
        id: idArg({ required: true, description: "repliable ID" }),
      },
      async resolve(_, { id }, { repositories: { tweetRepository } }) {
        const tweets = await tweetRepository.findRepliesTo(id);
        return tweets;
      },
    });

    t.list.field("langs", {
      type: "Language",
      args: { relatedOnly: booleanArg({ required: false, default: false }) },
      async resolve(
        _root,
        { relatedOnly },
        { uid, repositories: { userRepository } }
      ) {
        if (uid && relatedOnly) {
          const result = await userRepository.findById(uid as string);
          if (result === null) {
            throw new UserNotFoundError(uid);
          }
          return [
            ...result.fluentLanguages,
            ...result.learningLanguages,
          ].map((lang) => ({ id: lang.code, name: lang.name }));
        }
        return value.Language.getAllLanguages().map((language) => ({
          id: language.code,
          name: language.name,
        }));
      },
    });

    t.list.field("timezones", {
      type: "Timezone",
      resolve() {
        return value.Timezone.getTimezoneList().map((tz) => ({
          id: tz.timezone,
          offset: tz.offset,
        }));
      },
    });

    t.field("viewer", {
      authorize: (_, __, { uid }) => {
        return uid !== null;
      },
      type: "User",
      args: {},
      async resolve(_, __, { uid, repositories: { userRepository } }) {
        const result = await userRepository.findById(uid as string);
        if (result === null) {
          throw new UserNotFoundError(uid);
        }
        return result;
      },
    });

    t.field("user", {
      type: "User",
      args: { username: stringArg({ required: true }) },
      async resolve(_, { username }, { repositories: { userRepository } }) {
        const result = await userRepository.findByUsername(username);
        if (result === null) {
          throw new UserNotFoundError(username);
        }
        return result;
      },
    });
  },
});
