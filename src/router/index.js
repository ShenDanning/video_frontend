import Vue from 'vue'
import Router from 'vue-router'
import videoplayer from '../pages/Videos/videoplayer.vue'

import videoListtest from '../pages/Videos/videoListtest.vue'
import VideoManange from "../pages/admin/VideoManange";
import videoList from "../pages/Videos/videoList";
import Login from "../pages/admin/Login";
import Home from "../pages/home/Home";
import videoSquare from "../pages/Videos/videoSquare";
import TypeManage from "../pages/admin/TypeManage";
import UploadFile from "../pages/admin/UploadFile";
import CollectionsPlayer from "../pages/Videos/CollectionsPlayer";
// import demo from "../pages/admin/demo"
Vue.use(Router)

export default new Router({

  routes: [
    {
      path:'/',
      redirect:'/Home',

    },

    {
      path:'/Login',
      name:'Login',
      component:Login
    },
    {
      path: '/videoplayer',
      name: 'videoplayer',
      component: videoplayer
    },
    {
      path: '/CollectionPlayer',
      name: 'CollectionPlayer',
      component:CollectionsPlayer
    },

    {
      path: '/videoListtest',
      name: 'videoListtest',
      component: videoListtest
    },
    {
      path: '/videoListtest',
      name: 'videoListtest',
      component: videoListtest
    },
    {
      path:'/videoSquare',
      name:'videoSquare',
      component:videoSquare
    },
    {
      path:'/VideoManage',
      name:'VideoManage',
      component:VideoManange
    },
    {
      path:'/TypeManage',
      name:'TypeManage',
      component:TypeManage
    },
    {
      path:'/videoList',
      name:'videoList',
      component:videoList
    },
    {
      path:'/Home',
      name:'Home',
      component:Home
    },
    {
      path:'/UploadFile',
      name:'UploadFile',
      component:UploadFile
    },


  ]
})
