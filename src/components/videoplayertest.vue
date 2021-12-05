<template>
  <div style="height:30%; width:50%">
    <video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true"     
    customEventName="customstatechangedeventname"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"
    @waiting="onPlayerWaiting($event)"
    @playing="onPlayerPlaying($event)"
    @loadeddata="onPlayerLoadeddata($event)"
    @timeupdate="onPlayerTimeupdate($event)"
    @canplay="onPlayerCanplay($event)"
    @canplaythrough="onPlayerCanplaythrough($event)"
    @statechanged="playerStateChanged($event)"
    @ready="playerReadied" 
  >
  </video-player>
  </div>

</template>

<script>
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'
  import axios from 'axios'
  import Vue from 'vue'
  Vue.use(axios);
  export default {
    data() {
      return {
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
              src: 'http://10.10.22.106/test.mp4' // 视频流路径
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
        }
      }
    },
    mounted() {
      console.log('this is current player instance object', this.player)
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
    getVideoList(){
    var url = "http://10.10.22.106/v1/getAllVideo";
    var that = this;
    that.axios.get(url,{
        params:{
        'curPage': 1,
        'pageSize': 2
        }
    }).then(function (res) {
      if (res.data.code == 200) {
        // that.user = res.data.data;
        console.log(res.data.videoList);
        return res.data.videoList;
      }
      console.log(res.data.msg);
    }).catch(function (error) {
      console.log(error);
    }); 

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
