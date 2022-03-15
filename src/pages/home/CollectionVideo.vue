<template>
  <Layout  >
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
    <Content :style="{padding: '24px',margin: '88px 8% 20px', minHeight: '350px', background: '#fff'}">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{curCollection}}</el-breadcrumb-item>

      </el-breadcrumb>
      <Row type="flex"  align="top" class="code-row-bg" style="margin-top: 20px">
        <Col span="9" >
            <img :src="picture" style="width: 100%;height: 280px;border-radius:10px">
        </Col>
        <Col span="14" offset="1" style="text-align: left">
          <h2>{{curCollection}}</h2>
          <el-card class="box-card" shadow="never" style="margin-top: 20px;padding:0;background-color: #f8f9fb">
            <div style="overflow: auto;max-height: 160px">
              简介：{{description}}
            </div>
            <br>
          </el-card>
        </Col>
      </Row>
      <div v-if="videoInfo.length==0">
        <el-empty description="没有相关视频"></el-empty>
      </div>

      <Row style="margin-top: 20px" v-else>
          <Col :span="6" style="padding: 5px; padding-bottom: 10px;" v-for="item in videoInfo" :key="item.id">
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
          @current-change="getVideos">
        </el-pagination>
      </div>


    </Content>
  </Layout>
</template>

<script>
import {getVideoByColumn} from "../../api/api";
import moment from "moment";

export default {
  name: "CollectionVideo",
  data(){
    return{
      curPage:1,
      pageSize:8,
      total:0,
      username:"未登录",
      curCollection:'',
      collectionId:'',
      picture:'',
      videoInfo:[],
      back: {
        backgroundSize: "100% 100%",
        height: "100%",
        position: "fixed",
        width: "100%",
      },
    }
  },
  methods:{
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    async getVideos(val){

      if(val){
        this.curPage=val;
      }
      var data = (await (getVideoByColumn(this.collectionId,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.total = data.data.total;
        this.videoInfo = data.data.videoList;

      }
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
  },
  mounted() {
    this.username = localStorage.getItem("username");
   // alert(this.$route.query.name)
    let collectionInfo=JSON.parse(localStorage.getItem("collectionInfo"));
    //collectionInfo = localStorage.getItem("collectionInfo")
    this.curCollection =  collectionInfo.name;
    this.picture = collectionInfo.picture;
    this.description = collectionInfo.description;
    this.collectionId = collectionInfo.id;
    this.getVideos();

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
</style>
