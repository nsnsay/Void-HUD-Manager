// Styles Imports
import './assets/main.scss'
import './assets/globals.css'

// Plugins Imports
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './components/routers'
import { i18n } from './i18n'

// Font Imports
import './assets/chinesefonts.scss'
import '@fontsource/inter/100'
import '@fontsource/inter/200'
import '@fontsource/inter/300'
import '@fontsource/inter/400'
import '@fontsource/inter/500'
import '@fontsource/inter/600'
import '@fontsource/inter/700'
import '@fontsource/inter/800'
import '@fontsource/inter/900'

const app = createApp(App)


app.use(router)
app.use(i18n)
app.mount('#app')
