import {
  objectType,
  interfaceType,
  queryType,
  stringArg,
  makeSchema,
  mutationType
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
    t.string("password");
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
    t.implements(Node);
    t.string("token");
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
  }
});

const Mutation = mutationType({
  definition(t) {
    t.field("logout", {
      type: "Boolean",
      resolve: async (root, args, { res }) => {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("session", "", { maxAge: 0 })
        );
        return true;
      }
    }),
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
              token
            };
          } catch (error) {
            console.log(error);
            throw new Error("UNAUTHORIZED");
          }
        }
      });
  }
});

const findUser = async (uid: string) => {
  return true; // TODO: implement
};

const isNewUser = async (token: string) => {
  const decodedToken = await admin.auth().verifyIdToken(token);
  let uid = decodedToken.uid;
  const found = await findUser(uid);
  return !found;
};

export const schema = makeSchema({
  types: [User, Node, Post, Line, Tweet, AuthData, Query, Mutation],
  outputs: {
    schema: path.join(__dirname, "schema.graphql"),
    // typegen: path.join(__dirname, "typegen.ts"),
    typegen: false
  }
});
