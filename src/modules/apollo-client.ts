import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { relayStylePagination } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { authToken, uri } from '../constants/apollo-config';

const httpLink = createHttpLink({
  uri,
});

const cache = new InMemoryCache({
  typePolicies: {
    Search: {
      fields: {
        nodes: relayStylePagination(),
      },
    },
    Repositories: {
      fields: { nodes: relayStylePagination() },
    },
  },
});

// eslint-disable-next-line arrow-body-style
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${authToken}`,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default apolloClient;
