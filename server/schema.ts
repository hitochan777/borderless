import {
  objectType,
  interfaceType,
  queryType,
  stringArg,
  makeSchema,
  mutationType,
  inputObjectType,
  arg
} from "nexus";
import path from "path";
import * as admin from "firebase-admin";
import cookie from "cookie";

import * as value from "./value/language";

const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
    t.resolveType(() => null);
  }
});

const Repliable = interfaceType({
  name: "Repliable",
  definition(t) {
    t.field("text", { type: "String" });
    t.resolveType(() => null);
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.implements(Node);
    t.string("username");
    t.string("email");
    t.list.field("fluentLanguages", {
      type: "Int"
    });
    t.list.field("learningLanguages", {
      type: "Int"
    });
    t.list.field("posts", {
      type: "Post",
      async resolve(root, args, { repositories: { postRepository } }) {
        const posts = await postRepository.findByUid(root.id);
        return posts.map((post: any) => ({
          id: `${post.id}`,
          userId: root.id,
          text: post.text,
          language: post.language
        }));
      }
    });
  }
});

const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements(Node);
    t.string("text");
    t.string("userId");
    t.int("language");
  }
});

const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements(Node);
    t.implements(Repliable);
    t.list.field("tweets", {
      type: "Tweet"
    });
    t.field("post", {
      type: "Post"
    });
  }
});

const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements(Node);
    t.implements(Repliable);
    t.list.field("replies", {
      type: "Tweet"
    });
    t.field("inReplyTo", {
      type: Repliable
    });
  }
});

const AuthData = objectType({
  name: "AuthData",
  definition(t) {
    t.string("token");
  }
});

const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    t.string("username");
    t.string("email");
    t.list.field("fluentLanguages", {
      type: "String"
    });
    t.list.field("learningLanguages", {
      type: "String"
    });
  }
});

const PostInput = inputObjectType({
  name: "PostInput",
  definition(t) {
    t.int("language", { required: true });
    t.string("text", { required: true });
  }
});

const Language = objectType({
  name: "Language",
  definition(t) {
    t.implements(Node);
    t.string("name");
  }
});

const Query = queryType({
  definition(t) {
    t.list.field("posts", {
      type: "Post",
      args: {},
      resolve(root, args, ctx) {
        return [];
      }
    });
    t.list.field("langs", {
      type: "Language",
      args: {},
      resolve(root, args, ctx) {
        return Object.keys(value.Language)
          .filter(value => !isNaN(+value))
          .map(id => ({
            id,
            name: value.Language[+id]
          }));
      }
    });
    t.field("viewer", {
      type: User,
      args: {},
      async resolve(_, __, { uid, repositories: { userRepository } }) {
        if (uid === null) {
          throw new Error("uid is empty");
        }
        const result = await userRepository.findByUid(uid);
        if (result === null) {
          throw new Error("User not found");
        }
        return {
          id: uid,
          email: result.email,
          username: result.username,
          fluentLanguages: result.fluentLanguages,
          learningLanguages: result.learningLanguages
        };
      }
    });
  }
});

const Mutation = mutationType({
  definition(t) {
    t.field("userCreate", {
      type: User,
      args: {
        id: stringArg({ required: true })
      },
      resolve: async (root, { id }, { repositories: { userRepository } }) => {
        const newUser = await userRepository.create(id);
        if (!newUser) {
          throw new Error(`failed to create user with uid = ${id}`);
        }
        console.log(newUser);
        return {
          id: newUser.uid,
          email: newUser.email,
          username: newUser.username,
          fluentLanguages: newUser.fluentLanguages,
          learningLanguages: newUser.learningLanguages
        };
      }
    });
    t.field("userUpdate", {
      type: User,
      args: {
        id: stringArg({ required: true }),
        user: arg({ type: UserInput, required: true })
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
        return {
          id: updatedUser.uid,
          email: updatedUser.email,
          username: updatedUser.username,
          fluentLanguages: updatedUser.fluentLanguages,
          learningLanguages: updatedUser.learningLanguages
        };
      }
    });
    t.field("postCreate", {
      type: "Post",
      args: {
        post: arg({ type: PostInput, required: true })
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
        const post = await postRepository.create({
          userId: user.id,
          language: postInput.language,
          text: postInput.text
        });
        if (!post) {
          throw new Error("Failed to create a post");
        }
        return {
          id: `${post.id}`,
          userId: `{${post.userId}`,
          language: post.language,
          text: post.text
        };
      }
    });
    t.field("logout", {
      type: "Boolean",
      resolve: async (root, args, { res }) => {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("session", "", { maxAge: 0 })
        );
        return true;
      }
    });
    t.field("signin", {
      type: AuthData,
      args: {
        token: stringArg({ required: true })
      },
      resolve: async (
        root,
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

export const schema = makeSchema({
  types: [
    User,
    Node,
    Post,
    Line,
    Language,
    Tweet,
    AuthData,
    Query,
    Mutation,
    UserInput,
    Repliable,
    PostInput
  ],
  outputs: {
    schema: path.join(__dirname, "schema.graphql"),
    typegen: path.join(__dirname, "typegen.ts")
    // typegen: false
  },
  typegenAutoConfig: {
    contextType: "ctx.GraphQLContext",
    sources: [
      {
        alias: "ctx",
        source: path.join(__dirname, "types.ts")
      }
    ]
  }
});
