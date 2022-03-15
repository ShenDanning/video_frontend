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
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">返回上一级</a></el-breadcrumb-item>
        <el-breadcrumb-item>视频播放</el-breadcrumb-item>
      </el-breadcrumb>
      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">
        <Col span="15" >
          <video-player   class="video-player vjs-custom-skin"
                          ref="videoPlayer" :options="playerOptions" :playsinline="true"
                          customEventName="customstatechangedeventname"
                          @play="onPlayerPlay($event)"
                          @pause="onPlayerPause($event)"
                          @ended="onPlayerEnded($event)"
                          @timeupdate="onPlayerTimeupdate($event)"
          >
          </video-player>
        </Col>
        <Col span="7" offset="1" style="text-align: left">
          <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="视频信息" name="videoInfo">
              <h2>
                {{videoInfo.title}}
              </h2>
              <el-card class="box-card" shadow="never" style="margin-top: 20px;padding:0;background-color: #f8f9fb">
                 <div style="overflow: auto;max-height: 150px">
                    简介：{{videoInfo.description}}
                 </div>
                <br>
                <span>
                   作者：{{videoInfo.author}}
            </span>
                <br>
                <span>
                   播放量：{{videoInfo.views}}
            </span>
              </el-card>

            </el-tab-pane>
            <el-tab-pane label="视频分析" name="videoAnalyse">
              <span v-if="isAnalyse===0">尚未分析</span>
              <el-card v-if="isAnalyse===1" class="box-card" shadow="never" style="margin-top: 7px;padding:0;background-color: #f8f9fb">

                <h4>详细信息</h4>
                           帧数：<span style="color: #2b85e4">{{videoParam.frames}}</span>
                           帧率：<span style="color: #2b85e4">{{videoParam.fps| numFilter}}</span>
                            时长：<span style="color: #2b85e4">{{videoParam.time| numFilter}}s</span>

                <br/>
                <h4 style="float: left;margin-top: 5px">关键帧数：{{keyframes.length}}</h4>
                <br/>
                <Row style="margin-top: 20px">
                  <Col :span="8" style="padding: 5px; padding-bottom: 10px;" v-for="item in keyframes.slice((curPage-1)*pageSize,curPage*pageSize)" :key="keyframes.indexOf(item)">
                    <img :src="item.url" style="width: 100%;height: 50px" @click="changeTime(item.time)">
                  </Col>
                </Row>
                <div class="block">
                  <!--                <span class="demonstration">页数较少时的效果</span>-->
                  <el-pagination
                    :current-page="curPage"
                    :page-size ="pageSize"
                    :total ="total"
                    style="padding:30px 0; text-align:center;"
                    layout="total,prev,next"
                    @current-change="handleCurrentChange">
                  </el-pagination>
                </div>
<!--                <div class="lateral-sliding">-->
<!--                  <div class="lateral-sliding-item" v-for="item in keyframes" :key="item">-->
<!--                    <div class="each-img">-->
<!--                      <img :src="item.url" class="each-img" @click="changeTime(item.time)">-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="目标检测" name="third">
              <span v-if="isAnalyse===0">尚未分析</span>

                <div id="bar" style="width:350px;height: 300px"></div>


            </el-tab-pane>
          </el-tabs>
        </Col>
      </Row>
      <Row>

      </Row>
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
        curPage:1,
        pageSize:9,
        total:10,
        isAnalyse:0,

        keyframes:[{
          time:"",
          url:''
        }],
        activeName:'videoInfo',
        currentVideo:'',
        isPause:false,
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
        videoParam:{
          'frames':'',
          'fps':'',
          'time':''
        },
        back: {
          backgroundSize: "100% 100%",
          height: "100%",
          position: "fixed",
          width: "100%",
        },
        username:''

      }
    },
    mounted() {
      this.username = localStorage.getItem("username")

   //   alert(this.$route.params.title)
      this.videoInfo.id = this.$route.query.id;
      this.getResult1(this.videoInfo.id)
      this.videoInfo.title = this.$route.query.title;
      this.videoInfo.author = this.$route.query.author;
      this.videoInfo.description = this.$route.query.description;
      this.videoInfo.playsum = this.$route.query.playsum;
      if(this.$route.query.views == null)
        this.videoInfo.views = 0
      else this.videoInfo.views = this.$route.query.views;
      // this.videoInfo.views = this.$route.query.views;
      console.log(this.videoInfo);
      this.playVideo(this.$route.query.url)

    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      handleCurrentChange(newPage) {
        // 页码改变触发
       // alert(newPage)
        this.curPage = newPage
      },
      async getResult1(videoId){

        var data = (await getResult(videoId)).data;
        if(data.status===200){

          // this.result = data.data.result;
          // // alert(this.result)
           if(data.data===null){

             this.isAnalyse=0;
           }else{

             this.isAnalyse=1;
             if(this.isAnalyse===1){
               this.InitBar(data.data.classes);
             }

             this.videoParam=data.data.videoInfo[0];
             this.detailInfo= data.data.detail;
             this.keyframes= data.data.keyframeInfo;
             this.total =data.data.keyframeInfo.length;
           }



        }

      },
      InitBar(data){
        var myChart = echarts.init(document.getElementById('bar'));
        // 指定图表的配置项和数据
        var option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '2%',
            left: 'center',
            bottom:'2%'
          },
          series: [
            {
              name: '目标检测',
              type: 'pie',
              radius: '50%',
              avoidLabelOverlap: false,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

              emphasis: {
                label: {
                  show: false,
                  fontSize: '20',
                  fontWeight: 'bold'
                },
              },
              labelLine: {
                show: true
              },
              label:{
                show: true
              },

              data: data
            }]
        };
        myChart.setOption(option)

      },

      openArticle(data){
        console.log(data)
      },

      playVideo(url){
        this.playerOptions['sources'][0]['src']=url;

        console.log(this.playerOptions)
      },
      show_List(curPage,pageSize){
        var url = "http://10.10.22.106/v1/getAllVideo";
        var that = this;
        that.$axios.get(url,{
          params:{
            'curPage': curPage,
            'pageSize': pageSize
          }
        }).then(function (res) {
          if (res.status == 200) {
            for(var i = 0;i<4 ;i++){
              that.url ="http://" +res.data.data.videoList[i]["url"].split('//')[1]
              that.data[i].playerOptions['sources'][0]['src'] = that.url;
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      onPlayerPause($event) {
      this.isPlay = false;
      this.isPause = true;
    },

    onPlayerPlay($event) {
      if(!this.isPause){//如果没有暂停过
        setViews(this.videoInfo.id)
      }
      this.isPlay = true;
    },

    onPlayerEnded($event) {

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
      onPlayerTimeupdate($event) {
        console.log($event);
      },
      testSkip(){
        this.player.currentTime(2)
      },
      changeTime(time){

        this.player.currentTime(time)
      },
      backtolast(){
        this.$router.go(-1);
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


