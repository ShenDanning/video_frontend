<template>
  <div class="layout">
    <Layout :style="back">
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff',margin:'64px 0 0'}">
          <SideMenu/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0', minHeight: '280px', background: '#fff'}">
            <Row>
              <Col span="24">
                <Button type="primary"  icon="md-add" style="float: left"
                        @click.native.prevent="uploadShow()"
                >上传视频</Button>
<!--                  <Button type="primary"  icon="ios-construct" style="float: left;margin-left: 20px"-->
<!--                          @click.native.prevent="typeShow()"-->
<!--                  >管理分类</Button>-->
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
                prop="fileName"
                label="文件名"
                width="150"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="title"
                label="标题"
                width="200"
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

              <el-table-column
                prop="description"
                label="简介"
                width="300"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                label="是否已发布"
                width="180"
                show-overflow-tooltip>
<!--                <template slot-scope="scope">-->
<!--                  <el-tag size="medium" v-if="scope.row.publish =='1'">已发布</el-tag>-->
<!--                  <el-tag size="medium" v-else>未发布</el-tag>-->
<!--                </template>-->
                <template slot-scope="scope">

                  <el-switch
                    v-model="scope.row.publish"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    @change="changeSwitch(scope.row,scope.$index)"
                  >
                  </el-switch>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="分类"
                width="180">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.type }}</el-tag>
                    </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="author"
                label="上传者"
                width="100">
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                :formatter="dateFormat"
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
                  <el-button
                    @click.native.prevent="publishRow(scope.$index,scope.row)"
                    type="text"
                    size="small">
                    发布
                  </el-button>
<!--                  <el-button-->
<!--                    v-else-->
<!--                    @click.native.prevent="cancelPublishRow(scope.$index,scope.row)"-->
<!--                    type="text"-->
<!--                    size="small">-->
<!--                    取消发布-->
<!--                  </el-button>-->
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
              title="编辑视频信息"
              @on-ok="ok"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="videoInfo">
                <el-form-item label="视频标题">
                  <el-input v-model="videoInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="视频简介">
                  <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="videoInfo.description"></el-input>
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
              </el-form>
            </Modal>
            <Modal
              v-model="modal2"
              title="视频预览"
              @on-cancel="cancel1"
              @on-ok = "cancel1"
            >
              <video style="width: 475px" :src="videoInfo.url" ref="vueMiniPlayer" controls='controls' autoplay>
              </video>
            </Modal>
            <Modal
              v-model="modal3"
              title="视频上传"
              @on-ok="ok3"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="videoUpload">
                <el-form-item label="视频标题">
                  <el-input v-model="videoUpload.title"></el-input>
                </el-form-item>
                <el-form-item label="视频简介">
                  <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="videoUpload.description"></el-input>
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

<!--                <el-form-item label="视频分类">-->
<!--                  <el-select v-model="videoUpload.type" placeholder="请选择"-->
<!--                             filterable-->
<!--                             allow-create-->
<!--                             default-first-option>-->
<!--                    <el-option-->
<!--                      v-for="item in typeList"-->
<!--                      :key="item.id"-->
<!--                      :label="item.type"-->
<!--                      :value="item.id">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="是否公开">-->
<!--                  <el-radio v-model="radio" label="1">公开</el-radio>-->
<!--                  <el-radio v-model="radio" label="2">保密</el-radio>-->
<!--                </el-form-item>-->
                <el-form-item label="视频封面">
                  <el-upload
                  class="upload-demo"
                  action="#"
                  multiple
                  :http-request="imgAdd"
                  :limit="1"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="视频">
                  <el-upload
                    class="upload-demo"
                    drag
                    action="#"
                    multiple
                    :limit="1"
                    :http-request="videoAdd"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </Modal>
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
      radio:'1',
      modal1: false,
      modal2:false,
      modal3: false,
      modal4:false,
      modal5:false,
      modal6:false,
      username:'',
      curPage:1,
      pageSize:10,
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
      back: {
        backgroundSize: "100% 100%",
        height: "100%",
        position: "fixed",
        width: "100%",
      },
      tableData: [{
        id:1,
        fileName: 'text1',
        title: '我的视频',
        picture: '图片url',
        uploadTime: '2021-11-20',
        description: '这是一个视频',
        author: '管理员',
        publish:'0',
      }],
      videoInfo: {
        id:'',
        title:'',
        description:'',
        picture:'',
        url:'',
        type:''
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
      videoPublish:{
        tag:'',
        videoId:'',
        publish:'',
      },
      type:this.$route.query.id,
      value:true
    }
  },
  methods: {
    loading () {
      const msg = this.$Message.loading({
        content: '正在上传',
        duration: 0
      });
    },
    cancel1(){
      this.$refs.vueMiniPlayer.pause();
      // this.videoInfo.url.clear()
      this.$Message.info('Clicked cancel');
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
        this.$Message.success(data.msg);
        // this.getAllVideo(1);
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
      this.loading();
      var data =(await uploadVideoToServer(formdata)).data;
      if(data.status===200){
        this.$Message.destroy();
        this.$Message.success(data.msg);
        this.getAllVideo(1);

      }else{
        this.$message.error("Fail");
      }
    },
    cancel () {
      this.$Message.info('Clicked cancel');
    },
    //时间戳格式化
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },

    async deleteVideo(videoId){
      var data  = (await(deleteVideo(videoId))).data;
      if(data.status===200){
        this.$message.success("删除成功")
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
    // cancelPublishRow(index,rows) {
    //   this.$confirm('取消后你的视频将仅自己可见，是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.videoPublish.videoId = rows.id
    //     this.videoPublish.tag = this.tagInfo.id
    //     // this.getTagList();
    //     this.undoSetPublish()
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已发布'
    //     });
    //   });
    // },
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
      // formdata.append('file', this.videoInfo.picture.file);
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
      this.getAllVideo(1)
    },

    async getAllVideo(val){
      if(val){
        this.curPage = val;
      }
      var data = (await (getPersonalVideoByTitle(this.searchTitle,this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.videoList;
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
</style>
