import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/style/reset.scss'
import '@/assets/js/viewport'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueCookie)
axios.interceptors.response.use((response) => {
	let res = response.data
	if(res.code != 0){
		alert(res.message)
	}
	return response
}, err => {
	return Promise.reject(err)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
