import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import appController from '@controllers/AppController.ts';

createApp(App).mount('#app')

appController.initialise();
