import { mutationType, arg, idArg, stringArg } from "nexus";
import * as admin from "firebase-admin";
import cookie from "cookie";
import { Post } from "../entity/post";
import { Line } from "../entity/line";
import { User } from "../entity/user";
import { LineContent } from "../entity/line_content";
import { Language } from "../value/language";

export const Mutation = mutationType({
  definition(t) {
    t.field("userCreate", {
      authorize: (_, __, { uid }) => uid !== null,
      type: "User",
      args: {
        id: idArg({ required: true })
      },
      resolve: async (_, { id }, { repositories: { userRepository } }) => {
        const createdUser = await userRepository.createOnlyWithId(id);
        if (createdUser === null) {
          throw new Error(`failed to create user with uid = ${id}`);
        }
        return createdUser;
      }
    });
    t.field("userUpdate", {
      authorize: async (_, __, { uid, repositories: { userRepository } }) => {
        if (!uid) {
          return false;
        }
        const user = await userRepository.findById(uid);
        if (!user) {
          return false;
        }
        return true;
      },
      type: "User",
      args: {
        user: arg({ type: "UserInput", required: true })
      },
      resolve: async (
        _,
        { user },
        { uid, repositories: { userRepository } }
      ) => {
        if (!uid) {
          throw new Error("failed to update user");
        }
        const userEntity = new User(
          uid,
          user.email,
          user.username,
          user.fluentLanguages.map(language => new Language(language)),
          user.learningLanguages.map(language => new Language(language))
        );
        const updatedUser = await userRepository.update(uid, userEntity);
        if (!updatedUser) {
          throw new Error("failed to update user");
        }
        return updatedUser;
      }
    });
    t.field("postCreate", {
      authorize: (_, __, { uid }) => uid !== null,
      type: "Post",
      args: {
        post: arg({ type: "PostInput", required: true })
      },
      resolve: async (
        _,
        { post: postInput },
        { repositories: { postRepository, lineMarkerRepository }, uid }
      ) => {
        // Step1: create post with empty content and get ID
        const newPost = Post.create({
          userId: uid as string,
          language: new Language(postInput.language),
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

        console.log("generating line markers");
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
      authorize: async (
        _,
        { id },
        { uid, repositories: { postRepository } }
      ) => {
        if (!uid) {
          return false;
        }
        const post = await postRepository.findById(id);
        if (!post) {
          return false;
        }
        return post.userId === (uid as string);
      },
      type: "Post",
      args: {
        id: idArg({ required: true }),
        post: arg({ type: "PostInput", required: true })
      },
      resolve: async (
        _,
        { id, post: postInput },
        { repositories: { postRepository, lineMarkerRepository }, uid }
      ) => {
        const lines: Line[] = [];

        for (const [index, postInputLine] of postInput.lines.entries()) {
          const lineContent: LineContent = {
            partialLines: postInput.lines[index].partialLines.map(
              partialLine => ({
                subtext: partialLine.subtext,
                referers: []
              })
            )
          };
          const line = new Line(postInputLine.id ?? null, id, lineContent, []);

          lines.push(line);
        }

        // create line markers for new lines
        const numNewLines = lines.filter(line => line.isNotPersisted()).length;
        const lineMarkerIds = await lineMarkerRepository.generateIds(
          numNewLines,
          id
        );

        for (let i = 0, newIdIdx = 0; i < lines.length; i++) {
          if (lines[i].isNotPersisted()) {
            lines[i].id = lineMarkerIds[newIdIdx++];
          }
        }

        const post = new Post(
          id,
          uid as string,
          new Language(postInput.language),
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
    t.field("postLike", {
      authorize: (_, __, { uid }) => uid !== null,
      type: "Post",
      args: {
        id: idArg({ required: true })
      },
      async resolve(
        _,
        { id: postId },
        { uid, repositories: { postRepository } }
      ) {
        await postRepository.toggleLike(uid as string, postId);
        const maybePost = await postRepository.findById(postId);
        if (!maybePost) {
          throw new Error("Post not found");
        }
        console.log("post found", maybePost);
        return maybePost;
      }
    });

    t.field("tweetCreate", {
      authorize: (_, __, { uid }) => uid !== null,
      type: "Tweet",
      args: {
        tweet: arg({ type: "TweetInput", required: true })
      },
      resolve: async (
        _,
        { tweet: tweetInput },
        { repositories: { postRepository, tweetRepository }, uid }
      ) => {
        const post = await postRepository.findById(tweetInput.postId);
        if (!post) {
          throw new Error("post not found");
        }
        const tweet = await tweetRepository.create({
          ...tweetInput,
          userId: uid as string
        });
        if (!tweet) {
          throw new Error("Failed to create a tweet");
        }

        return tweet;
      }
    });
    t.field("tweetLike", {
      authorize: (_, __, { uid }) => uid !== null,
      type: "Tweet",
      args: {
        id: idArg({ required: true })
      },
      async resolve(
        _,
        { id: tweetId },
        { uid, repositories: { tweetRepository } }
      ) {
        await tweetRepository.toggleLike(uid as string, tweetId);
        const maybeTweet = await tweetRepository.findTweetById(tweetId);
        if (!maybeTweet) {
          throw new Error("Tweet not found");
        }
        return maybeTweet;
      }
    });
    t.field("logout", {
      authorize: (_, __, { uid }) => uid !== null,
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
        const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
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
