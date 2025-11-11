import App from './App'

import AuthMixin from './utils/authMixin'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.mixin(AuthMixin)

const app = new Vue({
  ...App
})
app.$mount()

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
	
  const app = createSSRApp(App)
  
  app.mixin(AuthMixin)
  
  return {
    app
  }
  
}
// #endif