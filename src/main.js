import Vue from 'vue';
import App from './App';
import router from './router';
// import './assets/theme-chalk/index.scss';
// import { install } from './index';
// install(Vue);
import ElementUI from 'element-ui';
import './assets/element-variables.scss';
Vue.use(ElementUI);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
