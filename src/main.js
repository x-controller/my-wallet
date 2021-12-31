import {createApp} from 'vue'
import App from './views/app.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {store} from './store'

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.mount('#app')