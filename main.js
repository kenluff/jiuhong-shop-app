import App from './App'
import store from './store'
import i18n from './lang/i18n'


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'
import util from '@/util/util.js'
import { request } from '@/util/http.js'
import noneContent from '@/components/none-content.vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	app.config.globalProperties.$util = util
	app.config.globalProperties.$request = request
	app.component('none-content',noneContent)
	return {app}
}
// #endif
