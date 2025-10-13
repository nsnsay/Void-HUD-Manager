import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(Vue3Toastify, {
  theme: 'dark',
  position: 'bottom-right'
})
app.mount('#app')

import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'

import './assets/styles/main.scss'
import './assets/styles/variablescomponents.scss'
