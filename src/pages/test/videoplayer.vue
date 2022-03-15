<template>
  <Layout :style="back" >
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
    <Content :style="{padding: '24px',margin: '88px 8% 20px', minHeight: '280px', background: '#fff'}">

      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
      ></video-player>



    </Content>
  </Layout>
</template>

<script>
  import Vue from 'vue'
  import 'video.js/dist/video-js.css'
  import axios from 'axios';
  import HeadMenu from "../admin/HeadMenu";
  import SideMenu from "../admin/SideMenu";
  import {getPersonalVideoByTitle, getResult, setViews} from "../../api/api";
  import * as echarts from "echarts";
  const hls = require('videojs-contrib-hls')

  Vue.use(hls)
  Vue.prototype.$axios = axios;
  export default {
    components: {SideMenu, HeadMenu},
    filters: {
      numFilter(value) {
        let realVal = "";
        if (!isNaN(value) && value !== "") {
          // 截取当前数据到小数点后两位,改变toFixed的值即可截取你想要的数值
          realVal = parseFloat(value).toFixed(2);
        } else {
          realVal = "--";
        }
        return realVal;
      },
    },
    data() {
      return {

        playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "application/x-mpegURL",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "http://127.0.0.1:8080/20220314/sing/index.m3u8" //url地址
          }],
          poster: "../../static/images/test.jpg", //你的封面地址
          // width: document.documentElement.clientWidth, //播放器宽度
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        }

      }
    },





  }
</script>
<style>


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
.lateral-sliding {
  margin-top: 30px;
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
}
.lateral-sliding-item {
  display: flex;
  margin-right: 20px;

}
.each-img {
  width: 300px;
  height: 225px;

}
</style>


