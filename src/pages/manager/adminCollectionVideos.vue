<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff',margin:'64px 0 0',position:'fixed',height: '100%'}">
          <SideMenu/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">专栏审核</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{ columnName }}</el-breadcrumb-item>

            </el-breadcrumb>
            <Row style="margin-top:30px">
              <Col span="24">

                <Input
                  v-model="searchTitle"
                  :search="true"
                  suffix="ios-search"
                  placeholder="请输入视频标题"
                  style="width: auto;float: right"
                  @on-search="searchTree" />
              </Col>
            </Row>
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
                fixed="right"
                label="操作"
                width="200"
                align="center"
              >
                <template slot-scope="scope">

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
            <Modal
              v-model="modal2"
              title="视频预览"
              @on-cancel="cancel3"
              @on-ok = "cancel3"
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
  addType,
  setPublish,
  getTypeList, getVideoByType,
  uploadVideoToServer,
  editVideo, editPicture, addVideo, deleteVideo, getAllVideoByColumn,
  setUp,setDown
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      loading:false,
      percentage:0,
      columnName:'',
      tips:'',
      url:"http://10.10.22.106/v1/uploadVideo",
      radio:'1',
      modal1: false,
      modal2:false,
      modal3: false,
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

    cancel3(){
      this.$refs.vueMiniPlayer.pause();
      // this.videoInfo.url.clear()
      this.$Message.info('已取消');
    },

    cancel () {
      this.$Message.info('已取消');
    },
    //时间戳格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm");
    },


    //保存图片到后台
    async imgAdd($file){

      this.columnEdit.picture = $file;
      this.columnAdd.picture = $file;
    },

    addShow(){
      this.modal3 = true
    },

    getRow(index, rows,val) {
      if(val===2){
        this.modal2=true;
        this.videoInfo.id=rows.id;
        this.videoInfo.url=rows.url;
      }else if (val === 4){
        this.videoInfo.id=rows.id;
        this.modal4 = true
      }
    },

    searchTree(val){
      this.getVideoByColumn();
    },
    handleCurrentChange(newPage) {
      // 页码改变触发
      alert(newPage)
      this.curPage = newPage
    },

    async getVideoByColumn(){
      var data = (await (getVideoByCollectionId(this.columnId,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
        this.total = data.data.total;
      }
    },
    backtolast(){
      this.$router.go(-1);
    },
    async setup(id){
      var data = (await (setUp(id))).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.searchTree()
      }else{
        this.$message.error(data.msg);
        this.searchTree()
      }
    },
    async setdown(id){
      var data = (await (setDown(id))).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.searchTree()
      }else{
        this.$message.error(data.msg);
        this.searchTree()
      }
    },
    up(id){
      this.setup(id)
    },
    down(id){
      // alert("下移")
      this.setdown(id)
    },


  },



  beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${ file.name }？`);
  },

  mounted() {
    this.username = localStorage.getItem("username");
    this.columnId = this.$route.query.id
    this.columnName = this.$route.query.name
    this.getVideoByColumn();



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
</style>
