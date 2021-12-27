<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger class="sider">
          <SideMenu v-bind:activeName="activeName " v-bind:openNames="['2']"/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px',top:'64px', minHeight: '800px', background: '#fff'}">

            <Row>
              <Col span="24">
                <Button type="primary"  icon="md-add" style="float: left;margin-right: 10px"
                        @click.native.prevent="uploadShow()"
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
              :data="tableData"
              style="width: 100%;margin-top: 10px"
            >
              <el-table-column
                fixed
                prop="title"
                label="标题"
                width="160"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="picture"
                label="封面"
                width="100">
                <template slot-scope="scope">
                  <img :src="scope.row.picture" style="height:40px" @click="getRow(scope.$index,scope.row,4)">
                </template>
              </el-table-column>

              <!--              <el-table-column-->
              <!--                prop="description"-->
              <!--                label="简介"-->
              <!--                width="300"-->
              <!--                show-overflow-tooltip>-->
              <!--              </el-table-column>-->
              <el-table-column
                align="center"
                label="发布状态"
                width="180"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.publish =='1'">审核中</el-tag>

                  <div  v-else-if="scope.row.publish =='3'" >
                   <el-tag type="danger">未通过</el-tag>
                  </div>

                  <el-switch
                    v-else
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
                label="发布的类型"
                width="100">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="我的分类"
                width="100">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.type }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="views"
                label="播放量"
                width="100">
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                :formatter="dateFormat"
                align="center"
                width="150">
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
                @current-change="getAllVideo">
              </el-pagination>
            </div>

            <Modal
              v-model="modal1"
              title="编辑视频信息"
              @on-ok="ok"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="videoInfo">
                <!--                <template slot-scope="scope">-->
                <el-form-item label="视频标题">
                  <el-input v-model="videoInfo.title" :placeholder="videoInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="视频简介">
                  <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="videoInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="视频封面">
                  <el-upload
                    class="upload-demo"
                    drag
                    action="#"
                    multiple
                    :limit="1"
                    :http-request="imgAdd"
                    v-model="videoInfo.picture"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传图片文件</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="视频分类">
                  <el-select v-model="videoInfo.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.type"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--                </template>-->
              </el-form>
            </Modal>
            <Modal
              v-model="modal2"
              title="视频预览"
              @on-cancel="cancel"
              @on-ok = "cancel"
            >
              <video style="width: 475px" :src="videoInfo.url" ref="vueMiniPlayer" controls='controls' autoplay>
              </video>
            </Modal>
<!--            上传视频-->
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
                <el-form-item label="视频分类">
                  <el-select v-model="videoUpload.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.type"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-link icon="el-icon-plus" style="float: right" @click.native.prevent="typeShow()">没有分类？点击添加！</el-link>
                </el-form-item>

                <el-form-item label="视频封面" prop="picture">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    multiple
                    :http-request="imgAdd"
                    :limit="1"
                    accept=".png,.jpg"
                    v-model="uploadVideo.picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
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
            <div class="loading" v-if="loading" >
              <h4 class="tips">{{tips}}</h4>
              <!--进度条-->
              <el-progress type="line" :percentage="percentage" class="progress" :show-text="true"></el-progress>
            </div>
            <Modal
              v-model="modal4"
              title="编辑视频"
              @on-ok="ok4"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="videoInfo">
                <el-form-item label="视频封面">
                  <el-upload
                    class="upload-demo"
                    drag
                    action="#"
                    multiple
                    :limit="1"
                    :http-request="imgAdd"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传图片文件</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </Modal>
            <Modal
              v-model="modal5"
              title="请选择一个标签"
              @on-ok="ok5"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="tagInfo">
                <el-form-item label="标签名">
                  <el-select v-model="tagInfo.id" placeholder="请选择">
                    <el-option
                      v-for="item in tagInfo"
                      :key="item.id"
                      :label="item.tag"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </Modal>
            <Modal
              v-model="modal6"
              title="添加分类"
              @on-ok="ok6"
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

//import SideMenu from "@/components/SideMenu";
import moment from 'moment'
import HeadMenu from "./HeadMenu";
import SideMenu from "./SideMenu";


import {
  addType,
  setPublish,
  deleteVideo,
  editPicture,
  editVideo,
  getTagList,
  getPersonalVideoByTitle, getTypeList, getVideoByType,
  uploadVideoToServer
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},
  //components:{ Menu},

  data(){

    return{
      loading:false,
      percentage:0,
      activeName:'2',
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
        views:''
      }],
      videoInfo: {
        id:'',
        title:'',
        description:'',
        picture:'',
        url:'',
        type:'',
      },
      TypeInfo: {
        typeName:'',
      },
      tagInfo: {
        id:'',
        tag: '',
      },
      typeInfo:{
        typeName:'',
        typeId:'',
      },
      videoUpload:{
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
    typeManage(){

      this.$router.push('/TypeManage');
    },

    async beforeUpload(file){
      this.loading = true;
      this.tips = '正在上传中。。。';
      this.uping = true;
      let fileSize = Number(file.size / 1024 / 1024);
      if (fileSize > 1000) {
        this.$Message.warning("不能超过1000M")
      }

      this.videoUpload.file = file;
      let formdata = new FormData();
      //  if(this.videoUpload.file==""||this.videoUpload.title==""||)
      formdata.append('file', this.videoUpload.file);
      formdata.append('title',this.videoUpload.title);
      formdata.append('description',this.videoUpload.description);
      formdata.append('picture',this.videoUpload.picture.file);
      formdata.append('typeId',this.videoUpload.type);
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
      var data =(await uploadVideoToServer(formdata,config)).data;
      if(data.status===200){
        this.$Message.destroy();
        this.loading=false;
        this.tips="正在上传。。。"
        this.$Message.success(data.msg);
        this.getAllVideo(1);

      }else{
        this.$message.error("Fail");
      }
    },
    handleExceed(){

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
    cancel1(){
      this.$refs.vueMiniPlayer.pause();
      // this.videoInfo.url.clear()
      this.$Message.info('已取消');
    },
    typeShow() {
      this.modal6 = true;
    },
    ok () {
      this.editRow();
      console.log(this.videoInfo);
    },
    ok3() {
      this.uploadVideo();
    },
    ok4(){
      this.editPicture()
    },
    ok5(){
      this.setPublish()
    },
    ok6(){
      this.addType()
    },
    changeSwitch(row,index){

      if(row.publish===0){
        this.undoSetPublish(row);
        // location.reload();x
      }else{
        this.publishRow(index,row)
      }

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
    async setPublish(){
      this.videoPublish.publish = 1;
      this.videoPublish.tag = this.tagInfo.id
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId', this.videoPublish.videoId);
      formdata.append('publish',this.videoPublish.publish);
      formdata.append('tag',this.videoPublish.tag);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("已提交管理员审核！");
        this.getAllVideo();
      }else{
        this.$message.error("发布失败！");
      }
    },
    async undoSetPublish(row){
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('videoId',row.id);
      formdata.append('publish',-1);
      formdata.append('tag',-1);
      var data =(await setPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("取消发布成功");
        // this.getAllVideo(1);
      }else{
        this.$message.error("取消发布失败");
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

    async deleteVideo(videoId){
      var data  = (await(deleteVideo(videoId))).data;
      if(data.status===200){
        this.$message.success("删除成功")
        this.getAllVideo(1)
      }else{
        this.$message.error("删除失败")}
    },
    publishRow(index,rows) {
      this.$confirm('发布后你的视频将所有人可见，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.videoPublish.videoId = rows.id
        // alert(this.videoPublish.videoId)
        this.modal5 = true
        this.getTagList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
        location.reload()
      });
    },
    async getTagList(){
      var data  = (await(getTagList())).data;
      if(data.status===200){
        this.tagInfo = data.data.tagList;
      }else{
        this.$message.error("删除失败")}
    },

    deleteRow(index,rows) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteVideo(rows.id);
        this.getAllVideo();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //保存图片到后台
    async imgAdd($file){
      console.log($file)
      // this.videoInfo.id=rows.id;
      this.videoInfo.picture = $file;
      this.videoUpload.picture = $file;
    },
    async videoAdd($file){
      this.videoUpload.file = $file;
      console.log(this.videoUpload)

    },
    uploadShow(){
      this.modal3 = true

    },
    // typeShow(){
    //   this.modal5 = true
    // },
    // editShow(){
    //   // alert("hahah")
    //   this.modal4 = true
    // },

    getRow(index, rows,val) {
      if(val===1){
        this.modal1=true;
        this.videoInfo.id=rows.id;
        this.videoInfo.title = rows.title;
        this.videoInfo.description = rows.description;
        this.videoInfo.picture = rows.picture;
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
    async editPicture(){
      var formdata = new FormData();
      //alert(this.videoInfo.id)
      formdata.append('file', this.videoInfo.picture.file);
      formdata.append('videoId',this.videoInfo.id);
      var data =(await editPicture(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        location.reload();
      }else{
        this.$message.error("Fail");
      }
    },

    async editRow(){
      var formdata = new FormData();
      //alert(this.videoInfo.type);

      if(this.videoInfo.picture.file!=null){
        this.editPicture()
      }
      formdata.append('title',this.videoInfo.title);
      formdata.append('description',this.videoInfo.description);
      formdata.append('videoId',this.videoInfo.id);
      formdata.append('type',this.videoInfo.type);
      var data =(await editVideo(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        location.reload();

      }else{
        this.$message.error("Fail");
      }

    },

    searchTree(){
      //this.curPage = val
      this.getAllVideo(1)
    },

    async getAllVideo(val){
      if(val){
        this.curPage = val;
      }
      var data = (await (getPersonalVideoByTitle(this.searchTitle,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
        // this.videoInfo = data.data.videoList;
        this.total = data.data.total;
      }
    },
    async getVideoByType(val,type){
      if(val){
        this.curPage = val;
      }
      var data = (await (getVideoByType('',type,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
        // this.videoInfo = data.data.videoList;
        this.total = data.data.total;
      }
    },
    async getTypeList(){
      var data = (await (getTypeList())).data;
      if(data.status === 200){
        // alert(data.data.typeList)
        this.typeList = data.data.typeList;

      }
    },
  },


  beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${ file.name }？`);
  },
  watch: {
    // 监视搜索词变化
    "$route.query.id": {
      immediate: true,
      handler() {
        // this.getAllVideo()
        this.type = this.$route.query.id
        if(this.type){
          //如果type有值，调用getVideoByType
          // alert(this.type)
          this.getVideoByType(1,this.type)
        }else{
          // alert("调用AllVideo方法")
          this.getAllVideo();
          // this.type.clear()
        }
      },
    },
  },


  mounted() {
    this.username = localStorage.getItem("username");
    this.type = this.$route.query.id
    if(this.type){
      //如果type有值，调用getVideoByType
      // alert(this.type)
      this.getVideoByType(1,this.type)
    }else{
      // alert("调用AllVideo方法")
      this.getAllVideo();
      // this.type.clear()
    }
    //获取分类
    this.getTypeList();
    // alert(this.type)


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
