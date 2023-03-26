import { createApp } from 'vue'
import App from './App.vue'

/* Theme variables */
import './styles/app.sass'

import store from '@/store/index'

createApp(App)
  .use(store)
  .mount('#app')