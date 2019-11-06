import { query, types, params, mutation } from "typed-graphqlify";
import gql from "graphql-tag";

export const Post = {
  id: types.string,
  json: types.string,
  lines: [types.string],
  language: { id: types.string, name: types.string },
  user: {
    username: types.string
  },
  isDraft: types.boolean
};

export const GetViewerQuery = {
  viewer: {
    id: types.string,
    username: types.string,
    email: types.string,
    fluentLanguages: [types.number],
    learningLanguages: [types.number],
    posts: [Post]
  }
};

export const GET_VIEWER = gql(query(GetViewerQuery));

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

export const GetLanguagesQuery = {
  langs: [
    {
      id: types.string,
      name: types.string
    }
  ]
};

export const GET_LANGUAGES = gql(query(GetLanguagesQuery));

export const UpdatePostReturnObject = {
  id: types.string
};
export const UpdatePostMutation = mutation(
  "updatePostMutation",
  params(
    { $id: "Int!", $post: "PostInput!" },
    {
      postUpdate: params({ id: "$id", post: "$post" }, UpdatePostReturnObject)
    }
  )
);

export const UPDATE_POST = gql(UpdatePostMutation);
