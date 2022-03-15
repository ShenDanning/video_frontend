<template>
  <Layout >
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
    <Content :style="{padding: '24px',margin: '88px 5% 20px', minHeight: '800px', background: '#fff'}">
      <div v-if="showModal" class="mask">
        <span class="mask-text">处理中，请等待...</span>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">返回上一级</a></el-breadcrumb-item>
        <el-breadcrumb-item>视频分析</el-breadcrumb-item>
      </el-breadcrumb>
<!--      <el-button @click="getBar">demo1 show</el-button>-->
<!--      <el-button @click="getBar1">demo2 show</el-button>-->
<!--      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">-->
<!--        <Col span="16" offset="4">-->
<!--          <el-card style="text-align: left">-->
<!--            <h3>视频信息</h3>-->
<!--           视频帧数： <span style="color: #2b85e4">{{videoInfo.frames}}</span>-->
<!--           视频帧率： <span style="color: #2b85e4">{{videoInfo.fps}}</span>-->
<!--            视频时长： <span style="color: #2b85e4">{{videoInfo.time}}</span>-->
<!--          </el-card>-->

<!--        </Col>-->
<!--      </Row>-->
<!--      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">-->
<!--        <Col span="16" offset="4">-->
<!--          <el-card style="text-align: left">-->
<!--            <h3>分析结果</h3>-->
<!--            该视频的类型为：<span style="color: #2b85e4">{{result}}</span>-->
<!--          </el-card>-->

<!--        </Col>-->
<!--      </Row>-->
      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 40px">
        <Col span="11" offset="">
          <el-card style="text-align: left">
            <h3>目标检测可视化</h3>
            <div id="bar" style="width:100%;height:400px;"></div>

          </el-card>
        </Col>
        <Col span="12" offset="1" >
          <el-card style="text-align: left">
            <h3 style="float: left">每两秒视频中的目标</h3>
            <h4 style="float: right">条数：{{len}}</h4>

            <el-table
              :data="detailInfo"
              class="table-container"
              height="400"
              style="z-index: 1"
            >
              <el-table-column
                fixed
                prop="time"
                label="时刻(秒为单位)"
                width="160"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                fixed
                prop="classes"
                label="包含的目标"

                show-overflow-tooltip>
              </el-table-column>
            </el-table>

          </el-card>

        </Col>
      </Row>
      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">
        <Col span="24">
          <h3 style="float: left">关键帧</h3>
          <div class="lateral-sliding">
            <div class="lateral-sliding-item" v-for="item in keyframes" :key="item">
              <div class="each-img">
                <img :src="item" class="each-img">

              </div>

            </div>
          </div>

        </Col>

      </Row>


    </Content>
  </Layout>
</template>

<script>
import * as echarts from 'echarts';
import {getAnalyseRes, getResult} from "../../api/api";

export default {
  name: 'analyseHome',
  data() {
    return {
      showModal:false,
      len:0,
      videoInfo:{
        'frames':'',
        'fps':'',
        'time':''
      },
      items:10,
      back: {
        backgroundSize: "100% 100%",
        height: "100%",
        position: "fixed",
        width: "100%",
      },
      result:'',
      keyframes:'',

      analyseData:[
        {value: 1048, name: '搜索引擎'},
        {value: 735, name: '直接访问'},
        {value: 580, name: '邮件营销'},
        {value: 484, name: '联盟广告'},
        {value: 300, name: '视频广告'}
      ],
      detailInfo:[
        {time:2,classes:'[1,2,3]'}
      ]
    }
  },
  mounted: function() {
    this.getResult1(this.$route.params.videoId);

    // this.getPie();
    //this.getBar();
  },
  methods: {
    backtolast(){
      this.$router.go(-1);
    },
    async getResult1(videoId){

      var data = (await getResult(videoId)).data;
      if(data.status===200){

        this.result = data.data.result;
       // alert(this.result)
        this.InitBar(data.data.classes);

        this.videoInfo=data.data.videoInfo[0];
        this.detailInfo= data.data.detail;
        this.keyframes= data.data.keyframeInfo;
        this.len =data.data.detail.length;

      }

    },
    async getBar(){
      this.showModal=true;
      var formdata = new FormData();
      formdata.append(
        'pathIn','/Users/dingyujie/Movies/Filmage Screen/Record/Video/lecture.mp4'
      )
      formdata.append(
        'pathOut','/Users/dingyujie/PycharmProjects/yolov5/data/video/videoimg'
      )
      var data = (await getAnalyseRes(formdata)).data;

      if(data.status==='success'){
        this.showModal=false;
        this.videoInfo=data.videoInfo[0];
        this.result = data.result;

      //  alert(this.result)
        this.InitBar(data.classes);

      }
      //this.InitBar(this.wenshuNum)

    },
    async getBar1(){
      this.showModal=true;
      var formdata = new FormData();
      formdata.append(
        'pathIn','/Users/dingyujie/PycharmProjects/yolov5/data/video/test.mp4'
      )
      formdata.append(
        'pathOut','/Users/dingyujie/PycharmProjects/yolov5/data/video/videoimg'
      )
      var data = (await getAnalyseRes(formdata)).data;

      if(data.status==='success'){
        this.showModal=false;
        this.videoInfo=data.videoInfo[0];
        this.result = data.result;

        //  alert(this.result)
        this.InitBar(data.classes);

      }
      //this.InitBar(this.wenshuNum)

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
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: data
          }]
      };
      myChart.setOption(option)

    }

  }

}
</script>

<style scoped>
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
.mask {
  background-color: rgb(0, 0, 0);
  opacity: 0.3;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1
}
.mask-text{
  color: #409eff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -150px;
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
