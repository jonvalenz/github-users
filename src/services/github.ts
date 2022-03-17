import { USERS_QUERY, USER_QUERY } from '@/constants/queries';
import INavigationOptions from '@/models/INavigationOptions';
import IUser from '@/models/IUser';
import IRepository from '@/models/IRepository';
import constructPaginatedQuery from '@/modules/paginated-query';
import { useResult } from '@vue/apollo-composable';

const paginatedUsers = constructPaginatedQuery<IUser>();
const paginatedRepos = constructPaginatedQuery<IRepository>();

export function getPaginatedUsers(
  query = 'A',
  nav: INavigationOptions = { previousPageCursor: null, nextPageCursor: null },
) {
  return paginatedUsers(USERS_QUERY, 'nodes', {
    query,
    nextPageCursor: nav.nextPageCursor,
    previousPageCursor: nav.previousPageCursor,
  })();
}

export function getPaginatedRepos(
  login = 'A',
  nav: INavigationOptions = { previousPageCursor: null, nextPageCursor: null },
) {
  // eslint-disable-next-line operator-linebreak
  const {
    loading,
    refetch,
    fetchMore,
    results: repositories,
    fetchPrevious,
    rawResult,
  } = paginatedRepos(USER_QUERY, 'nodes', {
    login,
    nextPageCursor: nav.nextPageCursor,
    previousPageCursor: nav.previousPageCursor,
  })();

  const user = useResult(rawResult, null, (data) => data.user);

  return {
    loading,
    refetch,
    fetchMore,
    repositories,
    fetchPrevious,
    user,
  };
}

export default {
  getPaginatedUsers,
  getPaginatedRepos,
};
