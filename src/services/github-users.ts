import { useQuery, useResult } from '@vue/apollo-composable';
import { USERS_QUERY } from '@/constants/queries';
import IUser from '@/models/IUser';
import { ApolloQueryResult } from '@apollo/client/core';
import { watch } from 'vue';

export default function getUsers(query = 'a') {
  const {
    result,
    loading,
    error,
    fetchMore,
    refetch: refetchSuper,
  } = useQuery(USERS_QUERY, {
    query,
    nextPageCursor: null,
  });

  const users = useResult<any, null, IUser[]>(result, null, (data) => data.search.nodes);
  const pageInfo = useResult(result, null, (data) => data.search.pageInfo);

  function fetchMoreItems(): Promise<ApolloQueryResult<any>> | null {
    if (loading.value || !pageInfo.value.hasNextPage) return null;

    const fetchMorePromise = fetchMore({
      variables: { nextPageCursor: pageInfo.value.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { nodes } = fetchMoreResult.search;
        const newPageInfo = fetchMoreResult.search.pageInfo;
        const returnVal = {
          ...previousResult,
          search: {
            ...previousResult.search,
            nodes: Array.prototype.concat.call(previousResult.search.nodes, nodes),
            pageInfo: newPageInfo,
          },
        };
        return returnVal;
      },
    });

    return fetchMorePromise || null;
  }

  function refetch(newQuery: string) {
    refetchSuper({ query: newQuery, nextPageCursor: null });
  }

  return { loading, fetchMoreItems, users, refetch };
}
