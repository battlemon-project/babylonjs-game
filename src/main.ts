import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Theme variables */
import './styles/app.sass'
import './theme/variables.css';
import store from '@/store/index'
//import { AndroidFullScreen } from '@ionic-native/android-full-screen'
import { ScreenOrientation } from '@ionic-native/screen-orientation'

//AndroidFullScreen.leanMode()
//AndroidFullScreen.immersiveMode()
ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.LANDSCAPE)

const app = createApp(App)
  .use(store)
  .use(IonicVue)
  .use(router)

router.isReady().then(() => {
  app.mount('#app');
});