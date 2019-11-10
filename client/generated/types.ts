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

export type Line = {
  __typename?: "Line";
  text: Scalars["String"];
  replies: Array<Tweet>;
};

export type LineInput = {
  text: Scalars["String"];
  comment?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  userCreate: User;
  userUpdate: User;
  postCreate: Post;
  postUpdate: Post;
  logout: Scalars["Boolean"];
  signin: AuthData;
};

export type MutationUserCreateArgs = {
  id: Scalars["String"];
};

export type MutationUserUpdateArgs = {
  id: Scalars["String"];
  user: UserInput;
};

export type MutationPostCreateArgs = {
  post: PostInput;
};

export type MutationPostUpdateArgs = {
  id: Scalars["Int"];
  post: PostInput;
};

export type MutationSigninArgs = {
  token: Scalars["String"];
};

export type Node = {
  /** Unique identifier for the resource */
  id: Scalars["ID"];
};

export type Post = Node & {
  __typename?: "Post";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  json: Scalars["String"];
  lines: Array<Scalars["String"]>;
  user: User;
  language: Language;
  isDraft: Scalars["Boolean"];
};

export type PostInput = {
  language: Scalars["Int"];
  content: Scalars["String"];
  isDraft: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  feed: Array<Post>;
  posts: Array<Post>;
  post: Post;
  tweet: Tweet;
  langs: Array<Language>;
  viewer: User;
};

export type QueryFeedArgs = {
  uid: Scalars["String"];
};

export type QueryPostArgs = {
  id: Scalars["Int"];
};

export type QueryTweetArgs = {
  id: Scalars["Int"];
};

/** Anything that can be replied */
export type Repliable = Tweet | Line;

export type Tweet = Node & {
  __typename?: "Tweet";
  /** Unique identifier for the resource */
  id: Scalars["ID"];
  text: Scalars["String"];
  inReplyTo?: Maybe<Scalars["Int"]>;
  userId: Scalars["Int"];
  replies: Array<Tweet>;
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

export type PostFieldFragmentFragment = { __typename?: "Post" } & Pick<
  Post,
  "id" | "json" | "lines" | "isDraft"
> & {
    language: { __typename?: "Language" } & Pick<Language, "id" | "name">;
    user: { __typename?: "User" } & Pick<User, "username">;
  };

export type FetchViewerQueryVariables = {};

export type FetchViewerQuery = { __typename?: "Query" } & {
  viewer: { __typename?: "User" } & Pick<
    User,
    "id" | "username" | "email" | "fluentLanguages" | "learningLanguages"
  > & { posts: Array<{ __typename?: "Post" } & PostFieldFragmentFragment> };
};

export type FetchPostByIdQueryVariables = {
  id: Scalars["Int"];
};

export type FetchPostByIdQuery = { __typename?: "Query" } & {
  post: { __typename?: "Post" } & PostFieldFragmentFragment;
};

export type FetchFeedForUserQueryVariables = {
  uid: Scalars["String"];
};

export type FetchFeedForUserQuery = { __typename?: "Query" } & {
  feed: Array<{ __typename?: "Post" } & PostFieldFragmentFragment>;
};

export type FetchLanguagesQueryVariables = {};

export type FetchLanguagesQuery = { __typename?: "Query" } & {
  langs: Array<{ __typename?: "Language" } & Pick<Language, "id" | "name">>;
};

export type PostUpdateMutationVariables = {
  id: Scalars["Int"];
  post: PostInput;
};

export type PostUpdateMutation = { __typename?: "Mutation" } & {
  postUpdate: { __typename?: "Post" } & Pick<Post, "id">;
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
