import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
