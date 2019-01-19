// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router/'
import store from './store/'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
// FastClick.attach(document.body)

// import axios from './api/axios/axios'

// import api from './api/api'


console.log(Vue.config,Vue.version,'router',router,'store',store)


Vue.config.productionTip = false

/* 原型上面添加方法 */


/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: {
//     App
//   },
//   template: '<App/>'
// })
// new Vue({
//   el:'#app',
//   router,
//   store,
//   render: h => h(App)
// });

new Vue({
  router,
  store,
  render:h =>h(App)
}).$mount('#app')

