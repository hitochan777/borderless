import { stringArg, mutationType, arg, intArg } from "nexus";
import * as admin from "firebase-admin";
import cookie from "cookie";
import { Post } from "../entity/post";
import { Line } from "../entity/line";
import { LineContent } from "../entity/line_content";

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
        {
          repositories: {
            userRepository,
            postRepository,
            lineMarkerRepository
          },
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

        // Step1: create post with empty content and get ID
        const newPost = Post.create({
          userId: user.id,
          language: postInput.language,
          lines: [],
          isDraft: postInput.isDraft
        });
        console.log("creating post");
        const createdPost = await postRepository.create(newPost);
        if (!createdPost) {
          throw new Error("Failed to create a post");
        }
        if (createdPost.id === null) {
          throw new Error("created post has null ID");
        }

        // Step2: create line markers with the post ID and get line marker IDs
        const lineMarkerIds = await lineMarkerRepository.generateIds(
          postInput.lines.length,
          createdPost.id
        );

        // Step3: fill post content with line IDs and update the post
        if (lineMarkerIds.length !== postInput.lines.length) {
          throw new Error("line marker length and lines length not equal");
        }

        const lines: Line[] = [];

        for (const [index, markerId] of lineMarkerIds.entries()) {
          const lineContent: LineContent = {
            partialLines: postInput.lines[index].partialLines.map(
              partialLine => ({
                subtext: partialLine.subtext,
                referers: []
              })
            )
          };
          const line = new Line(markerId, createdPost.id, lineContent, []);
          lines.push(line);
        }

        const lineIdsFilledPost = Object.create(createdPost, {});
        lineIdsFilledPost.lines = lines;

        const updatedPost = await postRepository.update(lineIdsFilledPost);

        if (updatedPost === null) {
          throw new Error("Error during update");
        }

        return updatedPost;
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

        const lines: Line[] = [];

        for (const [index, postInputLine] of postInput.lines.entries()) {
          if (postInputLine.id === undefined) {
            throw new Error("Line ID is null");
          }
          const lineContent: LineContent = {
            partialLines: postInput.lines[index].partialLines.map(
              partialLine => ({
                subtext: partialLine.subtext,
                referers: []
              })
            )
          };
          const line = Line.create({
            postId: id,
            lineContent,
            replies: []
          });
          lines.push(line);
        }

        const post = new Post(
          id,
          user.id,
          postInput.language,
          lines,
          postInput.isDraft
        );
        const updatedPost = await postRepository.update(post);
        if (!updatedPost) {
          throw new Error("Failed to update a post");
        }

        return updatedPost;
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
