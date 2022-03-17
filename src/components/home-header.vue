<template>
  <div class="pt-5 pb-4 mb-2 bg-cyan-200 shadow-md rounded-b-lg">
    <label for="search-bar">
      <input
        @keydown="debouncedChange"
        v-model="input"
        id="search-bar"
        placeholder="Find User"
        type="text"
        class="rounded-md p-2"
      />
    </label>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, Ref, ref } from 'vue';

export default defineComponent({
  name: 'HomeHeader',
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const query: Ref<string> = inject<Ref<string>>('query')!;
    const input = ref('');
    let timeoutRef: number;

    function debouncedChange() {
      if (timeoutRef !== null) {
        clearTimeout(timeoutRef);
      }
      timeoutRef = setTimeout(() => {
        query.value = input.value;
      }, 500);
    }

    return { debouncedChange, input };
  },
});
</script>
<style lang=""></style>
