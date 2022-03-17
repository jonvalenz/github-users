import gql from 'graphql-tag';

export const USERS_QUERY = gql`
  query getUsers($query: String!, $previousPageCursor: String, $nextPageCursor: String) {
    search(
      first: 40
      before: $previousPageCursor
      after: $nextPageCursor
      type: USER
      query: $query
    ) {
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
      nodes {
        ... on User {
          id
          login
          name
          avatarUrl(size: 100)
        }
      }
    }
  }
`;

export const USER_QUERY = gql`
  query getByLogin($login: String!, $previousPageCursor: String, $nextPageCursor: String) {
    user(login: $login) {
      id
      name
      login
      avatarUrl(size: 200)
      repositories(first: 20, after: $nextPageCursor, before: $previousPageCursor) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        nodes {
          ... on Repository {
            id
            name
          }
        }
      }
    }
  }
`;
