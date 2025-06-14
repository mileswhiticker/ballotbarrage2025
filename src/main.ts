import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import gameController from '@controllers/GameController.ts';

createApp(App).mount('#app')

gameController.InitializeGame();
