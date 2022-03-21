<template>
  <div class="">
    <div class="grid grid-cols-12 grid-rows-1 align-center">
      <div class="col-span-1 flex justify-center hover:backdrop-contrast-50 rounded-lg">
        <button
          @click="previousPage()"
          class="w-full h-full flex flex-wrap justify-center content-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div class="col-span-10 min-h-[50em]">
        <div
          v-if="loading"
          class="absolute flex flex-wrap justify-center content-center h-4/6 w-5/6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9
              6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <!-- <div class="m-auto animate-spin w-32 h-32">
            <div class="h-full w-full bg-white rounded-lg shadow-2xl"></div>
          </div> -->
        </div>

        <Transition>
          <div
            v-if="!loading"
            class="flex align-middle justify-center flex-wrap container overflow-auto"
          >
            <div class="contents overflow-hidden">
              <div class="mx-1 my-1" v-for="user in users" :key="user.login">
                <UserPreview
                  :name="user.name"
                  :avatarUrl="user.avatarUrl"
                  :login="user.login"
                  @click="showUserPage(user.login)"
                ></UserPreview>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div class="col-span-1 flex justify-center hover:backdrop-contrast-50 rounded-lg">
        <button
          @click="nextPage()"
          class="w-full h-full flex flex-wrap justify-center content-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserPreview from '@/components/user-preview.vue';
import { defineComponent, inject, Ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import getUsers from '@/services/github-users';
import paginator from '@/modules/paginator';

const paginate = paginator();

export default defineComponent({
  name: 'DashBoard',
  components: {
    UserPreview,
  },
  setup() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const query = inject<Ref<string>>('query')!;
    const { loading, refetch, fetchMoreItems, users: allUsers } = getUsers(' ');
    const { next, previous, itemsToDisplay: users, isNextPageLoaded } = paginate(allUsers, 30);

    watch(query, () => {
      refetch(query.value);
    });

    function showUserPage(login: string) {
      sessionStorage.setItem('userLogin', login);
      router.push({ name: 'user' });
    }

    function nextPage() {
      if (isNextPageLoaded()) {
        next();
      } else {
        fetchMoreItems()?.then(() => {
          next();
        });
      }
    }

    function previousPage() {
      previous();
    }

    return { showUserPage, nextPage, previousPage, users, loading };
  },
});
</script>
<style></style>
