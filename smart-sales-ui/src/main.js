import Vue from 'vue'
import App from './App.vue'
import router from 'router'
import axios from 'axios';

import { 
    BootstrapVue, 
    BootstrapVueIcons 
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import MintUI from 'mint-ui';
import util from 'api/util'

import 'mint-ui/lib/style.css'; 

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(MintUI);
Vue.use(util);

Vue.prototype.$axios = axios;

Vue.config.productionTip = false

import { getLocalItem } from 'api/storage'


router.beforeEach((to, from, next) => {
  const token = getLocalItem('token');
  if (!token && to.path !== '/' 
      && (to.meta.auth != undefined && to.meta.auth === true)) {
      next('/login');
  } else {
      if (navigator.userAgent.indexOf('MSIE') > -1) {
          Vue.prototype.$alert('本系统不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
              confirmButtonText: '确定'
          });
      } else {
          next();
      }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
