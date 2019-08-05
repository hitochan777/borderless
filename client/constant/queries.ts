import { query, types } from "typed-graphqlify";
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
