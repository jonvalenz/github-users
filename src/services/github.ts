import { useQuery, useResult } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { USERS_QUERY, USER_QUERY } from '@/constants/queries';
import INavigationOptions from '@/models/INavigationOptions';
import IUser from '@/models/IUser';
import { ref } from 'vue';
import { FetchMoreQueryOptions, FetchMoreOptions } from '@apollo/client/core';

const usersArray = ref<Array<IUser[]>>([]);
const returnUsers = ref<IUser[]>([]);
const counter = ref(0);

export function getUsers(
  query = 'A',
  nav: INavigationOptions = { previousPageCursor: null, nextPageCursor: null },
) {
  const {
    result,
    loading,
    error,
    refetch: refetchSuper,
    fetchMore: fetchMoreSuper,
    onResult,
  } = useQuery(USERS_QUERY, {
    query,
    previousPageCursor: nav.previousPageCursor,
    nextPageCursor: nav.nextPageCursor,
  });

  function refetch(
    params:
      | { query: string; previousPageCursor: string | null; nextPageCursor: string | null }
      | undefined,
  ) {
    usersArray.value = [];
    counter.value = 0;
    refetchSuper(params);
  }

  const users = useResult<any, null, IUser[]>(result, null, (data) => data.search.nodes);
  const pageInfo = useResult(result, null, (data) => data.search.pageInfo);

  function fetchMore() {
    if (counter.value + 1 === usersArray.value.length) {
      console.log('End of users Array. Fetching more');
      loading.value = true;
      fetchMoreSuper({
        variables: {
          nextPageCursor: pageInfo.value.endCursor,
          previousPageCursor: null,
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          counter.value += 1;
          loading.value = false;

          return fetchMoreResult;
        },
      });
    } else {
      console.log('Cache exists. Rendering.');
      console.log(` Current counter is ${counter.value}`);
      counter.value += 1;
      returnUsers.value = usersArray.value[counter.value];

      console.log(`Current length is ${usersArray.value.length}`);
    }
  }

  function fetchPrevious() {
    console.log(counter.value);
    if (counter.value > 0) counter.value -= 1;
    returnUsers.value = usersArray.value[counter.value];
  }

  onResult(() => {
    usersArray.value.push(users.value as IUser[]);
    console.log(`New array Length is ${usersArray.value.length}`);
    returnUsers.value = users.value as IUser[];
  });

  return {
    loading,
    error,
    refetch,
    pageInfo,
    fetchMore,
    returnUsers,
    fetchPrevious,
    onResult,
    result,
  };
}

export function getUser(login: string) {
  const { result, loading, error } = useQuery(
    gql`
      query getByLogin($login: String!) {
        user(login: $login) {
          name
          login
          avatarUrl(size: 200)
          repositories(first: 10) {
            nodes {
              ... on Repository {
                name
                databaseId
              }
            }
          }
        }
      }
    `,
    {
      login,
    },
  );

  const user = useResult(result, null, (data) => data.user);
  const repositories = useResult(result, null, (data) => data.user.repositories.nodes);

  return {
    user,
    repositories,
    loading,
    error,
  };
}

export default {
  getUser,
  getUsers: USERS_QUERY,
};
