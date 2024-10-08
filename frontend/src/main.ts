import { createPinia, Pinia } from 'pinia'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/style/core.css';
import '@/assets/index.css'

interface PiniaWithInstall extends Pinia {
  install: any;
}
const pinia = createPinia() as PiniaWithInstall;

const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#app');
