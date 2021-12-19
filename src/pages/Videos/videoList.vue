<template>
  <div>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="SelectType">
              <el-menu-item index="0">
                全部
              </el-menu-item>
              <el-menu-item v-for="item in tagList" :key="item.id" :index="item.id.toString()">
                {{ item.tag }}
              </el-menu-item>
              <el-menu-item style="float: right" index="-1">
                <Input
                  v-model="searchTitle"
                  :search="true"
                  suffix="ios-search"
                  placeholder="请输入视频标题"
                  style="width: auto;margin-left: 10px"
                  @on-search="searchVideo" />
              </el-menu-item>
            </el-menu>
            <div class="line"></div>
            <br>
            <Row>
              <Col :span="6" style="padding-left: 10px; padding-bottom: 10px;" v-for="item in videoInfo" :key="item.id">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item.picture" style="height:140px;width:100%" class="image" @click="openURL(item)" >
                  <div style="padding: 14px;text-align: left">
                    <h3 style="font-weight: bold;color: #666" class="view-text">{{ item.title }}</h3>
                    <div class="bottom clearfix">
                      <span class="time" >{{ dateFormat(item.uploadTime) }}</span>
                      <span class="button" size="mini">来自:{{item.author}}  {{item.views}}播放</span>
                    </div>

                  </div>
                </el-card>
              </Col>
            </Row>
            <div class="block">
              <el-pagination
                :current-page="curPage"
                :page-size ="pageSize"
                :total ="total"
                style="padding:30px 0; text-align:center;"
                layout="total,prev,pager,next,jumper"
                @current-change="showVideoByType">
              </el-pagination>
            </div>
  </div>



</template>

<script>
import Vue from 'vue'
import 'video.js/dist/video-js.css'
import axios from 'axios';
import HeadMenu from "../admin/HeadMenu";
import SideMenu from "../admin/SideMenu";
import {getPublishedVideo, getTagList, getVideoByType} from "../../api/api";
import moment from "moment";

Vue.prototype.$axios = axios;
export default {
  components: {SideMenu, HeadMenu},
  data() {
    return {
      currentVideo:'',

      tagList:[],
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
            src: '' // 视频流路径
          },

        ],
        poster: '/static/images/author.jpg', //你的封面地址
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
      curPage:1,
      pageSize:8,
      total:0,
      videoInfo:[],
      activeIndex:'0',
      searchTitle:'',
      username:''
    }
  },
  mounted() {
    this.username = localStorage.getItem("username")
    this.showVideoByType(1,0);
    this.getTagList();
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
  },
  methods: {

    dateFormat(date) {

      return moment(date).format("YYYY-MM-DD");
    },
    openURL(item){

      this.$router.push({name:'videoplayer',
        query:{
          url: item.url,
          id: item.id,
          title: item.title,
          description:item.description,
          author:item.author,
          uploadTime:item.uploadTime,
          type:item.type,
          views:item.views
        }})

    },
    async changePage(val){
      if(val){
        this.curPage = val;
      }
    },

    async getTagList(){
      var data = (await(getTagList())).data;
      if(data.status === 200){
        this.tagList = data.data.tagList;
      }
    },

    searchVideo(key){
      this.showVideoByType(1)
    },

    async showVideoByType(val){

      if(val){
        this.curPage = val;
      }
     // alert(this.activeIndex)
      var tag=this.activeIndex;
      var data = (await (getPublishedVideo(this.searchTitle,tag,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.videoInfo = data.data.videoList;
        this.total = data.data.total;
      }
      this.searchTitle=''

    },

    SelectType(key){
      if(key!=-1){
        this.activeIndex=key;
      }
      this.showVideoByType(1)
    },
    onPlayerPause($event) {
      this.isPlay = false;
    },
    onPlayerPlay($event) {
      this.isPlay = true;
    },
    onPlayerEnded($event) {},
    onPlayerClick() {
      if (this.isPlay) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },
  }
}
</script>
<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;

}

.button {
  padding: 0;
  float: right;
  font-size: 13px;
  color: #999;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.view-text{
  /**
	思路：
	1.设置inline-block属相
	2.强制不换行
	3.固定高度
	4.隐藏超出部分
	5.显示“……”
  */
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}

</style>
