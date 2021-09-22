import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store from "./vuex/store";
import vuescroll from 'vuescroll/dist/vuescroll-native';
Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(vuescroll);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
