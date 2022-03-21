import { ref, Ref, watch } from 'vue';

function buildPaginator() {
  const itemsToDisplay = ref<any[]>();
  let currentIndex = 0;

  return function paginate<T>(
    arrayToPaginate: Ref<Readonly<T[] | null>>,
    numberToDisplay: number,
  ): {
    next: () => void;
    previous: () => void;
    itemsToDisplay: Ref<T[] | undefined>;
    isNextPageLoaded: () => boolean;
  } {
    function isNextPageLoaded() {
      return (
        // eslint-disable-next-line operator-linebreak
        currentIndex + numberToDisplay <
        (arrayToPaginate.value ? arrayToPaginate.value.length : currentIndex + 1)
      );
    }

    function nextIndex() {
      return currentIndex + numberToDisplay;
    }

    function arrayLength() {
      if (!arrayToPaginate.value) throw new Error('Invalid array');

      return arrayToPaginate.value.length;
    }

    watch(arrayToPaginate, (newVal, previousVal) => {
      if (
        // eslint-disable-next-line operator-linebreak
        previousVal === null ||
        // eslint-disable-next-line operator-linebreak
        newVal!.length === previousVal.length ||
        newVal!.length < previousVal.length
      ) {
        itemsToDisplay.value = newVal?.slice(0, numberToDisplay);
        currentIndex = 0;
      }
    });

    function next() {
      if (nextIndex() > arrayLength()) {
        itemsToDisplay.value = arrayToPaginate.value?.slice(
          currentIndex,
          2 * currentIndex + numberToDisplay - arrayLength(),
        );

        currentIndex = 2 * currentIndex + numberToDisplay - arrayLength();
      } else if (nextIndex() < arrayLength()) {
        currentIndex += numberToDisplay;

        itemsToDisplay.value = arrayToPaginate.value?.slice(currentIndex, nextIndex());
      }

      if (numberToDisplay >= arrayLength()) {
        currentIndex += arrayLength();
        itemsToDisplay.value = arrayToPaginate.value?.slice();
      }
    }

    function previous() {
      if (currentIndex - numberToDisplay >= 0) {
        itemsToDisplay.value = arrayToPaginate.value?.slice(
          currentIndex - numberToDisplay,
          currentIndex,
        );
        currentIndex -= numberToDisplay;
      }
    }

    return { next, previous, itemsToDisplay, isNextPageLoaded };
  };
}

export default buildPaginator;
