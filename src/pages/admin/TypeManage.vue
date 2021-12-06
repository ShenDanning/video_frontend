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
              <Button type="primary"  icon="ios-construct" style="float: left;margin-left: 20px"
                      @click.native.prevent="typeShow()"
              >添加分类</Button>
            </Row>
            <Row style="height: 20px"></Row>

              <el-table
                :data="tableData"
                style="width: 100%;">
                <el-table-column
                  label="分类号"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <!--                  <i class="el-icon-time"></i>-->
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
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

            <div class="block">
              <!--                <span class="demonstration">页数较少时的效果</span>-->
              <el-pagination
                :current-page="curPage"
                :page-size ="pageSize"
                :total ="total"
                style="padding:30px 0; text-align:center;"
                layout="total,prev,pager,next,jumper"
                @current-change="searchTree">
              </el-pagination>
            </div>

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
            src: '' // 视频流路径
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
      },
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
