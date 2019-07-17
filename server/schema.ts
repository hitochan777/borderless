import {
  enumType,
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

const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
    t.resolveType(() => null);
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.implements(Node);
    t.string("username");
    t.string("email");
    t.list.field("fluentLangs", {
      type: "Int"
    });
    t.list.field("learningLangs", {
      type: "Int"
    });
  }
});

const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements(Node);
    t.list.field("lines", {
      type: "Line"
    });
    t.field("user", {
      type: "User"
    });
    t.string("lang");
  }
});

const Line = objectType({
  name: "Line",
  definition(t) {
    t.implements(Node);
    t.list.field("tweets", {
      type: "Tweet"
    });
    t.field("post", {
      type: "Post"
    });
    t.string("text");
  }
});

const Tweet = objectType({
  name: "Tweet",
  definition(t) {
    t.implements(Node);
    t.list.field("replies", {
      type: "Tweet"
    });
    t.field("parentTweet", {
      type: "Tweet"
    });
    t.field("line", {
      type: "Line"
    });
    t.string("text");
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
    t.list.field("fluentLangs", {
      type: "String"
    });
    t.list.field("learningLangs", {
      type: "String"
    });
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
      type: "Post",
      args: {},
      resolve(root, args, ctx) {
        return [];
      }
    });
    t.field("viewer", {
      type: User,
      args: {},
      async resolve(_, __, { uid, repositories: { userRepository } }) {
        if (uid === null) {
          throw new Error("not logged in");
        }
        const result = await userRepository.findByUid(uid);
        if (result === null) {
          throw new Error("User not found");
        }
        return {
          id: uid,
          email: result.email,
          username: result.username,
          fluentLangs: result.fluentLanguages,
          learningLangs: result.learningLanguages
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
        console.log(newUser)
        return {
          id: newUser.uid,
          email: newUser.email,
          username: newUser.username,
          fluentLangs: newUser.fluentLanguages,
          learningLangs: newUser.learningLanguages
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
        root,
        { id, user },
        { repositories: { userRepository } }
      ) => {
        const updatedUser = await userRepository.update(id, user);
        if (!updatedUser) {
          throw new Error("failed to update user")
        }
        return {
          id: updatedUser.uid,
          email: updatedUser.email,
          username: updatedUser.username,
          fluentLangs: updatedUser.fluentLanguages,
          learningLangs: updatedUser.learningLanguages
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
      resolve: async (root, { token }, { res }) => {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        try {
          const sessionCookie = await admin
            .auth()
            .createSessionCookie(token, { expiresIn });

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
  types: [User, Node, Post, Line, Tweet, AuthData, Query, Mutation, UserInput],
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
