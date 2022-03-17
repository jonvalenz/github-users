<template>
  <div
    class="grid grid-rows-3 shadow-lg content-center rounded-lg
    hover:ring px-2 pt-2 flex-none hover:cursor-pointer"
    @keyup="click"
    @click="click"
  >
    <div class="flex row-span-2 justify-center content-center">
      <img class="h-20 w-20 rounded-full" :src="avatarUrl" alt="" />
    </div>
    <div class="row-span-1 mt-1">
      {{ name || login }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserPreview',
  props: {
    name: {
      type: String,
      default: 'n/a',
    },
    avatarUrl: {
      type: String,
      default: 'n/a',
    },
    login: {
      type: String,
      default: 'n/a',
    },
  },
  emits: ['click'],
  setup(props, event) {
    function click() {
      event.emit('click', props.login);
    }

    return { click };
  },
});
</script>
<style lang=""></style>
