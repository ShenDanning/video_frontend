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
              <el-breadcrumb-item ><a @click="backtolast" style="color:#2d8cf0">我的专栏</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{ columnName }}</el-breadcrumb-item>

            </el-breadcrumb>
            <Row style="margin-top:30px">
              <Col span="24">
                <Button type="primary"  icon="md-add" style="float: left"
                        @click.native.prevent="addShow()"
                >上传视频</Button>

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
              style="width: 100%;margin-top: 10px"

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
                width="250">
              </el-table-column>
              <el-table-column
                align="center"
                label="发布状态"
                width="100"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.publish"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="2"
                    :inactive-value="0"
                    @change="changeSwitch(scope.row,scope.$index)"
                  >
                  </el-switch>

                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="排序"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-arrow-up" circle size="mini" @click="up(scope.row.id)"></el-button>
                  <el-button type="info" icon="el-icon-arrow-down" circle size="mini" @click="down(scope.row.id)"></el-button>
                </template>


              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index,scope.row)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                  <el-button
                    @click.native.prevent="getRow(scope.$index,scope.row,1)"
                    type="text"
                    size="small">
                    编辑
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
              @on-cancel="cancel3"
              @on-ok = "cancel3"
            >
              <video style="width: 475px" :src="videoInfo.url" ref="vueMiniPlayer" controls='controls' autoplay>
              </video>
            </Modal>
            <Modal
              v-model="modal3"
              title="视频上传"
              @on-ok="submitUpload('videoUpload')"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="videoUpload" :rules="rules" class="demo-ruleForm" ref="videoUpload">
                <el-form-item label="视频标题" prop="title" >
                  <el-input v-model="videoUpload.title"   placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="视频简介">
                  <el-input  type="textarea" placeholder="请输入简介" :autosize="{ minRows: 3, maxRows: 10}" v-model="videoUpload.description"></el-input>
                </el-form-item>
                <el-form-item label="视频" prop="file">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    :before-upload="beforeUpload"
                    drag
                    action="#"
                    :auto-upload="false"
                    accept=".mp4,.avi"
                    :on-exceed="handleExceed"
                    v-model="uploadVideo.file"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
                    <div slot="tip" class="el-upload__tip">只能上传mp4/avi文件，且不超过1000M，注意：上传avi时处理时间较长</div>
                  </el-upload>

                </el-form-item>
              </el-form>
            </Modal>
            <Modal
              v-model="modal1"
              title="编辑视频"
              @on-ok="editVideo"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="columnEdit" :rules="rules" class="demo-ruleForm" ref="columnEdit">
                <el-form-item label="视频名称" prop="title" >
                  <el-input v-model="videoEdit.title"   :placeholder="videoEdit.title" ></el-input>
                </el-form-item>
                <el-form-item label="视频简介">
                  <el-input  type="textarea" :placeholder="videoEdit.description" :autosize="{ minRows: 3, maxRows: 10}" v-model="videoEdit.description"></el-input>
                </el-form-item>


              </el-form>
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
import HeadMenu from "./HeadMenu";
import SideMenu from "./SideMenu";


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
    changeSwitch(row,index){
      if(row.publish===0){
        this.undoSetPublish(row.id);
      }else{
        this.setPublish(row.id)
      }
    },
    async setPublish(id){
      this.videoPublish.publish = 1;
      this.videoPublish.tag = this.tagInfo.id
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId', id);
      formdata.append('publish',2);
      formdata.append('tag',-1);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("发布成功！");
        this.getVideoByColumn()
      }else{
        this.$message.error("发布失败！");
      }
    },
    async undoSetPublish(id){
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId',id);
      formdata.append('publish',-1);
      formdata.append('tag',-1);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("取消发布成功");
        this.getVideoByColumn()
        // this.getAllVideo(1);
      }else{
        this.$message.error("取消发布失败");
      }
    },
    async beforeUpload(file){
      this.loading = true;
      this.tips = '正在上传中……';
      this.uping = true;
      let fileSize = Number(file.size / 1024 / 1024);
      if (fileSize > 1000) {
        this.$Message.warning("不能超过1000M")
      }

      this.videoUpload.file = file;
      let formdata = new FormData();
      formdata.append('file', this.videoUpload.file);
      formdata.append('title',this.videoUpload.title);
      formdata.append('description',this.videoUpload.description);
      formdata.append('collectionId',this.columnId);
      let config = {
        onUploadProgress: progressEvent => {
          //progressEvent.loaded:已上传文件大小
          //progressEvent.total:被上传文件的总大小
          let complete = (progressEvent.loaded / progressEvent.total ).toFixed(1) * 100 ;
          this.percentage = complete;
          if (this.percentage >= 100){
            this.tips = "正在处理视频。。。"

          }
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      var data =(await addVideo(formdata,config)).data;
      if(data.status===200){
        this.$Message.destroy();
        this.loading = false;
        this.tips="正在上传视频。。。"
        this.$Message.success(data.msg);
        this.searchTree(this.columnId);
      }else{
        this.$message.error("Fail");
      }
    },
    submitUpload(formName){
      //alert(this.videoUpload.file)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
          if(this.uping===false){
            this.$Message.warning("请上传视频")
            this.uping=false;
          }
        } else {
          this.$Message.warning("请填写完整信息")
        }
      });
    },
    ensure(){
      this.dialogVisible = false;
      this.loading = false;
    },
    loading1 () {
      const msg = this.$Message.loading({
        content: '正在处理，请稍等',
        duration: 0
      });
    },

    cancel3(){
      this.$refs.vueMiniPlayer.pause();
      // this.videoInfo.url.clear()
      this.$Message.info('已取消');
    },

    ok () {
      this.editRow();
      console.log(this.videoInfo);
    },

    async editPicture(){
      var formdata = new FormData();
      //alert(this.videoInfo.id)
      formdata.append('file', this.videoEdit.picture.file);
      formdata.append('videoId',this.videoEdit.id);
      var data =(await editPicture(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        location.reload();
      }else{
        this.$message.error("Fail");
      }
    },
    async editVideo(){
      var formdata = new FormData();
      // if(this.videoEdit.picture.file!=null){
      //   this.editPicture()
      // }
      formdata.append('title',this.videoEdit.title);
      formdata.append('description',this.videoEdit.description);
      formdata.append('videoId',this.videoEdit.id);
      formdata.append('type','0');
      var data =(await editVideo(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        // location.reload();
        this.searchTree(this.columnId)

      }else{
        this.$message.error("Fail");
      }

    },

    async uploadVideo(){
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('file', this.videoUpload.file.file);
      formdata.append('title',this.videoUpload.title);
      formdata.append('description',this.videoUpload.description);
      formdata.append('picture',this.videoUpload.picture.file);
      formdata.append('typeId',this.videoUpload.type);

      var data =(await uploadVideoToServer(formdata)).data;
      if(data.status===200){
        this.$Message.destroy();
        this.$Message.success(data.msg);
        this.getAllVideo(1);
        this.ensure();
      }else{
        this.$message.error("Fail");
      }
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


    deleteRow(index,rows) {
      this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteVideo(rows.id);
        this.searchTree(this.columnId);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteVideo(videoId){
      var data  = (await(deleteVideo(videoId))).data;
      if(data.status===200){
        this.$message.success("删除成功")
        this.getAllVideo(1)
      }else{
        this.$message.error("删除失败")}
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
