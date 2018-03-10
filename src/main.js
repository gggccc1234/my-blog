// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
// 解决移动端click事件延时300ms
import VueLazyLoad from 'vue-lazyload'
// 图片懒加载

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('../static/img/wait.gif')
  // 设置图片被加载前显示的默认图片
})

Vue.config.productionTip = false
// 关闭生产模式下的提示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
