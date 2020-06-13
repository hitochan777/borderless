import gql from "graphql-tag";
import * as ApolloReact from "@apollo/client";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  LanguageCode: any;
};

export type Query = {
  __typename?: "Query";
  errorMessage?: Maybe<Scalars["String"]>;
  feed: Array<Post>;
  langs: Array<Language>;
  loading: Scalars["Boolean"];
  post: Post;
  posts: Array<Post>;
  replies: Array<Tweet>;
  search: Array<Post>;
  timezones: Array<Timezone>;
  tweet: Tweet;
  user: User;
  viewer: User;
};

export type QueryFeedArgs = {
  offset?: Scalars["Int"];
  limit?: Scalars["Int"];
};

export type QueryLangsArgs = {
  relatedOnly?: Maybe<Scalars["Boolean"]>;
};

export type QueryPostArgs = {
  id: Scalars["ID"];
};

export type QueryRepliesArgs = {
  id: Scalars["ID"];
};

export type QuerySearchArgs = {
  query: SearchInput;
};

export type QueryTweetArgs = {
  id: Scalars["ID"];
};

export type QueryUserArgs = {
  username: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  correctionGroupCreate: CorrectionGroup;
  logout: Scalars["Boolean"];
  postCreate: Post;
  postDelete: Scalars["Boolean"];
  postLike: Post;
  postUpdate: Post;
  setErrorMessage: Scalars["Boolean"];
  setLoading: Scalars["Boolean"];
  signin: AuthData;
  tweetCreate: Tweet;
  tweetDelete: Scalars["Boolean"];
  tweetLike: Tweet;
  userCreate: User;
  userUpdate: User;
  userUpdateSetting: User;
};

export type MutationCorrectionGroupCreateArgs = {
  corrections: Array<TweetInput>;
  summaryComment?: Maybe<TweetInput>;
};

export type MutationPostCreateArgs = {
  post: PostInput;
};

export type MutationPostDeleteArgs = {
  id: Scalars["String"];
};

export type MutationPostLikeArgs = {
  id: Scalars["ID"];
};

export type MutationPostUpdateArgs = {
  id: Scalars["ID"];
  post: PostInput;
};

export type MutationSetErrorMessageArgs = {
  errorMessage?: Maybe<Scalars["String"]>;
};

export type MutationSetLoadingArgs = {
  loading: Scalars["Boolean"];
};

export type MutationSigninArgs = {
  token: Scalars["String"];
};

export type MutationTweetCreateArgs = {
  tweet: TweetInput;
};

export type MutationTweetDeleteArgs = {
  id: Scalars["String"];
};

export type MutationTweetLikeArgs = {
  id: Scalars["ID"];
};

export type MutationUserCreateArgs = {
  id: Scalars["ID"];
};

export type MutationUserUpdateArgs = {
  user: UserInput;
};

export type MutationUserUpdateSettingArgs = {
  user: UserSettingInput;
};

export type Node = {
  /** Unique identifier for the resource */
  id: Scalars["ID"];
};

/** Anything that can be replied */
export type Repliable = Tweet | Line;

export type User = Node & {
  __typename?: "User";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  username: Scalars["String"];
  email: Scalars["String"];
  timezone: Timezone;
  fluentLanguages: Array<Language>;
  learningLanguages: Array<Language>;
  posts: Array<Post>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type Post = Node & {
  __typename?: "Post";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  json: Scalars["String"];
  title: Scalars["String"];
  lines: Array<Line>;
  user: User;
  language: Language;
  isDraft: Scalars["Boolean"];
  replies: Array<Tweet>;
  corrections: Array<CorrectionGroup>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  likeCount: Scalars["Int"];
  likedByMe: Scalars["Boolean"];
};

export type Line = Node & {
  __typename?: "Line";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  partialLines: Array<PartialLine>;
  replies: Array<Tweet>;
};

export type Language = {
  __typename?: "Language";
  id: Scalars["LanguageCode"];
  name: Scalars["String"];
};

export type Tweet = Node & {
  __typename?: "Tweet";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  text: Scalars["String"];
  correction?: Maybe<Scalars["String"]>;
  inReplyTo?: Maybe<Scalars["String"]>;
  postedBy: User;
  post: Post;
  replies: Array<Tweet>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  likeCount: Scalars["Int"];
  likedByMe: Scalars["Boolean"];
};

export type AuthData = {
  __typename?: "AuthData";
  token: Scalars["String"];
};

export type PartialLine = {
  __typename?: "PartialLine";
  text: Scalars["String"];
};

export type CorrectionGroup = Node & {
  __typename?: "CorrectionGroup";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  postedBy: User;
  post: Post;
  summaryComment?: Maybe<Tweet>;
  lineCorrections: Array<Tweet>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type Timezone = Node & {
  __typename?: "Timezone";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  offset: Scalars["String"];
};

export type UserInput = {
  username: Scalars["String"];
  email: Scalars["String"];
  fluentLanguages: Array<Scalars["String"]>;
  learningLanguages: Array<Scalars["String"]>;
};

export type UserSettingInput = {
  fluentLanguages: Array<Scalars["String"]>;
  learningLanguages: Array<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
};

export type PostInput = {
  language: Scalars["String"];
  lines: Array<LineInput>;
  isDraft: Scalars["Boolean"];
};

export type LineInput = {
  id?: Maybe<Scalars["ID"]>;
  partialLines: Array<PartialLineInput>;
};

export type PartialLineInput = {
  subtext: Scalars["String"];
  referes?: Maybe<Array<Scalars["String"]>>;
};

export type TweetInput = {
  inReplyTo: Scalars["ID"];
  postId: Scalars["ID"];
  text: Scalars["String"];
  correction?: Maybe<Scalars["String"]>;
};

export type SearchInput = {
  language?: Maybe<Scalars["String"]>;
};

export type TweetFieldFragment = { __typename?: "Tweet" } & Pick<
  Tweet,
  | "id"
  | "text"
  | "correction"
  | "updatedAt"
  | "likeCount"
  | "likedByMe"
  | "inReplyTo"
> & { postedBy: { __typename?: "User" } & Pick<User, "id" | "username"> };

export type LineFieldFragment = { __typename?: "Line" } & Pick<Line, "id"> & {
    partialLines: Array<
      { __typename?: "PartialLine" } & Pick<PartialLine, "text">
    >;
    replies: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
  };

export type PostFieldFragment = { __typename?: "Post" } & Pick<
  Post,
  "id" | "title" | "json" | "isDraft" | "updatedAt" | "likedByMe" | "likeCount"
> & {
    lines: Array<
      { __typename?: "Line" } & Pick<Line, "id"> & {
          partialLines: Array<
            { __typename?: "PartialLine" } & Pick<PartialLine, "text">
          >;
          replies: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
        }
    >;
    language: { __typename?: "Language" } & Pick<Language, "id" | "name">;
    user: { __typename?: "User" } & Pick<User, "username">;
    replies: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
    corrections: Array<
      { __typename?: "CorrectionGroup" } & Pick<
        CorrectionGroup,
        "id" | "updatedAt"
      > & {
          postedBy: { __typename?: "User" } & Pick<User, "id" | "username">;
          summaryComment?: Maybe<
            { __typename?: "Tweet" } & Pick<
              Tweet,
              "id" | "text" | "likeCount" | "likedByMe" | "updatedAt"
            >
          >;
          lineCorrections: Array<
            { __typename?: "Tweet" } & Pick<
              Tweet,
              | "id"
              | "text"
              | "correction"
              | "likeCount"
              | "likedByMe"
              | "inReplyTo"
              | "updatedAt"
            >
          >;
        }
    >;
  };

export type FetchViewerQueryVariables = {};

export type FetchViewerQuery = { __typename?: "Query" } & {
  viewer: { __typename?: "User" } & Pick<User, "id" | "username" | "email"> & {
      timezone: { __typename?: "Timezone" } & Pick<Timezone, "id" | "offset">;
      fluentLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      learningLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      posts: Array<
        { __typename?: "Post" } & Pick<Post, "id" | "title" | "updatedAt"> & {
            language: { __typename?: "Language" } & Pick<
              Language,
              "id" | "name"
            >;
            user: { __typename?: "User" } & Pick<User, "username">;
          }
      >;
    };
};

export type FetchUserByUsernameQueryVariables = {
  username: Scalars["String"];
};

export type FetchUserByUsernameQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & Pick<User, "id" | "username" | "email"> & {
      fluentLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      learningLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      posts: Array<{ __typename?: "Post" } & PostFieldFragment>;
    };
};

export type FetchPostByIdQueryVariables = {
  id: Scalars["ID"];
};

export type FetchPostByIdQuery = { __typename?: "Query" } & {
  post: { __typename?: "Post" } & PostFieldFragment;
};

export type FetchFeedForUserQueryVariables = {
  offset?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type FetchFeedForUserQuery = { __typename?: "Query" } & {
  feed: Array<{ __typename?: "Post" } & PostFieldFragment>;
};

export type FetchSearchResultQueryVariables = {
  query: SearchInput;
};

export type FetchSearchResultQuery = { __typename?: "Query" } & {
  search: Array<{ __typename?: "Post" } & PostFieldFragment>;
};

export type FetchLanguagesQueryVariables = {
  relatedOnly?: Maybe<Scalars["Boolean"]>;
};

export type FetchLanguagesQuery = { __typename?: "Query" } & {
  langs: Array<{ __typename?: "Language" } & Pick<Language, "id" | "name">>;
};

export type FetchTimezonesQueryVariables = {};

export type FetchTimezonesQuery = { __typename?: "Query" } & {
  timezones: Array<
    { __typename?: "Timezone" } & Pick<Timezone, "id" | "offset">
  >;
};

export type FetchTweetsForLineQueryVariables = {
  id: Scalars["ID"];
};

export type FetchTweetsForLineQuery = { __typename?: "Query" } & {
  replies: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
};

export type PostCreateMutationVariables = {
  post: PostInput;
};

export type PostCreateMutation = { __typename?: "Mutation" } & {
  postCreate: { __typename?: "Post" } & Pick<Post, "id">;
};

export type PostUpdateMutationVariables = {
  id: Scalars["ID"];
  post: PostInput;
};

export type PostUpdateMutation = { __typename?: "Mutation" } & {
  postUpdate: { __typename?: "Post" } & PostFieldFragment;
};

export type PostDeleteMutationVariables = {
  id: Scalars["String"];
};

export type PostDeleteMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "postDelete"
>;

export type PostLikeMutationVariables = {
  id: Scalars["ID"];
};

export type PostLikeMutation = { __typename?: "Mutation" } & {
  postLike: { __typename?: "Post" } & Pick<
    Post,
    "id" | "likedByMe" | "likeCount"
  >;
};

export type UserUpdateMutationVariables = {
  user: UserInput;
};

export type UserUpdateMutation = { __typename?: "Mutation" } & {
  userUpdate: { __typename?: "User" } & Pick<
    User,
    "id" | "email" | "username"
  > & {
      fluentLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      learningLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
    };
};

export type UserUpdateSettingMutationVariables = {
  user: UserSettingInput;
};

export type UserUpdateSettingMutation = { __typename?: "Mutation" } & {
  userUpdateSetting: { __typename?: "User" } & Pick<User, "id"> & {
      fluentLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      learningLanguages: Array<
        { __typename?: "Language" } & Pick<Language, "id" | "name">
      >;
      timezone: { __typename?: "Timezone" } & Pick<Timezone, "id" | "offset">;
    };
};

export type TweetCreateMutationVariables = {
  tweet: TweetInput;
};

export type TweetCreateMutation = { __typename?: "Mutation" } & {
  tweetCreate: { __typename?: "Tweet" } & TweetFieldFragment;
};

export type TweetDeleteMutationVariables = {
  id: Scalars["String"];
};

export type TweetDeleteMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "tweetDelete"
>;

export type TweetLikeMutationVariables = {
  id: Scalars["ID"];
};

export type TweetLikeMutation = { __typename?: "Mutation" } & {
  tweetLike: { __typename?: "Tweet" } & Pick<
    Tweet,
    "id" | "likedByMe" | "likeCount"
  >;
};

export type CorrectionGroupCreateMutationVariables = {
  corrections: Array<TweetInput>;
  summaryComment: TweetInput;
};

export type CorrectionGroupCreateMutation = { __typename?: "Mutation" } & {
  correctionGroupCreate: { __typename?: "CorrectionGroup" } & Pick<
    CorrectionGroup,
    "id" | "updatedAt" | "createdAt"
  > & {
      lineCorrections: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
      summaryComment?: Maybe<{ __typename?: "Tweet" } & TweetFieldFragment>;
    };
};

export type LogoutMutationVariables = {};

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type SetLoadingMutationVariables = {
  loading: Scalars["Boolean"];
};

export type SetLoadingMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "setLoading"
>;

export type SetErrorMessageMutationVariables = {
  errorMessage?: Maybe<Scalars["String"]>;
};

export type SetErrorMessageMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "setErrorMessage"
>;

export type GetLoadingQueryVariables = {};

export type GetLoadingQuery = { __typename?: "Query" } & Pick<Query, "loading">;

export type GetErrorMessageQueryVariables = {};

export type GetErrorMessageQuery = { __typename?: "Query" } & Pick<
  Query,
  "errorMessage"
>;

export const TweetFieldFragmentDoc = gql`
  fragment tweetField on Tweet {
    id
    text
    correction
    updatedAt
    likeCount
    likedByMe
    inReplyTo
    postedBy {
      id
      username
    }
  }
`;
export const LineFieldFragmentDoc = gql`
  fragment lineField on Line {
    id
    partialLines {
      text
    }
    replies {
      ...tweetField
    }
  }
  ${TweetFieldFragmentDoc}
`;
export const PostFieldFragmentDoc = gql`
  fragment postField on Post {
    id
    title
    json
    lines {
      id
      partialLines {
        text
      }
      replies {
        ...tweetField
      }
    }
    language {
      id
      name
    }
    user {
      username
    }
    replies {
      ...tweetField
    }
    corrections {
      id
      postedBy {
        id
        username
      }
      summaryComment {
        id
        text
        likeCount
        likedByMe
        updatedAt
      }
      lineCorrections {
        id
        text
        correction
        likeCount
        likedByMe
        inReplyTo
        updatedAt
      }
      updatedAt
    }
    isDraft
    updatedAt
    likedByMe
    likeCount
  }
  ${TweetFieldFragmentDoc}
`;
export const FetchViewerDocument = gql`
  query fetchViewer {
    viewer {
      id
      username
      email
      timezone {
        id
        offset
      }
      fluentLanguages {
        id
        name
      }
      learningLanguages {
        id
        name
      }
      posts {
        id
        title
        language {
          id
          name
        }
        user {
          username
        }
        updatedAt
      }
    }
  }
`;

/**
 * __useFetchViewerQuery__
 *
 * To run a query within a React component, call `useFetchViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchViewerQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchViewerQuery,
    FetchViewerQueryVariables
  >
) {
  return ApolloReact.useQuery<FetchViewerQuery, FetchViewerQueryVariables>(
    FetchViewerDocument,
    baseOptions
  );
}
export function useFetchViewerLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchViewerQuery,
    FetchViewerQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<FetchViewerQuery, FetchViewerQueryVariables>(
    FetchViewerDocument,
    baseOptions
  );
}
export type FetchViewerQueryHookResult = ReturnType<typeof useFetchViewerQuery>;
export type FetchViewerLazyQueryHookResult = ReturnType<
  typeof useFetchViewerLazyQuery
>;
export type FetchViewerQueryResult = ApolloReact.QueryResult<
  FetchViewerQuery,
  FetchViewerQueryVariables
>;
export const FetchUserByUsernameDocument = gql`
  query fetchUserByUsername($username: String!) {
    user(username: $username) {
      id
      username
      email
      fluentLanguages {
        id
        name
      }
      learningLanguages {
        id
        name
      }
      posts {
        ...postField
      }
    }
  }
  ${PostFieldFragmentDoc}
`;

/**
 * __useFetchUserByUsernameQuery__
 *
 * To run a query within a React component, call `useFetchUserByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchUserByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchUserByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFetchUserByUsernameQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >(FetchUserByUsernameDocument, baseOptions);
}
export function useFetchUserByUsernameLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >(FetchUserByUsernameDocument, baseOptions);
}
export type FetchUserByUsernameQueryHookResult = ReturnType<
  typeof useFetchUserByUsernameQuery
>;
export type FetchUserByUsernameLazyQueryHookResult = ReturnType<
  typeof useFetchUserByUsernameLazyQuery
>;
export type FetchUserByUsernameQueryResult = ApolloReact.QueryResult<
  FetchUserByUsernameQuery,
  FetchUserByUsernameQueryVariables
>;
export const FetchPostByIdDocument = gql`
  query fetchPostById($id: ID!) {
    post(id: $id) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;

/**
 * __useFetchPostByIdQuery__
 *
 * To run a query within a React component, call `useFetchPostByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPostByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPostByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchPostByIdQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >
) {
  return ApolloReact.useQuery<FetchPostByIdQuery, FetchPostByIdQueryVariables>(
    FetchPostByIdDocument,
    baseOptions
  );
}
export function useFetchPostByIdLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >(FetchPostByIdDocument, baseOptions);
}
export type FetchPostByIdQueryHookResult = ReturnType<
  typeof useFetchPostByIdQuery
>;
export type FetchPostByIdLazyQueryHookResult = ReturnType<
  typeof useFetchPostByIdLazyQuery
>;
export type FetchPostByIdQueryResult = ApolloReact.QueryResult<
  FetchPostByIdQuery,
  FetchPostByIdQueryVariables
>;
export const FetchFeedForUserDocument = gql`
  query fetchFeedForUser($offset: Int, $limit: Int) {
    feed(offset: $offset, limit: $limit) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;

/**
 * __useFetchFeedForUserQuery__
 *
 * To run a query within a React component, call `useFetchFeedForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchFeedForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchFeedForUserQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useFetchFeedForUserQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >(FetchFeedForUserDocument, baseOptions);
}
export function useFetchFeedForUserLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >(FetchFeedForUserDocument, baseOptions);
}
export type FetchFeedForUserQueryHookResult = ReturnType<
  typeof useFetchFeedForUserQuery
>;
export type FetchFeedForUserLazyQueryHookResult = ReturnType<
  typeof useFetchFeedForUserLazyQuery
>;
export type FetchFeedForUserQueryResult = ApolloReact.QueryResult<
  FetchFeedForUserQuery,
  FetchFeedForUserQueryVariables
>;
export const FetchSearchResultDocument = gql`
  query fetchSearchResult($query: SearchInput!) {
    search(query: $query) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;

/**
 * __useFetchSearchResultQuery__
 *
 * To run a query within a React component, call `useFetchSearchResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchSearchResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchSearchResultQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useFetchSearchResultQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >(FetchSearchResultDocument, baseOptions);
}
export function useFetchSearchResultLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >(FetchSearchResultDocument, baseOptions);
}
export type FetchSearchResultQueryHookResult = ReturnType<
  typeof useFetchSearchResultQuery
>;
export type FetchSearchResultLazyQueryHookResult = ReturnType<
  typeof useFetchSearchResultLazyQuery
>;
export type FetchSearchResultQueryResult = ApolloReact.QueryResult<
  FetchSearchResultQuery,
  FetchSearchResultQueryVariables
>;
export const FetchLanguagesDocument = gql`
  query fetchLanguages($relatedOnly: Boolean = true) {
    langs(relatedOnly: $relatedOnly) {
      id
      name
    }
  }
`;

/**
 * __useFetchLanguagesQuery__
 *
 * To run a query within a React component, call `useFetchLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLanguagesQuery({
 *   variables: {
 *      relatedOnly: // value for 'relatedOnly'
 *   },
 * });
 */
export function useFetchLanguagesQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >(FetchLanguagesDocument, baseOptions);
}
export function useFetchLanguagesLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >(FetchLanguagesDocument, baseOptions);
}
export type FetchLanguagesQueryHookResult = ReturnType<
  typeof useFetchLanguagesQuery
>;
export type FetchLanguagesLazyQueryHookResult = ReturnType<
  typeof useFetchLanguagesLazyQuery
>;
export type FetchLanguagesQueryResult = ApolloReact.QueryResult<
  FetchLanguagesQuery,
  FetchLanguagesQueryVariables
>;
export const FetchTimezonesDocument = gql`
  query fetchTimezones {
    timezones {
      id
      offset
    }
  }
`;

/**
 * __useFetchTimezonesQuery__
 *
 * To run a query within a React component, call `useFetchTimezonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchTimezonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchTimezonesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchTimezonesQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >(FetchTimezonesDocument, baseOptions);
}
export function useFetchTimezonesLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >(FetchTimezonesDocument, baseOptions);
}
export type FetchTimezonesQueryHookResult = ReturnType<
  typeof useFetchTimezonesQuery
>;
export type FetchTimezonesLazyQueryHookResult = ReturnType<
  typeof useFetchTimezonesLazyQuery
>;
export type FetchTimezonesQueryResult = ApolloReact.QueryResult<
  FetchTimezonesQuery,
  FetchTimezonesQueryVariables
>;
export const FetchTweetsForLineDocument = gql`
  query fetchTweetsForLine($id: ID!) {
    replies(id: $id) {
      ...tweetField
    }
  }
  ${TweetFieldFragmentDoc}
`;

/**
 * __useFetchTweetsForLineQuery__
 *
 * To run a query within a React component, call `useFetchTweetsForLineQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchTweetsForLineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchTweetsForLineQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchTweetsForLineQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >
) {
  return ApolloReact.useQuery<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >(FetchTweetsForLineDocument, baseOptions);
}
export function useFetchTweetsForLineLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >(FetchTweetsForLineDocument, baseOptions);
}
export type FetchTweetsForLineQueryHookResult = ReturnType<
  typeof useFetchTweetsForLineQuery
>;
export type FetchTweetsForLineLazyQueryHookResult = ReturnType<
  typeof useFetchTweetsForLineLazyQuery
>;
export type FetchTweetsForLineQueryResult = ApolloReact.QueryResult<
  FetchTweetsForLineQuery,
  FetchTweetsForLineQueryVariables
>;
export const PostCreateDocument = gql`
  mutation postCreate($post: PostInput!) {
    postCreate(post: $post) {
      id
    }
  }
`;
export type PostCreateMutationFn = ApolloReact.MutationFunction<
  PostCreateMutation,
  PostCreateMutationVariables
>;

/**
 * __usePostCreateMutation__
 *
 * To run a mutation, you first call `usePostCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postCreateMutation, { data, loading, error }] = usePostCreateMutation({
 *   variables: {
 *      post: // value for 'post'
 *   },
 * });
 */
export function usePostCreateMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    PostCreateMutation,
    PostCreateMutationVariables
  >
) {
  return ApolloReact.useMutation<
    PostCreateMutation,
    PostCreateMutationVariables
  >(PostCreateDocument, baseOptions);
}
export type PostCreateMutationHookResult = ReturnType<
  typeof usePostCreateMutation
>;
export type PostCreateMutationResult = ApolloReact.MutationResult<
  PostCreateMutation
>;
export type PostCreateMutationOptions = ApolloReact.BaseMutationOptions<
  PostCreateMutation,
  PostCreateMutationVariables
>;
export const PostUpdateDocument = gql`
  mutation postUpdate($id: ID!, $post: PostInput!) {
    postUpdate(id: $id, post: $post) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;
export type PostUpdateMutationFn = ApolloReact.MutationFunction<
  PostUpdateMutation,
  PostUpdateMutationVariables
>;

/**
 * __usePostUpdateMutation__
 *
 * To run a mutation, you first call `usePostUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postUpdateMutation, { data, loading, error }] = usePostUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      post: // value for 'post'
 *   },
 * });
 */
export function usePostUpdateMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >
) {
  return ApolloReact.useMutation<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >(PostUpdateDocument, baseOptions);
}
export type PostUpdateMutationHookResult = ReturnType<
  typeof usePostUpdateMutation
>;
export type PostUpdateMutationResult = ApolloReact.MutationResult<
  PostUpdateMutation
>;
export type PostUpdateMutationOptions = ApolloReact.BaseMutationOptions<
  PostUpdateMutation,
  PostUpdateMutationVariables
>;
export const PostDeleteDocument = gql`
  mutation postDelete($id: String!) {
    postDelete(id: $id)
  }
`;
export type PostDeleteMutationFn = ApolloReact.MutationFunction<
  PostDeleteMutation,
  PostDeleteMutationVariables
>;

/**
 * __usePostDeleteMutation__
 *
 * To run a mutation, you first call `usePostDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postDeleteMutation, { data, loading, error }] = usePostDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostDeleteMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    PostDeleteMutation,
    PostDeleteMutationVariables
  >
) {
  return ApolloReact.useMutation<
    PostDeleteMutation,
    PostDeleteMutationVariables
  >(PostDeleteDocument, baseOptions);
}
export type PostDeleteMutationHookResult = ReturnType<
  typeof usePostDeleteMutation
>;
export type PostDeleteMutationResult = ApolloReact.MutationResult<
  PostDeleteMutation
>;
export type PostDeleteMutationOptions = ApolloReact.BaseMutationOptions<
  PostDeleteMutation,
  PostDeleteMutationVariables
>;
export const PostLikeDocument = gql`
  mutation postLike($id: ID!) {
    postLike(id: $id) {
      id
      likedByMe
      likeCount
    }
  }
`;
export type PostLikeMutationFn = ApolloReact.MutationFunction<
  PostLikeMutation,
  PostLikeMutationVariables
>;

/**
 * __usePostLikeMutation__
 *
 * To run a mutation, you first call `usePostLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postLikeMutation, { data, loading, error }] = usePostLikeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostLikeMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    PostLikeMutation,
    PostLikeMutationVariables
  >
) {
  return ApolloReact.useMutation<PostLikeMutation, PostLikeMutationVariables>(
    PostLikeDocument,
    baseOptions
  );
}
export type PostLikeMutationHookResult = ReturnType<typeof usePostLikeMutation>;
export type PostLikeMutationResult = ApolloReact.MutationResult<
  PostLikeMutation
>;
export type PostLikeMutationOptions = ApolloReact.BaseMutationOptions<
  PostLikeMutation,
  PostLikeMutationVariables
>;
export const UserUpdateDocument = gql`
  mutation userUpdate($user: UserInput!) {
    userUpdate(user: $user) {
      id
      email
      username
      fluentLanguages {
        id
        name
      }
      learningLanguages {
        id
        name
      }
    }
  }
`;
export type UserUpdateMutationFn = ApolloReact.MutationFunction<
  UserUpdateMutation,
  UserUpdateMutationVariables
>;

/**
 * __useUserUpdateMutation__
 *
 * To run a mutation, you first call `useUserUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateMutation, { data, loading, error }] = useUserUpdateMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUserUpdateMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    UserUpdateMutation,
    UserUpdateMutationVariables
  >
) {
  return ApolloReact.useMutation<
    UserUpdateMutation,
    UserUpdateMutationVariables
  >(UserUpdateDocument, baseOptions);
}
export type UserUpdateMutationHookResult = ReturnType<
  typeof useUserUpdateMutation
>;
export type UserUpdateMutationResult = ApolloReact.MutationResult<
  UserUpdateMutation
>;
export type UserUpdateMutationOptions = ApolloReact.BaseMutationOptions<
  UserUpdateMutation,
  UserUpdateMutationVariables
>;
export const UserUpdateSettingDocument = gql`
  mutation userUpdateSetting($user: UserSettingInput!) {
    userUpdateSetting(user: $user) {
      id
      fluentLanguages {
        id
        name
      }
      learningLanguages {
        id
        name
      }
      timezone {
        id
        offset
      }
    }
  }
`;
export type UserUpdateSettingMutationFn = ApolloReact.MutationFunction<
  UserUpdateSettingMutation,
  UserUpdateSettingMutationVariables
>;

/**
 * __useUserUpdateSettingMutation__
 *
 * To run a mutation, you first call `useUserUpdateSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateSettingMutation, { data, loading, error }] = useUserUpdateSettingMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUserUpdateSettingMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    UserUpdateSettingMutation,
    UserUpdateSettingMutationVariables
  >
) {
  return ApolloReact.useMutation<
    UserUpdateSettingMutation,
    UserUpdateSettingMutationVariables
  >(UserUpdateSettingDocument, baseOptions);
}
export type UserUpdateSettingMutationHookResult = ReturnType<
  typeof useUserUpdateSettingMutation
>;
export type UserUpdateSettingMutationResult = ApolloReact.MutationResult<
  UserUpdateSettingMutation
>;
export type UserUpdateSettingMutationOptions = ApolloReact.BaseMutationOptions<
  UserUpdateSettingMutation,
  UserUpdateSettingMutationVariables
>;
export const TweetCreateDocument = gql`
  mutation tweetCreate($tweet: TweetInput!) {
    tweetCreate(tweet: $tweet) {
      ...tweetField
    }
  }
  ${TweetFieldFragmentDoc}
`;
export type TweetCreateMutationFn = ApolloReact.MutationFunction<
  TweetCreateMutation,
  TweetCreateMutationVariables
>;

/**
 * __useTweetCreateMutation__
 *
 * To run a mutation, you first call `useTweetCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTweetCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tweetCreateMutation, { data, loading, error }] = useTweetCreateMutation({
 *   variables: {
 *      tweet: // value for 'tweet'
 *   },
 * });
 */
export function useTweetCreateMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    TweetCreateMutation,
    TweetCreateMutationVariables
  >
) {
  return ApolloReact.useMutation<
    TweetCreateMutation,
    TweetCreateMutationVariables
  >(TweetCreateDocument, baseOptions);
}
export type TweetCreateMutationHookResult = ReturnType<
  typeof useTweetCreateMutation
>;
export type TweetCreateMutationResult = ApolloReact.MutationResult<
  TweetCreateMutation
>;
export type TweetCreateMutationOptions = ApolloReact.BaseMutationOptions<
  TweetCreateMutation,
  TweetCreateMutationVariables
>;
export const TweetDeleteDocument = gql`
  mutation tweetDelete($id: String!) {
    tweetDelete(id: $id)
  }
`;
export type TweetDeleteMutationFn = ApolloReact.MutationFunction<
  TweetDeleteMutation,
  TweetDeleteMutationVariables
>;

/**
 * __useTweetDeleteMutation__
 *
 * To run a mutation, you first call `useTweetDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTweetDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tweetDeleteMutation, { data, loading, error }] = useTweetDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTweetDeleteMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    TweetDeleteMutation,
    TweetDeleteMutationVariables
  >
) {
  return ApolloReact.useMutation<
    TweetDeleteMutation,
    TweetDeleteMutationVariables
  >(TweetDeleteDocument, baseOptions);
}
export type TweetDeleteMutationHookResult = ReturnType<
  typeof useTweetDeleteMutation
>;
export type TweetDeleteMutationResult = ApolloReact.MutationResult<
  TweetDeleteMutation
>;
export type TweetDeleteMutationOptions = ApolloReact.BaseMutationOptions<
  TweetDeleteMutation,
  TweetDeleteMutationVariables
>;
export const TweetLikeDocument = gql`
  mutation tweetLike($id: ID!) {
    tweetLike(id: $id) {
      id
      likedByMe
      likeCount
    }
  }
`;
export type TweetLikeMutationFn = ApolloReact.MutationFunction<
  TweetLikeMutation,
  TweetLikeMutationVariables
>;

/**
 * __useTweetLikeMutation__
 *
 * To run a mutation, you first call `useTweetLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTweetLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tweetLikeMutation, { data, loading, error }] = useTweetLikeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTweetLikeMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    TweetLikeMutation,
    TweetLikeMutationVariables
  >
) {
  return ApolloReact.useMutation<TweetLikeMutation, TweetLikeMutationVariables>(
    TweetLikeDocument,
    baseOptions
  );
}
export type TweetLikeMutationHookResult = ReturnType<
  typeof useTweetLikeMutation
>;
export type TweetLikeMutationResult = ApolloReact.MutationResult<
  TweetLikeMutation
>;
export type TweetLikeMutationOptions = ApolloReact.BaseMutationOptions<
  TweetLikeMutation,
  TweetLikeMutationVariables
>;
export const CorrectionGroupCreateDocument = gql`
  mutation correctionGroupCreate(
    $corrections: [TweetInput!]!
    $summaryComment: TweetInput!
  ) {
    correctionGroupCreate(
      corrections: $corrections
      summaryComment: $summaryComment
    ) {
      id
      lineCorrections {
        ...tweetField
      }
      summaryComment {
        ...tweetField
      }
      updatedAt
      createdAt
    }
  }
  ${TweetFieldFragmentDoc}
`;
export type CorrectionGroupCreateMutationFn = ApolloReact.MutationFunction<
  CorrectionGroupCreateMutation,
  CorrectionGroupCreateMutationVariables
>;

/**
 * __useCorrectionGroupCreateMutation__
 *
 * To run a mutation, you first call `useCorrectionGroupCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCorrectionGroupCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [correctionGroupCreateMutation, { data, loading, error }] = useCorrectionGroupCreateMutation({
 *   variables: {
 *      corrections: // value for 'corrections'
 *      summaryComment: // value for 'summaryComment'
 *   },
 * });
 */
export function useCorrectionGroupCreateMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    CorrectionGroupCreateMutation,
    CorrectionGroupCreateMutationVariables
  >
) {
  return ApolloReact.useMutation<
    CorrectionGroupCreateMutation,
    CorrectionGroupCreateMutationVariables
  >(CorrectionGroupCreateDocument, baseOptions);
}
export type CorrectionGroupCreateMutationHookResult = ReturnType<
  typeof useCorrectionGroupCreateMutation
>;
export type CorrectionGroupCreateMutationResult = ApolloReact.MutationResult<
  CorrectionGroupCreateMutation
>;
export type CorrectionGroupCreateMutationOptions = ApolloReact.BaseMutationOptions<
  CorrectionGroupCreateMutation,
  CorrectionGroupCreateMutationVariables
>;
export const LogoutDocument = gql`
  mutation logout {
    logout
  }
`;
export type LogoutMutationFn = ApolloReact.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return ApolloReact.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReact.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReact.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const SetLoadingDocument = gql`
  mutation setLoading($loading: Boolean!) {
    setLoading(loading: $loading) @client
  }
`;
export type SetLoadingMutationFn = ApolloReact.MutationFunction<
  SetLoadingMutation,
  SetLoadingMutationVariables
>;

/**
 * __useSetLoadingMutation__
 *
 * To run a mutation, you first call `useSetLoadingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLoadingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLoadingMutation, { data, loading, error }] = useSetLoadingMutation({
 *   variables: {
 *      loading: // value for 'loading'
 *   },
 * });
 */
export function useSetLoadingMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    SetLoadingMutation,
    SetLoadingMutationVariables
  >
) {
  return ApolloReact.useMutation<
    SetLoadingMutation,
    SetLoadingMutationVariables
  >(SetLoadingDocument, baseOptions);
}
export type SetLoadingMutationHookResult = ReturnType<
  typeof useSetLoadingMutation
>;
export type SetLoadingMutationResult = ApolloReact.MutationResult<
  SetLoadingMutation
>;
export type SetLoadingMutationOptions = ApolloReact.BaseMutationOptions<
  SetLoadingMutation,
  SetLoadingMutationVariables
>;
export const SetErrorMessageDocument = gql`
  mutation setErrorMessage($errorMessage: String) {
    setErrorMessage(errorMessage: $errorMessage) @client
  }
`;
export type SetErrorMessageMutationFn = ApolloReact.MutationFunction<
  SetErrorMessageMutation,
  SetErrorMessageMutationVariables
>;

/**
 * __useSetErrorMessageMutation__
 *
 * To run a mutation, you first call `useSetErrorMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetErrorMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setErrorMessageMutation, { data, loading, error }] = useSetErrorMessageMutation({
 *   variables: {
 *      errorMessage: // value for 'errorMessage'
 *   },
 * });
 */
export function useSetErrorMessageMutation(
  baseOptions?: ApolloReact.MutationHookOptions<
    SetErrorMessageMutation,
    SetErrorMessageMutationVariables
  >
) {
  return ApolloReact.useMutation<
    SetErrorMessageMutation,
    SetErrorMessageMutationVariables
  >(SetErrorMessageDocument, baseOptions);
}
export type SetErrorMessageMutationHookResult = ReturnType<
  typeof useSetErrorMessageMutation
>;
export type SetErrorMessageMutationResult = ApolloReact.MutationResult<
  SetErrorMessageMutation
>;
export type SetErrorMessageMutationOptions = ApolloReact.BaseMutationOptions<
  SetErrorMessageMutation,
  SetErrorMessageMutationVariables
>;
export const GetLoadingDocument = gql`
  query getLoading {
    loading @client(always: true)
  }
`;

/**
 * __useGetLoadingQuery__
 *
 * To run a query within a React component, call `useGetLoadingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoadingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoadingQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoadingQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    GetLoadingQuery,
    GetLoadingQueryVariables
  >
) {
  return ApolloReact.useQuery<GetLoadingQuery, GetLoadingQueryVariables>(
    GetLoadingDocument,
    baseOptions
  );
}
export function useGetLoadingLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    GetLoadingQuery,
    GetLoadingQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<GetLoadingQuery, GetLoadingQueryVariables>(
    GetLoadingDocument,
    baseOptions
  );
}
export type GetLoadingQueryHookResult = ReturnType<typeof useGetLoadingQuery>;
export type GetLoadingLazyQueryHookResult = ReturnType<
  typeof useGetLoadingLazyQuery
>;
export type GetLoadingQueryResult = ApolloReact.QueryResult<
  GetLoadingQuery,
  GetLoadingQueryVariables
>;
export const GetErrorMessageDocument = gql`
  query getErrorMessage {
    errorMessage @client(always: true)
  }
`;

/**
 * __useGetErrorMessageQuery__
 *
 * To run a query within a React component, call `useGetErrorMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetErrorMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetErrorMessageQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetErrorMessageQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >
) {
  return ApolloReact.useQuery<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >(GetErrorMessageDocument, baseOptions);
}
export function useGetErrorMessageLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >(GetErrorMessageDocument, baseOptions);
}
export type GetErrorMessageQueryHookResult = ReturnType<
  typeof useGetErrorMessageQuery
>;
export type GetErrorMessageLazyQueryHookResult = ReturnType<
  typeof useGetErrorMessageLazyQuery
>;
export type GetErrorMessageQueryResult = ApolloReact.QueryResult<
  GetErrorMessageQuery,
  GetErrorMessageQueryVariables
>;
