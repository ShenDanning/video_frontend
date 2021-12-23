<template>
  <Layout :style="back">
    <Header :style="{position: 'fixed', width: '100%',padding: 0,zIndex:'3'}">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo">
          <img src="https://i.postimg.cc/ZnmmJHB9/shu.png" style="height: 40px">
        </div>
        <MenuItem name="1" >
          <p style="color:white;margin-left: 20px;font-size: 20px;font-weight:bold;font-family: Bahnschrift">上海大学视频服务站</p>
        </MenuItem>
      </Menu>
    </Header>
    <Content :style="{padding: '24px',margin: '88px 8% 20px',  background: '#fff'}">

      <div v-if="total===0">

        <el-empty description="该合集暂时没有视频">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="text-align: center">
            <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">返回上一级</a></el-breadcrumb-item>

          </el-breadcrumb>
        </el-empty>

      </div>
      <div v-else>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">返回上一级</a></el-breadcrumb-item>
          <el-breadcrumb-item>视频播放</el-breadcrumb-item>
          <el-breadcrumb-item>正在播放：{{currentVideo}}</el-breadcrumb-item>
        </el-breadcrumb>
        <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">
          <Col span="17" >
            <video-player   class="video-player vjs-custom-skin"
                            ref="videoPlayer" :options="playerOptions" :playsinline="true"
                            customEventName="customstatechangedeventname"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
                            @ended="onPlayerEnded($event)"
            >
            </video-player>
          </Col>
          <Col span="6" offset="1" style="text-align: left">
            <h2>
              选集
            </h2>
            <el-card shadow="never" class="infinite-list" v-infinite-scroll="load"  style="overflow:auto;margin-top: 20px;padding:0;background-color: #f8f9fb;height: 380px">
              <Row  v-for="item in tableData" :key="item.id" style="overflow:auto" class="infinite-list-item">
                <el-button  size="small" style="width: 100%;margin-top: 2px;text-align: left" autofocus
                            @click="playVideo(item.url,item.id,item.title)"
                >{{item.title}}</el-button>
              </Row>

            </el-card>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="5">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="collectionPicture" class="image">
            </el-card>

          </Col>
          <Col Col span="17">
            <el-card  shadow="never" style="border: 0" >
              <h1 style="text-align: left">{{collectionName}}</h1>
              <br>
              <p style="text-align: left">简介：{{collectionDescription }}</p>

            </el-card>
          </Col>

        </Row>
      </div>





    </Content>
  </Layout>
</template>

<script>
import Vue from 'vue'
import 'video.js/dist/video-js.css'
import axios from 'axios';
import HeadMenu from "../admin/HeadMenu";
import SideMenu from "../admin/SideMenu";
import {getPersonalVideoByTitle,setViews,getVideoByColumn} from "../../api/api";
Vue.prototype.$axios = axios;
export default {
  components: {SideMenu, HeadMenu},
  data() {
    return {
      currentVideo:'',
      collectionPicture:'',
      tableData: [{
        id:1,
        fileName: 'text1',
        title: '我的视频',
        picture: '图片url',
        uploadTime: '2021-11-20',
        description: '这是一个视频',
        author: '管理员',
        publish:'0',
        views:'',
        typeId:'',
        type: '',
        url:'',
      }],
      // 很多参数其实没必要的，也还有很多参数没列出来，只是把我看到的所有文章做一个统计
      playerOptions: {
        height: "30%",
        width:"50%",
        autoplay: false, //如果true,浏览器准备好时开始回放。(好像微信浏览器不太行)
        techOrder: ['html5'], // 需要加载的插件，如果是要兼容flash的话，必须先加载flash。顺序不能错：['flash','html5']
        flash: {
          hls: { withCredentials: false }
        },
        html5: { hls: { withCredentials: false } },
        muted: true, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        language: 'en', // 提示的语言 中文的话是 zh-CN
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度 0.7倍...
        sources: [
          // 播放的资源列表，虽然不知为何是个数组，可能是，轮流播放？
          {
            type: 'video/mp4', // 类型。
            //src: 'http://10.10.22.106/morning-2021112502104297.mp4' // 视频流路径
            src:''
          },

        ],
        // poster: 'http://1.15.227.166:8888/group1/M00/00/01/rBEAC2GhykiAKj7IAABoIOUxp6c089.jpg', //你的封面地址
        poster:'',
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controls: true, // 是否显示操作条
        controlBar: {
          // 播放的操作
          timeDivider: true, // 时间分割线
          durationDisplay: true, // 总时间
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      videoInfo:{
        id:'',
        title:'',
        description:'',
        picture:'',
        url:'',
        author:'',
        views:'',
      },
      back: {
        backgroundSize: "100% 100%",
        height: "100%",
        position: "fixed",
        width: "100%",
      },
      username:'',
      count:0,
      url:'',
      collectionDescription:'',
      collectionName:'',
      total:0,

    }
  },
  mounted() {
    this.username = localStorage.getItem("username")
    //   alert(this.$route.params.title)
    this.url = this.$route.query.id;
    this.collectionName = this.$route.query.name;
    this.collectionDescription = this.$route.query.description;
    this.getVideoByColumn(this.url)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {

    openArticle(data){
      console.log(data)
    },

    playVideo(url,id,title){
      this.videoInfo.id = id
      this.playerOptions['sources'][0]['src']=url;
      this.currentVideo = title;
      console.log(this.playerOptions)
    },

    async getVideoByColumn(columnid){
      var data = (await (getVideoByColumn(columnid,1,1000))).data;
      if(data.status === 200){
        this.total = data.data.videoList.length;
        this.tableData = data.data.videoList;
        this.playerOptions['sources'][0]['src'] = data.data.videoList[0]["url"];
        this.videoInfo.id = data.data.videoList[0]["id"];
        this.currentVideo = data.data.videoList[0]["title"];
        this.collectionPicture = data.data.videoList[0]["picture"];
      }
    },

    onPlayerPause($event) {
      this.isPlay = false;
    },

    onPlayerPlay($event) {
      this.isPlay = true;
    },

    onPlayerEnded($event) {
      setViews(this.videoInfo.id)
    },
    async setViews(id){
      await (setViews(id));
    },
    onPlayerClick() {
      if (this.isPlay) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },
    backtolast(){
      this.$router.go(-1);
    },
    load () {
      this.count += 2
    }
  },

}
</script>
<style>
.image {
  width: 100%;
  height: 160px;
  display: block;
}

.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
</style>


