import { useQuery, useResult } from '@vue/apollo-composable';
import { USER_QUERY } from '@/constants/queries';
import IUser from '@/models/IUser';
import { ApolloQueryResult } from '@apollo/client/core';
import { watch } from 'vue';

export default function getRepos(login: string) {
  const {
    result,
    loading,
    error,
    fetchMore,
    refetch: refetchSuper,
  } = useQuery(USER_QUERY, {
    login,
    nextPageCursor: null,
  });

  const repositories = useResult<any, null, any[]>(
    result,
    null,
    (data) => data.user.repositories.nodes,
  );

  const pageInfo = useResult(result, null, (data) => data.user.repositories.pageInfo);
  const user = useResult<any, null, IUser>(result, null, (data) => data.user);

  function fetchMoreItems(): Promise<ApolloQueryResult<any>> | null {
    if (loading.value || !pageInfo.value.hasNextPage) return null;

    const fetchMorePromise = fetchMore({
      variables: { nextPageCursor: pageInfo.value.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { nodes } = fetchMoreResult.user.repositories;
        const newPageInfo = fetchMoreResult.user.repositories.pageInfo;
        const returnVal = {
          ...previousResult,
          user: {
            ...previousResult.user,
            repositories: {
              ...previousResult.user.repositories,
              nodes: Array.prototype.concat.call(previousResult.user.repositories.nodes, nodes),
              pageInfo: newPageInfo,
            },
          },
        };
        return returnVal;
      },
    });

    return fetchMorePromise || null;
  }

  function refetch(newQuery: string) {
    refetchSuper({ login: newQuery, nextPageCursor: null });
  }

  return { loading, fetchMoreItems, repositories, refetch, user };
}
