<template>
  <div class="transition duration-300 ease-in">
    <div class="grid grid-cols-12 h-full">
      <div class="col-span-1 flex justify-center hover:backdrop-contrast-50 h-full rounded-lg">
        <button @click="previousPage()">Previous</button>
      </div>

      <div class="flex align-middle justify-center flex-wrap col-span-10 container mx-auto h-full">
        <div class="contents h-full" v-if="!loading">
          <div class="mx-1 my-1" v-for="user in users" :key="user.login">
            <UserPreview
              :name="user.name"
              :avatarUrl="user.avatarUrl"
              :login="user.login"
              @click="showUserPage"
            ></UserPreview>
          </div>
        </div>
      </div>

      <div class="col-span-1 flex justify-center hover:backdrop-contrast-50 h-full rounded-lg">
        <button @click="nextPage()">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserPreview from '@/components/user-preview.vue';

import { defineComponent, inject, Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getUsers } from '../services/github';

export default defineComponent({
  name: 'DashBoard',
  components: {
    UserPreview,
  },
  setup() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const query = inject<Ref<string>>('query')!;

    // const users = ref<IUser[]>([]);

    const {
      loading,
      refetch,
      fetchMore,
      fetchPrevious,
      returnUsers: users,
    } = getUsers(query.value);

    watch(query, (newVal) => {
      refetch({ query: newVal, nextPageCursor: null, previousPageCursor: null });
      // eslint-disable-next-line prefer-destructuring
    });

    function showUserPage(login: string) {
      sessionStorage.setItem('userLogin', login);
      router.push({ name: 'user' });
    }

    function nextPage() {
      if (!loading.value) {
        fetchMore();
      }
    }

    function previousPage() {
      fetchPrevious();
    }

    return { showUserPage, loading, nextPage, previousPage, users };
  },
});
</script>
