import gql from "graphql-tag";

export const POST_FIELD_FRAGMENT = gql`
  fragment postFieldFragment on Post {
    id
    json
    lines
    language {
      id
      name
    }
    user {
      username
    }
    isDraft
  }
`;

export const FETCH_VIEWER_QUERY = gql`
  query fetchViewer {
    viewer {
      id
      username
      email
      fluentLanguages
      learningLanguages
      posts {
        ...postFieldFragment
      }
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_POST_BY_ID_QUERY = gql`
  query fetchPostById($id: Int!) {
    post(id: $id) {
      ...postFieldFragment
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_FEED_FOR_USER_QUERY = gql`
  query fetchFeedForUser($uid: String!) {
    feed(uid: $uid) {
      ...postFieldFragment
    }
  }
  ${POST_FIELD_FRAGMENT}
`;

export const FETCH_LANGUAGES_QUERY = gql`
  query fetchLanguages {
    langs {
      id
      name
    }
  }
`;

export const POST_UPDATE_MUTATION = gql`
  mutation postUpdate($id: Int!, $post: PostInput!) {
    postUpdate(id: $id, post: $post) {
      id
    }
  }
`;

export const POST_CREATE_MUTATION = gql`
  mutation postCreate($post: PostInput!) {
    postCreate(post: $post) {
      id
    }
  }
`;

export const USER_UPDATE_MUTATION = gql`
  mutation userUpdate($id: String!, $user: UserInput!) {
    userUpdate(id: $id, user: $user) {
      id
      email
      username
      fluentLanguages
      learningLanguages
    }
  }
`;
