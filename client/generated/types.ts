export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthData = {
  __typename?: "AuthData";
  token: Scalars["String"];
};

export type Language = Node & {
  __typename?: "Language";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Line = Node & {
  __typename?: "Line";
  /** Unique identifier for the resource */
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
  userCreate: User;
  userUpdate: User;
  postCreate: Post;
  postUpdate: Post;
  tweetCreate: Tweet;
  logout: Scalars["Boolean"];
  signin: AuthData;
};

export type MutationUserCreateArgs = {
  id: Scalars["ID"];
};

export type MutationUserUpdateArgs = {
  id: Scalars["String"];
  user: UserInput;
};

export type MutationPostCreateArgs = {
  post: PostInput;
};

export type MutationPostUpdateArgs = {
  id: Scalars["ID"];
  post: PostInput;
};

export type MutationTweetCreateArgs = {
  tweet: TweetInput;
};

export type MutationSigninArgs = {
  token: Scalars["String"];
};

export type Node = {
  /** Unique identifier for the resource */
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
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  json: Scalars["String"];
  title: Scalars["String"];
  lines: Array<Line>;
  user: User;
  language: Language;
  isDraft: Scalars["Boolean"];
  replies: Array<Tweet>;
};

export type PostInput = {
  language: Scalars["Int"];
  lines: Array<LineInput>;
  isDraft: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  search: Array<Post>;
  feed: Array<Post>;
  posts: Array<Post>;
  post: Post;
  tweet: Tweet;
  replies: Array<Tweet>;
  langs: Array<Language>;
  viewer: User;
};

export type QuerySearchArgs = {
  query: SearchInput;
};

export type QueryFeedArgs = {
  uid: Scalars["String"];
};

export type QueryPostArgs = {
  id: Scalars["ID"];
};

export type QueryTweetArgs = {
  id: Scalars["ID"];
};

export type QueryRepliesArgs = {
  id: Scalars["ID"];
};

/** Anything that can be replied */
export type Repliable = Tweet | Line;

export type SearchInput = {
  language?: Maybe<Scalars["Int"]>;
};

export type Tweet = Node & {
  __typename?: "Tweet";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  text: Scalars["String"];
  inReplyTo?: Maybe<Scalars["Int"]>;
  postedBy: User;
  post: Post;
  replies: Array<Tweet>;
};

export type TweetInput = {
  inReplyTo: Scalars["ID"];
  postId: Scalars["ID"];
  text: Scalars["String"];
};

export type User = Node & {
  __typename?: "User";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  username: Scalars["String"];
  email: Scalars["String"];
  fluentLanguages: Array<Scalars["Int"]>;
  learningLanguages: Array<Scalars["Int"]>;
  posts: Array<Post>;
};

export type UserInput = {
  username: Scalars["String"];
  email: Scalars["String"];
  fluentLanguages: Array<Scalars["Int"]>;
  learningLanguages: Array<Scalars["Int"]>;
};

export type TweetFieldFragment = { __typename?: "Tweet" } & Pick<
  Tweet,
  "id" | "text"
>;

export type LineFieldFragment = { __typename?: "Line" } & Pick<Line, "id"> & {
    partialLines: Array<
      { __typename?: "PartialLine" } & Pick<PartialLine, "text">
    >;
    replies: Array<{ __typename?: "Tweet" } & TweetFieldFragment>;
  };

export type PostFieldFragment = { __typename?: "Post" } & Pick<
  Post,
  "id" | "title" | "json" | "isDraft"
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
  };

export type FetchViewerQueryVariables = {};

export type FetchViewerQuery = { __typename?: "Query" } & {
  viewer: { __typename?: "User" } & Pick<
    User,
    "id" | "username" | "email" | "fluentLanguages" | "learningLanguages"
  > & {
      posts: Array<
        { __typename?: "Post" } & Pick<Post, "id" | "title"> & {
            language: { __typename?: "Language" } & Pick<
              Language,
              "id" | "name"
            >;
            user: { __typename?: "User" } & Pick<User, "username">;
          }
      >;
    };
};

export type FetchPostByIdQueryVariables = {
  id: Scalars["ID"];
};

export type FetchPostByIdQuery = { __typename?: "Query" } & {
  post: { __typename?: "Post" } & PostFieldFragment;
};

export type FetchFeedForUserQueryVariables = {
  uid: Scalars["String"];
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

export type FetchLanguagesQueryVariables = {};

export type FetchLanguagesQuery = { __typename?: "Query" } & {
  langs: Array<{ __typename?: "Language" } & Pick<Language, "id" | "name">>;
};

export type FetchTweetsForLineQueryVariables = {
  id: Scalars["ID"];
};

export type FetchTweetsForLineQuery = { __typename?: "Query" } & {
  replies: Array<{ __typename?: "Tweet" } & Pick<Tweet, "id" | "text">>;
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

export type UserUpdateMutationVariables = {
  id: Scalars["String"];
  user: UserInput;
};

export type UserUpdateMutation = { __typename?: "Mutation" } & {
  userUpdate: { __typename?: "User" } & Pick<
    User,
    "id" | "email" | "username" | "fluentLanguages" | "learningLanguages"
  >;
};

export type TweetCreateMutationVariables = {
  tweet: TweetInput;
};

export type TweetCreateMutation = { __typename?: "Mutation" } & {
  tweetCreate: { __typename?: "Tweet" } & Pick<Tweet, "id">;
};
