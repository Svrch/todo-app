import { createApp } from 'vue'
import App from './App.vue'
import router from './providers/router'
import { createPinia } from 'pinia'

export const app = createApp(App)
  .use(router)
  .use(createPinia())
