<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider class="sider" hide-trigger>
          <SideMenu v-bind:openNames="['6']" v-bind:activeName="'6-1'"/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a style="color:#2d8cf0">视频审核</a></el-breadcrumb-item>

            </el-breadcrumb>
            <Menu mode="horizontal"  :active-name="activeName" style="z-index: 0">
              <MenuItem name="1"  @click.native="getAllVideoToAudit" >

                  <Icon type="ios-paper" />

                  待审核

              </MenuItem>
              <MenuItem name="2" @click.native="getPublished2Video " >
                <Icon type="ios-people" />
                已审核
              </MenuItem>
            </Menu>

            <el-table
              :data="tableData.slice((curPage-1)*pageSize,curPage*pageSize)"
              style="width: 100%;margin-top: 10px;z-index: 0"
            >
              <el-table-column
                fixed
                prop="title"
                align="center"
                label="标题"
                width="200"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="picture"
                label="封面"
                width="100">
                <template slot-scope="scope">
                  <img :src="scope.row.picture" style="height:40px">
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="author"
                label="上传人"
                width="150">
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                :formatter="dateFormat"
                align="center"
                width="150">
              </el-table-column>
              <el-table-column
                prop="description"
                align="center"
                label="简介"
                width="250">
              </el-table-column>
              <el-table-column
                prop="tag"
                align="center"
                label="类型"
                width="100">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button v-if="scope.row.publish==1"
                    @click.native.prevent="getRow(scope.$index,scope.row,0)"
                    type="text"
                    size="small">
                    拒绝
                  </el-button>
                  <el-button v-else
                             @click.native.prevent="getRow(scope.$index,scope.row,0)"
                             type="text"
                             size="small">
                    取消通过
                  </el-button>
                  <el-button v-if="scope.row.publish==1"
                             @click.native.prevent="getRow(scope.$index,scope.row,1)"
                             type="text"
                             size="small">
                    通过
                  </el-button>

                  <el-button
                    @click.native.prevent="getRow(scope.$index,scope.row,2)"
                    type="text"
                    size="small">
                    预览
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <!--                <span class="demonstration">页数较少时的效果</span>-->
              <el-pagination
                :current-page="curPage"
                :page-size ="pageSize"
                :total ="total"
                style="padding:30px 0; text-align:center;"
                layout="total,prev,pager,next,jumper"
                @current-change="handleCurrentChange">
              </el-pagination>
            </div>

            <!--            上传视频-->
            <Modal
              v-model="modal2"
              title="视频预览"
              @on-cancel="cancel"
              @on-ok = "cancel"
            >
              <video style="width: 475px" :src="videoInfo.url" ref="vueMiniPlayer" controls='controls' autoplay>
              </video>
            </Modal>

            <div class="loading" v-if="loading" >
              <h4 class="tips">{{tips}}</h4>
              <!--进度条-->
              <el-progress type="line" :percentage="percentage" class="progress" :show-text="true"></el-progress>
            </div>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>

//import SideMenu from "@/components/SideMenu";
import moment from 'moment'
import HeadMenu from "../admin/HeadMenu";
import SideMenu from "../admin/SideMenu";


import {
  setPublish,
  uploadVideoToServer,
  getVideoByColumn, editVideo, editPicture, addVideo, deleteVideo, getAllVideoByColumn,
  setUp, setDown, getAllVideoToAudit, getPublished2Video, getTagList
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      activeName:1,
      whetherShow:1,
      loading:false,
      percentage:0,
      columnName:'',
      tips:'',
      url:"http://10.10.22.106/v1/uploadVideo",
      radio:'1',
      modal1: false,
      modal2:false,
      // modal3: false,
      modal4:false,
      modal5:false,
      modal6:false,
      username:'',
      columnId:'',
      curPage:1,
      pageSize:6,
      total:0,
      searchTitle:'',
      typeList:[{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
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
        tag:'',

      }],
      columnAdd: {
        name:'',
        description:'',
        picture:'',
      },
      columnEdit: {
        collectionId:'',
        name:'',
        picture:'',
        description:'',
      },
      TypeInfo: {
        typeName:'',
      },
      videoAdd:{
        file:'',
        title:'',
        collectionId: '',
        description:''
      },
      tagInfo: {
        id:'',
        tag: '',
      },
      videoInfo: {
        id:'',
        title:'',
        description:'',
        picture:'',
        url:'',
        type:'',
      },
      typeInfo:{
        typeName:'',
        typeId:'',
      },
      videoUpload:{
        title:'',
        collectionId:'',
        description:'',
        picture:'',
        file:'',
        type:''
      },
      videoEdit:{
        id:'',
        title:'',
        description:'',
        picture:'',
        file:'',
        type:''
      },

      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        picture: [
          { required: true,message: '请上传图片',  trigger: 'change' }
        ],

      },
      videoPublish:{
        tag:'',
        videoId:'',
        publish:'',
      },
      type:this.$route.query.id,
      value:true,
      uping:false
    }
  },
  methods: {
    cancel(){
      this.$Message.info("关闭预览");
    },


    //时间戳格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm");
    },


    getRow(index, rows,val) {
      var tagid=''
      for(var i in this.tagInfo){
        // alert(this.tagInfo[i])
        if(this.tagInfo[i]["tag"] == rows.tag){
          tagid = this.tagInfo[i]["id"]
        }
      }
      if(val===0){
        //拒绝
        this.undoSetPublish(rows.id,3,tagid)
        // this.videoInfo.type = rows.type;
      }else if(val===2){
        this.modal2=true;
        this.videoInfo.id=rows.id;
        this.videoInfo.url=rows.url;
      }else if (val === 1){
        //通过
        this.setPublish(rows.id,2,tagid)
      }
    },
    async setPublish(id,isPublish,tag){

      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId', id);
      formdata.append('publish',isPublish);
      formdata.append('tag',tag);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.getAllVideoToAudit();
      }else{
        this.$message.error("发布失败！");
      }
    },
    async undoSetPublish(id,isPublish,tag){
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId', id);
      formdata.append('publish',isPublish);
      formdata.append('tag',tag);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("拒绝成功！");
        this.getAudit();
      }else{
        this.$message.error("发布失败！");
      }
    },
    async getTagList(){
      var data  = (await(getTagList())).data;
      if(data.status===200){
        this.tagInfo = data.data.tagList;
      }else{
        this.$message.error("删除失败")}
    },


    handleCurrentChange(newPage) {
      // 页码改变触发
      alert(newPage)
      this.curPage = newPage
    },

    async getAllVideoToAudit(){
      var data = (await (getAllVideoToAudit(this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
        this.total = data.data.total;
      }
    },
    // getPublished2Video
    async getPublished2Video(){
      var data = (await (getPublished2Video(this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.whetherShow = 0
        this.tableData = data.data.videoList;
        this.total = data.data.total;
        // console.log(this.tableData)
      }
    },
    backtolast(){
      this.$router.go(-1);
    },



  },




  mounted() {
    this.username = localStorage.getItem("username");
    this.columnId = this.$route.query.id
    this.columnName = this.$route.query.name
    this.getAllVideoToAudit();
    this.getTagList();



  }
}
</script>

<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.uploadfile{
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
.loading{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0.8;
  z-index: 4;
}
.progress{
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
.tips{
  color: #409eff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -150px;
}

.sider{
  background: #fff;
  margin:0 0 0;
  position:fixed;
  height: 100%;
  bottom:0;
  top:64px;
  overflow: auto;
}

</style>
