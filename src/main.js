import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import store from "./vuex/store";
import vuescroll from 'vuescroll/dist/vuescroll-native';
import VueContextMenu from "vue-contextmenu/src/main";

Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(vuescroll);
Vue.use(VueViewer);
Vue.use(VueContextMenu)

VueViewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-src' }
})
export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
