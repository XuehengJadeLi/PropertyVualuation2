import { createApp } from 'vue'
import App from './App.vue'
import VueCesium from 'vue-cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const app = createApp(App)
app.use(VueCesium, {
  cesiumPath: 'cesium/Build/Cesium/Cesium.js',
  accessToken: process.env.VUE_APP_CESIUM_ACCESS_TOKEN
})
app.mount('#app')