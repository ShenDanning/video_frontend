import Vue from 'vue'
import Router from 'vue-router'
import videoplayer from '../pages/Videos/videoplayer.vue'
import testplayer from '../pages/test/videoplayer.vue'
import videoListtest from '../pages/Videos/videoListtest.vue'
import VideoManange from "../pages/admin/VideoManange";
import videoList from "../pages/Videos/videoList";
import Login from "../pages/admin/Login";
import Home from "../pages/home/Home";
import videoSquare from "../pages/Videos/videoSquare";
import TypeManage from "../pages/admin/TypeManage";
import UploadFile from "../pages/admin/UploadFile";
import CollectionsPlayer from "../pages/Videos/CollectionsPlayer";
import collectionPass from "../pages/manager/collectionPass";
import adminManage from "../pages/manager/adminManage";
// import sortdemo from "../pages/home/sortdemo"
// import demo from "../pages/admin/demo"
import myColumn from "../pages/admin/myColumn";
import ColumnVideos from "../pages/admin/ColumnVideos";
import VideoPass from "../pages/manager/VideoPass";
import adminCollectionVideos from "../pages/manager/adminCollectionVideos";
import peopleManage from "../pages/manager/peopleManage"
import analyseHome from "../pages/videoAnalyse/analyseHome";
import CollectionVideo from "../pages/home/CollectionVideo";
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
      path: '/VideoPass',
      name: 'VideoPass',
      component: VideoPass
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
      path:'/myColumn',
      name:'myColumn',
      component:myColumn
    },
    {
      path:'/ColumnVideos',
      name:'ColumnVideos',
      component:ColumnVideos,
    },
    {
      path:'/collectionPass',
      name:'collectionPass',
      component:collectionPass
    },
    {
      path:'/adminCollectionVideos',
      name:'adminCollectionVideos',
      component:adminCollectionVideos
    },
    {
      path:'/peopleManage',
      name:'peopleManage',
      component:peopleManage
    },
    {
      path:'/adminManage',
      name:'adminManage',
      component:adminManage
    },
    {
      path:'/analyseHome',
      name:'analyseHome',
      component:analyseHome
    },
    {
      path:'/CollectionVideo',
      name:'CollectionVideo',
      component:CollectionVideo
    },
    {
      path:'/testplayer',
      name:'testplayer',
      component:testplayer

    }


  ]
})
