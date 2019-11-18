import { stringArg, mutationType, arg, intArg } from "nexus";
import * as admin from "firebase-admin";
import cookie from "cookie";

import { Post } from "../entity/post";
import { Line } from "../entity/line";

export const Mutation = mutationType({
  definition(t) {
    t.field("userCreate", {
      type: "User",
      args: {
        id: stringArg({ required: true })
      },
      resolve: async (_, { id }, { repositories: { userRepository } }) => {
        const newUser = await userRepository.create({ uid: id });
        if (!newUser) {
          throw new Error(`failed to create user with uid = ${id}`);
        }
        return newUser;
      }
    });
    t.field("userUpdate", {
      type: "User",
      args: {
        id: stringArg({ required: true }),
        user: arg({ type: "UserInput", required: true })
      },
      resolve: async (
        _,
        { id, user },
        { repositories: { userRepository } }
      ) => {
        const updatedUser = await userRepository.update(id, user);
        if (!updatedUser) {
          throw new Error("failed to update user");
        }
        return updatedUser;
      }
    });
    t.field("postCreate", {
      type: "Post",
      args: {
        post: arg({ type: "PostInput", required: true })
      },
      resolve: async (
        _,
        { post: postInput },
        { repositories: { userRepository, postRepository }, uid }
      ) => {
        if (!uid) {
          throw new Error("uid is empty");
        }
        const user = await userRepository.findByUid(uid);
        if (!user) {
          throw new Error("user not found");
        }
        const newPost = Post.create({
          userId: user.id,
          language: postInput.language,
          lines: postInput.lines.map(line => Line.createFromString(line)),
          isDraft: postInput.isDraft
        });
        const post = await postRepository.create(newPost);
        if (!post) {
          throw new Error("Failed to create a post");
        }

        return post;
      }
    });
    t.field("postUpdate", {
      type: "Post",
      args: {
        id: intArg({ required: true }),
        post: arg({ type: "PostInput", required: true })
      },
      resolve: async (
        _,
        { id, post: postInput },
        { repositories: { userRepository, postRepository }, uid }
      ) => {
        if (!uid) {
          throw new Error("uid is empty");
        }
        const user = await userRepository.findByUid(uid);
        if (!user) {
          throw new Error("user not found");
        }
        const post = await postRepository.update(id, {
          language: postInput.language,
          lines: postInput.lines.map(line => Line.createFromString(line)),
          isDraft: postInput.isDraft
        });
        if (!post) {
          throw new Error("Failed to update a post");
        }

        return post;
      }
    });
    t.field("tweetCreate", {
      type: "Tweet",
      args: {
        tweet: arg({ type: "TweetInput", required: true })
      },
      resolve: async (
        _,
        { tweet: tweetInput },
        {
          repositories: { postRepository, tweetRepository, userRepository },
          uid
        }
      ) => {
        if (!uid) {
          throw new Error("uid is empty");
        }
        const user = await userRepository.findByUid(uid);
        if (!user) {
          throw new Error("user not found");
        }
        const post = await postRepository.findById(tweetInput.postId);
        if (!post) {
          throw new Error("post not found");
        }
        const tweet = await tweetRepository.create({
          ...tweetInput,
          userId: user.id
        });
        if (!tweet) {
          throw new Error("Failed to create a tweet");
        }

        return tweet;
      }
    });
    t.field("logout", {
      type: "Boolean",
      resolve: async (_, __, { res }) => {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("session", "", { maxAge: 0 })
        );
        return true;
      }
    });
    t.field("signin", {
      type: "AuthData",
      args: {
        token: stringArg({ required: true })
      },
      resolve: async (
        _,
        { token },
        { res, repositories: { userRepository } }
      ) => {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        try {
          const sessionCookie = await admin
            .auth()
            .createSessionCookie(token, { expiresIn });

          const decodedToken = await admin.auth().verifyIdToken(token);
          await userRepository.findByIdOrCreate(decodedToken.uid);

          // FIXME: secure should be true for security
          const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: false
          };
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("session", sessionCookie, options)
          );
          return {
            token: sessionCookie
          };
        } catch (error) {
          console.log(error);
          throw new Error("UNAUTHORIZED");
        }
      }
    });
  }
});
