<template>
  <HomeHeader></HomeHeader>

  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeHeader from './components/home-header.vue';

export default defineComponent({
  components: { HomeHeader },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* * {
  outline: 2px;
  outline-color: black;
  outline-style: solid;
} */
</style>
