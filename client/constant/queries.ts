import { query, types, params } from "typed-graphqlify";
import gql from "graphql-tag";

export const GetViewerQuery = {
  viewer: {
    username: types.string,
    email: types.string,
    fluentLanguages: [types.number],
    learningLanguages: [types.number],
    posts: [{ id: types.string, text: types.string, language: types.number }]
  }
};

export const GET_VIEWER = gql(query(GetViewerQuery));

const Post = {
  id: types.string,
  text: types.string,
  language: types.number
};

export const GetPostById = params(
  { $id: "Int!" },
  {
    post: params({ id: "$id" }, Post)
  }
);

export const GET_POST_BY_ID = gql(query(GetPostById));

export const GetFeedForUser = params(
  { $uid: "String!" },
  {
    feed: params({ uid: "$uid" }, [Post])
  }
);

export const GET_FEED_FOR_USER = gql(query(GetFeedForUser));
