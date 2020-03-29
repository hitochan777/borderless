import gql from "graphql-tag";

export const TWEET_FIELD_FRAGMENT = gql`
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

export const LINE_FIELD_FRAGMENT = gql`
  fragment lineField on Line {
    id
    partialLines {
      text
    }
    replies {
      ...tweetField
    }
  }
  ${TWEET_FIELD_FRAGMENT}
`;

export const POST_FIELD_FRAGMENT = gql`
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
  ${TWEET_FIELD_FRAGMENT}
`;

export const FETCH_VIEWER_QUERY = gql`
  query fetchViewer {
    viewer {
      id
      username
      email
      timezone
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

export const FETCH_USER_BY_USERNAME_QUERY = gql`
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
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_POST_BY_ID_QUERY = gql`
  query fetchPostById($id: ID!) {
    post(id: $id) {
      ...postField
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_FEED_FOR_USER_QUERY = gql`
  query fetchFeedForUser($offset: Int, $limit: Int) {
    feed(offset: $offset, limit: $limit) {
      ...postField
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_SEARCH_RESULT_QUERY = gql`
  query fetchSearchResult($query: SearchInput!) {
    search(query: $query) {
      ...postField
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_LANGUAGES_QUERY = gql`
  query fetchLanguages($relatedOnly: Boolean = true) {
    langs(relatedOnly: $relatedOnly) {
      id
      name
    }
  }
`;

export const FETCH_TWEETS_FOR_LINE_QUERY = gql`
  query fetchTweetsForLine($id: ID!) {
    replies(id: $id) {
      ...tweetField
    }
  }
  ${TWEET_FIELD_FRAGMENT}
`;

export const POST_UPDATE_MUTATION = gql`
  mutation postUpdate($id: ID!, $post: PostInput!) {
    postUpdate(id: $id, post: $post) {
      ...postField
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const POST_CREATE_MUTATION = gql`
  mutation postCreate($post: PostInput!) {
    postCreate(post: $post) {
      id
    }
  }
`;

export const POST_LIKE_MUTATION = gql`
  mutation postLike($id: ID!) {
    postLike(id: $id) {
      ...postField
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const USER_UPDATE_MUTATION = gql`
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

export const USER_UPDATE_SETTING_MUTATION = gql`
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
      timezone
    }
  }
`;

export const TWEET_CREATE_MUTATION = gql`
  mutation tweetCreate($tweet: TweetInput!) {
    tweetCreate(tweet: $tweet) {
      id
    }
  }
`;

export const TWEET_LIKE_MUTATION = gql`
  mutation tweetLike($id: ID!) {
    tweetLike(id: $id) {
      ...tweetField
    }
  }
  ${TWEET_FIELD_FRAGMENT}
`;

export const CORRECTION_GROUP_CREATE_MUTATION = gql`
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
  ${TWEET_FIELD_FRAGMENT}
`;

export const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

// client side queries/mutations

export const SET_LOADING_MUTATION = gql`
  mutation setLoading($loading: Boolean!) {
    setLoading(loading: $loading) @client
  }
`;

export const SET_ERROR_MESSAGE_MUTATION = gql`
  mutation setErrorMessage($errorMessage: String) {
    setErrorMessage(errorMessage: $errorMessage) @client
  }
`;

export const GET_LOADING_QUERY = gql`
  query getLoading {
    loading @client(always: true)
  }
`;

export const GET_ERROR_MESSAGE_QUERY = gql`
  query getErrorMessage {
    errorMessage @client(always: true)
  }
`;
