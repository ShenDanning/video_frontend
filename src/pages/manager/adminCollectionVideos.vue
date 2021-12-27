<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger class="sider">
          <SideMenu v-bind:openNames="['6']" v-bind:activeName="'1'"/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">专栏审核</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{ columnName }}</el-breadcrumb-item>

            </el-breadcrumb>

            <el-table
              :data="tableData.slice((curPage-1)*pageSize,curPage*pageSize)"
              style="width: 100%;margin-top: 40px"

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
                prop="views"
                label="播放量"
                width="70">
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                :formatter="dateFormat"
                align="center"
                width="140">
              </el-table-column>
              <el-table-column
                prop="description"
                align="center"
                label="简介"
               >
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
  getVideoByColumn, editVideo, editPicture, addVideo, deleteVideo, getAllVideoByColumn,
  setUp, setDown, getPersonalVideoByTitle
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      activeName:'5',

      columnName:'',
      tips:'',

      radio:'1',

      modal2:false,

      username:'',
      columnId:'',
      curPage:1,
      pageSize:6,
      total:0,

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


      videoInfo: {
        id:'',
        title:'',
        description:'',
        picture:'',
        url:'',
        type:'',
      },
      value:true,

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
      if(val===1){
        this.modal1=true;
        // this.videoEdit.collectionId=rows.id;
        this.videoEdit.type = rows.type;
        this.videoEdit.id = rows.id;
        this.videoEdit.title = rows.title;
        this.videoEdit.picture = rows.picture;
        this.videoEdit.description = rows.description;
        // this.videoInfo.type = rows.type;
      }else if(val===2){
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
      var data = (await (getAllVideoByColumn(this.columnId))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
        this.total = data.data.total;
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
