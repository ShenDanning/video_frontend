// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './css/commen.css'
import VideoPlayer from 'vue-video-player'
import ElementUI from 'element-ui';
// import axios from 'axios';
import ViewUI from 'view-design';
Vue.prototype.$axios = axios;
var axios = require('axios');
// var drag = require('drag2sortable/drag2sortable.jquery.js');

axios.defaults.baseURL = 'https://v.shu.edu.cn/api';
//axios.defaults.baseURL = 'http://127.0.0.1:8081';
//引入完成之后需要挂载到vue上
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import 'view-design/dist/styles/iview.css';
import EleUploadVideo from "vue-ele-upload-video";

import './css/commen.css'

Vue.use(ViewUI);
Vue.component(EleUploadVideo.name, EleUploadVideo);
Vue.use(VideoPlayer)
Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.config.productionTip = false


import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem("token")) {
      console.log(localStorage.getItem("userId"));
      config.headers.Authorization = localStorage.getItem("token");
      config.headers.userId  = localStorage.getItem("userId");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    //当返回信息为未登录或者登录失效的时候重定向为登录页面

    if (response.data.status === 401) {
      router.push({
        path: "/",
        query: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    router.push({
      path: "/",
      query: {} //从哪个页面跳转
    })
    return Promise.reject(error)
  }
);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
