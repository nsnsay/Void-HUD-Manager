// Styles Imports
import './assets/main.scss'
import 'primeicons/primeicons.css'
import Lara from '@primeuix/themes/aura'

// Plugins Imports
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './components/routers'
import ToastService from 'primevue/toastservice'
import { i18n } from './i18n'

// Font Imports
import './assets/chinesefonts.scss'
import '@fontsource/poppins/100'
import '@fontsource/poppins/200'
import '@fontsource/poppins/300'
import '@fontsource/poppins/400'
import '@fontsource/poppins/500'
import '@fontsource/poppins/600'
import '@fontsource/poppins/700'
import '@fontsource/poppins/800'
import '@fontsource/poppins/900'

const app = createApp(App)

app.use(ToastService)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})
app.use(i18n)
app.mount('#app')
