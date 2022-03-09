import { useQuery, useResult } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export function getUsers() {
  const { result, loading, error } = useQuery(gql`
    query {
      search(first: 10, type: USER, query: "A") {
        nodes {
          ... on User {
            login
            name
          }
        }
      }
    }
  `);

  const users = useResult(result, null, (data) => data.search.nodes);
  return {
    users,
    loading,
    error,
  };
}

export async function getUser(login: string) {
  const { result, loading, error } = useQuery(gql`
  query {
    user (login: ${login}) {

      repositories {
        name
      }
    }
  }
  `);

  const user = useResult(result, null, (data) => data);
  return {
    user,
    loading,
    error,
  };
}

export default {
  getUser,
  getUsers,
};
