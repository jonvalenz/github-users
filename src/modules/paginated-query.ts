import { ref, reactive } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import { DocumentNode } from 'graphql';
import { forEachDeep } from 'deepdash-es/standalone';
// import { relayStylePagination } from '@apollo/client/utilities';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findKeyValue(keyName: string, obj: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let returnObj: any = {};
  forEachDeep(obj, (value, key, _parent, context) => {
    if (key === keyName) {
      returnObj = value;
      if (context.break) context.break();
    }
  });

  return returnObj;
}

export default function constructPaginatedQuery<T>() {
  const resultsArray = ref<Array<T[]>>([]);
  const results = ref<T[]>([]);
  const counter = ref(0);

  return function getPaginatedQuery(
    query: DocumentNode,
    dataNode: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: Record<string, any>,
    options: Record<string, any> = {},
  ) {
    return function paginatedQuery() {
      const {
        result: rawResult,
        loading,
        refetch: refetchSuper,
        fetchMore: fetchMoreSuper,
        onResult,
        error,
      } = useQuery(query, variables, options);

      function refetch(newQuery: string) {
        resultsArray.value = [];
        counter.value = 0;
        refetchSuper({ query: newQuery, previousPageCursor: null, nextPageCursor: null });
      }

      // eslint-disable-next-line max-len
      const pickedResult = useResult(rawResult, null, (response) => findKeyValue(dataNode, response));
      const pageInfo = useResult(rawResult, null, (response) => findKeyValue('pageInfo', response));

      function fetchMore() {
        if (loading.value || !pageInfo.value?.hasNextPage) {
          return;
        }
        if (counter.value + 1 === resultsArray.value.length) {
          loading.value = true;
          fetchMoreSuper({
            variables: {
              nextPageCursor: pageInfo.value?.endCursor,
              previousPageCursor: null,
            },

            updateQuery: (_previousResult, { fetchMoreResult }) => {
              counter.value += 1;
              loading.value = false;
              return fetchMoreResult;
            },
          });
        } else {
          counter.value += 1;
          results.value = resultsArray.value[counter.value];
        }
      }

      function fetchPrevious() {
        console.log(resultsArray.value.length);
        if (counter.value > 0 && pageInfo.value.hasPreviousPage) {
          counter.value -= 1;
          results.value = resultsArray.value[counter.value];
        }
      }

      onResult(() => {
        resultsArray.value.push(reactive(pickedResult.value as T[]));
        results.value = reactive(pickedResult.value as T[]);
        loading.value = false;
      });

      return {
        loading,
        refetch,
        fetchMore,
        results,
        fetchPrevious,
        rawResult,
      };
    };
  };
}

// export default function constructPaginatedQuery<T>(
//   query: DocumentNode,
//   dataNode: string,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   variables: Record<string, any>,
// ) {
//   const resultsArray = ref<Array<T[]>>([]);
//   const results = ref<T[]>([]);
//   const counter = ref(0);

//   const {
//     result: rawResult,
//     loading,
//     refetch: refetchSuper,
//     fetchMore: fetchMoreSuper,
//     onResult,
//     error,
//   } = useQuery(query, variables);

//   function refetch(newQuery: string) {
//     loading.value = true;
//     resultsArray.value = [];
//     counter.value = 0;
//     refetchSuper({ query: newQuery, previousPageCursor: null, nextPageCursor: null });
//   }

// eslint-disable-next-line max-len
//   const pickedResult = useResult(rawResult, null, (response) => findKeyValue(dataNode, response));
//   const pageInfo = useResult(rawResult, null, (response) => findKeyValue('pageInfo', response));

//   function fetchMore() {
//     if (loading.value || !pageInfo.value?.hasNextPage) {
//       return;
//     }

//     if (counter.value + 1 === resultsArray.value.length) {
//       loading.value = true;
//       fetchMoreSuper({
//         variables: {
//           nextPageCursor: pageInfo.value?.endCursor,
//           previousPageCursor: null,
//         },

//         updateQuery: (_previousResult, { fetchMoreResult }) => {
//           counter.value += 1;
//           loading.value = false;
//           return fetchMoreResult;
//         },
//       });
//     } else {
//       counter.value += 1;
//       results.value = resultsArray.value[counter.value];
//     }
//   }

//   function fetchPrevious() {
//     if (counter.value > 0) counter.value -= 1;
//     results.value = resultsArray.value[counter.value];
//   }

//   onResult(() => {
//     resultsArray.value.push(reactive(pickedResult.value as T[]));
//     results.value = reactive(pickedResult.value as T[]);
//     loading.value = false;
//   });

//   console.log(error.value);

//   return {
//     loading,
//     refetch,
//     fetchMore,
//     results,
//     fetchPrevious,
//     rawResult,
//   };
// }
