<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger class="sider">
          <SideMenu v-bind:openNames="openNames" v-bind:activeName="activeName"/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a  style="color:#2d8cf0">专栏审核</a></el-breadcrumb-item>

            </el-breadcrumb>
            <Menu mode="horizontal"  active-name="1" style="z-index: 0">
              <MenuItem name="1"  @click.native="getAudit">
                <Icon type="ios-paper" />
                待审核
              </MenuItem>
              <MenuItem name="2" @click.native="getPublishedAudit" style="z-index: 0">
                <Icon type="ios-people" />
                已审核
              </MenuItem>
            </Menu>

            <el-table
              v-show = "audit"
              :data="tableData.slice((curPage-1)*pageSize,curPage*pageSize)"
              style="width: 100%;margin-top: 10px;z-index: 0"
            >
              <el-table-column
                fixed
                prop="name"
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
                prop="createdTime"
                label="创建时间"
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
                prop="videos"
                align="center"
                label="视频数"
                width="70">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                             @click.native.prevent="getRow(scope.$index,scope.row,0)"
                             type="text"
                             size="small">
                    拒绝
                  </el-button>
                  <el-button
                             @click.native.prevent="getRow(scope.$index,scope.row,1)"
                             type="text"
                             size="small">
                    通过
                  </el-button>

                  <el-button
                    @click.native.prevent="GoTo(scope.row)"
                    type="text"
                    size="small">
                    查看专栏
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-show = "auditPublished"
              :data="tableData.slice((curPage-1)*pageSize,curPage*pageSize)"
              style="width: 100%;margin-top: 10px"
            >
              <el-table-column
                fixed
                prop="name"
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
                prop="createdTime"
                label="创建时间"
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
                prop="videos"
                align="center"
                label="视频数"
                width="70">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="getRow(scope.$index,scope.row,0)"
                    type="text"
                    size="small">
                    取消通过
                  </el-button>
                  <el-button
                    @click.native.prevent="GoTo(scope.row)"
                    type="text"
                    size="small">
                    查看专栏
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
   getTagList,getPublishedAudit,getAudit,columnPublish
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      openNames:['6'],
      activeName:'6-2',
      audit:false,
      auditPublished:false,
      loading:false,
      percentage:0,
      columnName:'',
      tips:'',
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
      tableData: [{
        author:'',
        name:'',
        description:'',
        createdTime:'',
        videos:'',
        id:'',
        picture:'',
      }],
      columnPublish:{
        // tag:'',
        columnId:'',
        publish:'',
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

    //时间戳格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    async setPublish(id){
      // this.columnPublish.publish = 2;
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('collectionId', id);
      formdata.append('publish','2');
      var data =(await columnPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.getAudit()
      }else{
        this.$message.error(data.msg);
      }
    },
    async undoSetPublish(id){
      // this.columnPublish.publish = 2;
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('collectionId', id);
      formdata.append('publish','3');
      var data =(await columnPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("拒绝成功！");
        this.getAudit();
      }else{
        this.$message.error(data.msg);
      }
    },
    GoTo(row){
      // alert(id)
      this.$router.push({
        path: '/adminCollectionVideos',
        query: {
          id: row.id,
          name:row.name
        }
      })
    },

    getRow(index, rows,val) {

      if(val===0){
        //拒绝
        this.undoSetPublish(rows.id)
        // this.getAudit()
      }else if(val===2){
        this.modal2=true;
        this.videoInfo.id=rows.id;
        this.videoInfo.url=rows.url;
      }else if (val === 1){
        //通过
        this.setPublish(rows.id)
        // this.getAudit()
        // this.videoInfo.id=rows.id;
        // this.modal4 = true
      }
    },



    handleCurrentChange(newPage) {
      // 页码改变触发
      alert(newPage)
      this.curPage = newPage
    },

    async getAudit(){
      this.audit = true
      this.auditPublished = false
      var data = (await (getAudit(this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.collectionsList;
        this.total = data.data.total;
        this.whetherShow = 1;
      }
    },
    // getPublishedAudit
    async getPublishedAudit(){
      this.auditPublished = true
      this.audit = false
      var data = (await (getPublishedAudit(this.curPage,this.pageSize))).data;
      if(data.status === 200){
        // this.whetherShow = 0
        this.tableData = data.data.collectionsList;
        this.total = data.data.total;
        this.whetherShow = 0;
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
    this.getAudit();
   // this.getTagList();



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
