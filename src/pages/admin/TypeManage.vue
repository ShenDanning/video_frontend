<template>
  <div class="layout">
    <Layout :style="back">
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff',margin:'64px 0 0',position:'fixed',height: '100%'}">
          <SideMenu/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content  :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <Row>
              <Button type="primary"  icon="ios-construct" style="float: left"
                      @click.native.prevent="typeShow()"
              >添加分类</Button>
            </Row>
            <Row style="height: 20px"></Row>

              <el-table
                :data="tableData"
                style="width: 100%;">
<!--                <el-table-column-->
<!--                  label="分类号"-->
<!--                  width="180"-->
<!--                  align="center"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                    &lt;!&ndash;                  <i class="el-icon-time"></i>&ndash;&gt;-->
<!--                    <span style="margin-left: 10px">{{ scope.row.id }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
                <el-table-column
                  label="分类名"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="创建人"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <!--                  <i class="el-icon-time"></i>-->
                    <span style="margin-left: 10px">{{ scope.row.author }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="getRow(scope.$index,scope.row,1)"
                      size="mini">
                      编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click.native.prevent="deleteRow(scope.$index,scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

<!--            <div class="block">-->
<!--              &lt;!&ndash;                <span class="demonstration">页数较少时的效果</span>&ndash;&gt;-->
<!--              <el-pagination-->
<!--                :current-page="curPage"-->
<!--                :page-size ="pageSize"-->
<!--                :total ="total"-->
<!--                style="padding:30px 0; text-align:center;"-->
<!--                layout="total,prev,pager,next,jumper"-->
<!--                @current-change="searchTree">-->
<!--              </el-pagination>-->
<!--            </div>-->

            <Modal
              v-model="modal1"
              title="编辑分类信息"
              @on-ok="ok"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="typeInfo">
                <el-form-item label="分类名">
                  <el-input v-model="typeInfo.typeName"></el-input>
                </el-form-item>
              </el-form>
            </Modal>
            <Modal
              v-model="modal5"
              title="分类信息"
              @on-ok="ok5"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="TypeInfo">
                <el-form-item label="分类名">
                  <el-input v-model="typeInfo.typeName"></el-input>
                </el-form-item>
              </el-form>
            </Modal>

</Content>
        </Layout>
      </Layout>
    </Layout>
  </div>



</template>

<script>
import Vue from 'vue'
import 'video.js/dist/video-js.css'
import axios from 'axios';
import HeadMenu from "../admin/HeadMenu";
import SideMenu from "../admin/SideMenu";
import {editPicture, getTypeList, getVideoByType, editType, deleteType, deleteVideo, addType} from "../../api/api";
import moment from "moment";
import VideoList from "../Videos/videoList";

Vue.prototype.$axios = axios;
export default {
  components: {VideoList, SideMenu, HeadMenu},
  data() {
    return {
      currentVideo:'',
      tableData:[{
        type:'',
        id:'',
        author:''
      }],
      typeInfo:{
        typeName:'',
        typeId:'',
      },
      typeList:[],

      curPage:1,
      pageSize:8,
      total:0,
      videoInfo:[],
      activeIndex:'0',
      searchTitle:'',
      username:'',
      modal1:false,
      modal2:false,
      modal5:false
    }
  },
  mounted() {
    this.username = localStorage.getItem("username")
    this.getTypeList()
    // this.showVideoByType(1,0);
    // this.getTypeList();
  },
  computed: {
    // player() {
    //   return this.$refs.videoPlayer.player
    // },
  },
  methods: {
    typeShow(){
      this.modal5 = true
    },
    ok5(){
      this.addType()
    },
    async addType(){
      var data = (await (addType(this.typeInfo.typeName))).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        await this.getTypeList();
        // alert("添加成功")
      }else{
        this.$message.error("Fail");
      }
    },
    getRow(index, rows,val) {
      if(val===1){
        this.modal1=true;
        this.typeInfo.typeId = rows.id;
        this.typeInfo.typeName = rows.type;
        // alert(this.typeInfo.typeId + this.typeInfo.typeName)
      }else if(val===2) {
        this.modal2 = true;
        this.typeInfo.typeId = rows.id;
        this.typeInfo.typeName = rows.type;
      }
    },
    deleteRow(index,rows) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteType(rows.id);

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteType(typeId){
      var data  = (await(deleteType(typeId))).data;
      if(data.status===200){
        this.$message.success("删除成功")
        await this.getTypeList();
      }else{
        this.$message.error("删除失败")}
    },


    ok(){
      this.editType()
    },
    async editType(){
      var formdata = new FormData();
      // alert(this.videoInfo.picture)
      formdata.append('typeId', this.typeInfo.typeId);
      formdata.append('typeName',this.typeInfo.typeName);
      var data =(await editType(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        location.reload();
      }else{
        this.$message.error("Fail");
      }
    },
    dateFormat(date) {

      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // openURL(item){
    //
    //   this.$router.push({name:'videoSquare',
    //     query:{
    //       url: item.url,
    //       id: item.id,
    //       title: item.title,
    //       description:item.description,
    //       author:item.author,
    //       uploadTime:item.uploadTime,
    //       type:item.type
    //     }})
    //
    // },
    async changePage(val){
      if(val){
        this.curPage = val;
      }
    },

    async getTypeList(){
      var data = (await(getTypeList())).data;
      if(data.status === 200){
        this.tableData = data.data.typeList;
        this.total = data.data.typeList.length;
        // console.log(data.data.typeList)
      }
    },

    // searchVideo(key){
    //   this.showVideoByType(1)
    // },

    // async showVideoByType(val){
    //
    //   if(val){
    //     this.curPage = val;
    //   }
    //   // alert(this.activeIndex)
    //   var typeId=this.activeIndex;
    //   var data = (await (getVideoByType(this.searchTitle,typeId,this.curPage,this.pageSize))).data;
    //   if(data.status === 200){
    //     this.videoInfo = data.data.videoList;
    //
    //     this.total = data.data.total;
    //   }
    //   this.searchTitle=''
    //
    // },

    // SelectType(key){
    //   if(key!=-1){
    //     this.activeIndex=key;
    //   }
    //   this.showVideoByType(1)
    // },
    // onPlayerPause($event) {
    //   this.isPlay = false;
    // },
    // onPlayerPlay($event) {
    //   this.isPlay = true;
    // },
    // onPlayerEnded($event) {},
    // onPlayerClick() {
    //   if (this.isPlay) {
    //     this.player.pause();
    //   } else {
    //     this.player.play();
    //   }
    // },
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
