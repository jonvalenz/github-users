import { DefaultApolloClient } from '@vue/apollo-composable';
import {
  createApp, h, provide, ref,
} from 'vue';
import apolloClient from './modules/apollo-client';
import App from './App.vue';
import router from './router';
import './index.css';

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
    provide('query', ref<string>(''));
  },

  render: () => h(App),
})
  .use(router)
  .mount('#app');
