<template>
  <div v-if="!loading" class="grid gap-4 grid-rows-8">
    <div class="row-span-3 ml-20 flex">
      <img :src="user!.avatarUrl" class="rounded-full h-44 w-44" alt="" />

      <div class="flex content-center justify-center flex-wrap ml-2">
        <div class="text-xl">{{ user!.name || user!.login }}</div>
      </div>
    </div>
    <div class="row-span-1">
      <span class="float-left text-lg ml-20 mt-3">Repositories</span>
    </div>

    <div class="grid gap-4 grid-cols-12 row-span-4">
      <div class="col-span-1">
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
      <transition>
        <div class="flex flex-wrap col-span-10 h-fit" v-if="!loading">
          <div
            class="p-2 m-1 flex flex-wrap shadow-md grow-0"
            v-for="repository in repositories"
            :key="repository.id"
          >
            <div class="content">
              <div>{{ repository.name }}</div>
              <div>{{ repository.databaseId }}</div>
            </div>
          </div>
        </div>
      </transition>
      <div class="col-span-1">
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
import { defineComponent } from 'vue';
import getRepos from '@/services/github-user-repos';
import paginator from '@/modules/paginator';

const paginate = paginator();

export default defineComponent({
  name: 'UserProjects',
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const login = sessionStorage.getItem('userLogin')!;
    const { repositories: allRepositories, fetchMoreItems, loading, user } = getRepos(login);
    const {
      next,
      previous,
      itemsToDisplay: repositories,
      isNextPageLoaded,
    } = paginate(allRepositories, 10);

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
    return { loading, user, repositories, nextPage, previousPage };
  },
});
</script>
<style lang=""></style>

// TODO this page
