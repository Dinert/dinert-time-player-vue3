
import {createApp} from 'vue'
import App from './App.vue'
import DinerTimePlayer from './index'

const app = createApp(App)
app.use(DinerTimePlayer)
app.mount('#app')
