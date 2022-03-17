// TODO fix thi

module.exports = {
  client: {
    service: {
      name: 'github-users',
      // URL to the GraphQL API
      url: 'https://api.github.com/graphql',
      headers:{
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : ''
      }
    },

    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
};

// const httpLink = createHttpLink({
//   uri: 'https://api.github.com/graphql',
// });

// const cache = new InMemoryCache();

// // eslint-disable-next-line arrow-body-style
// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       authorization: authToken ? `Bearer ${authToken}` : '',
//     },
//   };
// });

// const apolloClient = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache,
// });
