<template>
  <span v-if="!loading">
    <div
      v-for="user in users"
      :key="user.login"
      @keyup="showUserPage(user.login)"
      @click="showUserPage(user.login)"
    >
      {{ user.name }}
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { getUsers } from '../services/github';

export default defineComponent({
  name: 'DashBoard',
  components: {},
  setup() {
    const router = useRouter();
    const { users, loading } = getUsers();

    setTimeout(() => console.log(users.value), 2000);

    function showUserPage(info: string) {
      sessionStorage.setItem('userID', info);
      router.push({ name: 'user' });
    }

    return { users, showUserPage, loading };
  },
});
</script>
