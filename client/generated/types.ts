import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  LanguageCode: any;
  Date: any;
};

export type AuthData = {
  __typename?: "AuthData";
  token: Scalars["String"];
};

export type CorrectionGroup = Node & {
  __typename?: "CorrectionGroup";
  id: Scalars["ID"];
  postedBy: User;
  post: Post;
  summaryComment?: Maybe<Tweet>;
  lineCorrections: Array<Tweet>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type Language = {
  __typename?: "Language";
  id: Scalars["LanguageCode"];
  name: Scalars["String"];
};

export type Line = Node & {
  __typename?: "Line";
  id: Scalars["ID"];
  partialLines: Array<PartialLine>;
  replies: Array<Tweet>;
};

export type LineInput = {
  id?: Maybe<Scalars["ID"]>;
  partialLines: Array<PartialLineInput>;
};

export type Mutation = {
  __typename?: "Mutation";
  correctionGroupCreate: CorrectionGroup;
  logout: Scalars["Boolean"];
  postCreate: Post;
  postLike: Post;
  postUpdate: Post;
  setErrorMessage: Scalars["Boolean"];
  setLoading: Scalars["Boolean"];
  signin: AuthData;
  tweetCreate: Tweet;
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
  id: Scalars["ID"];
};

export type PartialLine = {
  __typename?: "PartialLine";
  text: Scalars["String"];
};

export type PartialLineInput = {
  subtext: Scalars["String"];
  referes?: Maybe<Array<Scalars["String"]>>;
};

export type Post = Node & {
  __typename?: "Post";
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

export type PostInput = {
  language: Scalars["String"];
  lines: Array<LineInput>;
  isDraft: Scalars["Boolean"];
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

export type Repliable = Tweet | Line;

export type SearchInput = {
  language?: Maybe<Scalars["String"]>;
};

export type Timezone = Node & {
  __typename?: "Timezone";
  id: Scalars["ID"];
  offset: Scalars["String"];
};

export type Tweet = Node & {
  __typename?: "Tweet";
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

export type TweetInput = {
  inReplyTo: Scalars["ID"];
  postId: Scalars["ID"];
  text: Scalars["String"];
  correction?: Maybe<Scalars["String"]>;
};

export type User = Node & {
  __typename?: "User";
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

export type TweetFieldFragment = { __typename?: "Tweet" } & Pick<
  Tweet,
  "id" | "text" | "correction" | "updatedAt" | "likeCount" | "likedByMe"
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

export type PostUpdateMutationVariables = {
  id: Scalars["ID"];
  post: PostInput;
};

export type PostUpdateMutation = { __typename?: "Mutation" } & {
  postUpdate: { __typename?: "Post" } & PostFieldFragment;
};

export type PostCreateMutationVariables = {
  post: PostInput;
};

export type PostCreateMutation = { __typename?: "Mutation" } & {
  postCreate: { __typename?: "Post" } & Pick<Post, "id">;
};

export type PostLikeMutationVariables = {
  id: Scalars["ID"];
};

export type PostLikeMutation = { __typename?: "Mutation" } & {
  postLike: { __typename?: "Post" } & PostFieldFragment;
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
  tweetCreate: { __typename?: "Tweet" } & Pick<Tweet, "id">;
};

export type TweetLikeMutationVariables = {
  id: Scalars["ID"];
};

export type TweetLikeMutation = { __typename?: "Mutation" } & {
  tweetLike: { __typename?: "Tweet" } & TweetFieldFragment;
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchViewerQuery,
    FetchViewerQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<FetchViewerQuery, FetchViewerQueryVariables>(
    FetchViewerDocument,
    baseOptions
  );
}
export function useFetchViewerLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchViewerQuery,
    FetchViewerQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    FetchViewerQuery,
    FetchViewerQueryVariables
  >(FetchViewerDocument, baseOptions);
}
export type FetchViewerQueryHookResult = ReturnType<typeof useFetchViewerQuery>;
export type FetchViewerLazyQueryHookResult = ReturnType<
  typeof useFetchViewerLazyQuery
>;
export type FetchViewerQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >(FetchUserByUsernameDocument, baseOptions);
}
export function useFetchUserByUsernameLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchUserByUsernameQuery,
    FetchUserByUsernameQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchUserByUsernameQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >(FetchPostByIdDocument, baseOptions);
}
export function useFetchPostByIdLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchPostByIdQuery,
    FetchPostByIdQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchPostByIdQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >(FetchFeedForUserDocument, baseOptions);
}
export function useFetchFeedForUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchFeedForUserQuery,
    FetchFeedForUserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchFeedForUserQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >(FetchSearchResultDocument, baseOptions);
}
export function useFetchSearchResultLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchSearchResultQuery,
    FetchSearchResultQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchSearchResultQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >(FetchLanguagesDocument, baseOptions);
}
export function useFetchLanguagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchLanguagesQuery,
    FetchLanguagesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchLanguagesQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >(FetchTimezonesDocument, baseOptions);
}
export function useFetchTimezonesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchTimezonesQuery,
    FetchTimezonesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchTimezonesQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >(FetchTweetsForLineDocument, baseOptions);
}
export function useFetchTweetsForLineLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FetchTweetsForLineQuery,
    FetchTweetsForLineQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type FetchTweetsForLineQueryResult = ApolloReactCommon.QueryResult<
  FetchTweetsForLineQuery,
  FetchTweetsForLineQueryVariables
>;
export const PostUpdateDocument = gql`
  mutation postUpdate($id: ID!, $post: PostInput!) {
    postUpdate(id: $id, post: $post) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;
export type PostUpdateMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PostUpdateMutation,
    PostUpdateMutationVariables
  >(PostUpdateDocument, baseOptions);
}
export type PostUpdateMutationHookResult = ReturnType<
  typeof usePostUpdateMutation
>;
export type PostUpdateMutationResult = ApolloReactCommon.MutationResult<
  PostUpdateMutation
>;
export type PostUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PostUpdateMutation,
  PostUpdateMutationVariables
>;
export const PostCreateDocument = gql`
  mutation postCreate($post: PostInput!) {
    postCreate(post: $post) {
      id
    }
  }
`;
export type PostCreateMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PostCreateMutation,
    PostCreateMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PostCreateMutation,
    PostCreateMutationVariables
  >(PostCreateDocument, baseOptions);
}
export type PostCreateMutationHookResult = ReturnType<
  typeof usePostCreateMutation
>;
export type PostCreateMutationResult = ApolloReactCommon.MutationResult<
  PostCreateMutation
>;
export type PostCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PostCreateMutation,
  PostCreateMutationVariables
>;
export const PostLikeDocument = gql`
  mutation postLike($id: ID!) {
    postLike(id: $id) {
      ...postField
    }
  }
  ${PostFieldFragmentDoc}
`;
export type PostLikeMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PostLikeMutation,
    PostLikeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PostLikeMutation,
    PostLikeMutationVariables
  >(PostLikeDocument, baseOptions);
}
export type PostLikeMutationHookResult = ReturnType<typeof usePostLikeMutation>;
export type PostLikeMutationResult = ApolloReactCommon.MutationResult<
  PostLikeMutation
>;
export type PostLikeMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
export type UserUpdateMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UserUpdateMutation,
    UserUpdateMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UserUpdateMutation,
    UserUpdateMutationVariables
  >(UserUpdateDocument, baseOptions);
}
export type UserUpdateMutationHookResult = ReturnType<
  typeof useUserUpdateMutation
>;
export type UserUpdateMutationResult = ApolloReactCommon.MutationResult<
  UserUpdateMutation
>;
export type UserUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
export type UserUpdateSettingMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UserUpdateSettingMutation,
    UserUpdateSettingMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UserUpdateSettingMutation,
    UserUpdateSettingMutationVariables
  >(UserUpdateSettingDocument, baseOptions);
}
export type UserUpdateSettingMutationHookResult = ReturnType<
  typeof useUserUpdateSettingMutation
>;
export type UserUpdateSettingMutationResult = ApolloReactCommon.MutationResult<
  UserUpdateSettingMutation
>;
export type UserUpdateSettingMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UserUpdateSettingMutation,
  UserUpdateSettingMutationVariables
>;
export const TweetCreateDocument = gql`
  mutation tweetCreate($tweet: TweetInput!) {
    tweetCreate(tweet: $tweet) {
      id
    }
  }
`;
export type TweetCreateMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TweetCreateMutation,
    TweetCreateMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    TweetCreateMutation,
    TweetCreateMutationVariables
  >(TweetCreateDocument, baseOptions);
}
export type TweetCreateMutationHookResult = ReturnType<
  typeof useTweetCreateMutation
>;
export type TweetCreateMutationResult = ApolloReactCommon.MutationResult<
  TweetCreateMutation
>;
export type TweetCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  TweetCreateMutation,
  TweetCreateMutationVariables
>;
export const TweetLikeDocument = gql`
  mutation tweetLike($id: ID!) {
    tweetLike(id: $id) {
      ...tweetField
    }
  }
  ${TweetFieldFragmentDoc}
`;
export type TweetLikeMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TweetLikeMutation,
    TweetLikeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    TweetLikeMutation,
    TweetLikeMutationVariables
  >(TweetLikeDocument, baseOptions);
}
export type TweetLikeMutationHookResult = ReturnType<
  typeof useTweetLikeMutation
>;
export type TweetLikeMutationResult = ApolloReactCommon.MutationResult<
  TweetLikeMutation
>;
export type TweetLikeMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
export type CorrectionGroupCreateMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CorrectionGroupCreateMutation,
    CorrectionGroupCreateMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CorrectionGroupCreateMutation,
    CorrectionGroupCreateMutationVariables
  >(CorrectionGroupCreateDocument, baseOptions);
}
export type CorrectionGroupCreateMutationHookResult = ReturnType<
  typeof useCorrectionGroupCreateMutation
>;
export type CorrectionGroupCreateMutationResult = ApolloReactCommon.MutationResult<
  CorrectionGroupCreateMutation
>;
export type CorrectionGroupCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CorrectionGroupCreateMutation,
  CorrectionGroupCreateMutationVariables
>;
export const LogoutDocument = gql`
  mutation logout {
    logout
  }
`;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<
  LogoutMutation
>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const SetLoadingDocument = gql`
  mutation setLoading($loading: Boolean!) {
    setLoading(loading: $loading) @client
  }
`;
export type SetLoadingMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetLoadingMutation,
    SetLoadingMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SetLoadingMutation,
    SetLoadingMutationVariables
  >(SetLoadingDocument, baseOptions);
}
export type SetLoadingMutationHookResult = ReturnType<
  typeof useSetLoadingMutation
>;
export type SetLoadingMutationResult = ApolloReactCommon.MutationResult<
  SetLoadingMutation
>;
export type SetLoadingMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetLoadingMutation,
  SetLoadingMutationVariables
>;
export const SetErrorMessageDocument = gql`
  mutation setErrorMessage($errorMessage: String) {
    setErrorMessage(errorMessage: $errorMessage) @client
  }
`;
export type SetErrorMessageMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetErrorMessageMutation,
    SetErrorMessageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SetErrorMessageMutation,
    SetErrorMessageMutationVariables
  >(SetErrorMessageDocument, baseOptions);
}
export type SetErrorMessageMutationHookResult = ReturnType<
  typeof useSetErrorMessageMutation
>;
export type SetErrorMessageMutationResult = ApolloReactCommon.MutationResult<
  SetErrorMessageMutation
>;
export type SetErrorMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLoadingQuery,
    GetLoadingQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetLoadingQuery, GetLoadingQueryVariables>(
    GetLoadingDocument,
    baseOptions
  );
}
export function useGetLoadingLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLoadingQuery,
    GetLoadingQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetLoadingQuery,
    GetLoadingQueryVariables
  >(GetLoadingDocument, baseOptions);
}
export type GetLoadingQueryHookResult = ReturnType<typeof useGetLoadingQuery>;
export type GetLoadingLazyQueryHookResult = ReturnType<
  typeof useGetLoadingLazyQuery
>;
export type GetLoadingQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >(GetErrorMessageDocument, baseOptions);
}
export function useGetErrorMessageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetErrorMessageQuery,
    GetErrorMessageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type GetErrorMessageQueryResult = ApolloReactCommon.QueryResult<
  GetErrorMessageQuery,
  GetErrorMessageQueryVariables
>;
