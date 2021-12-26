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

            <Row>
              <Col span="24">
                <Button type="primary"  icon="md-add" style="float: left"
                        @click.native.prevent="addShow()"
                >创建专栏</Button>
                <!--                  <Button type="primary"  icon="ios-construct" style="float: left;margin-left: 20px"-->
                <!--                          @click.native.prevent="typeShow()"-->
                <!--                  >管理分类</Button>-->
                <Input
                  v-model="searchTitle"
                  :search="true"
                  suffix="ios-search"
                  placeholder="请输入专栏标题"
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
                prop="name"
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
              <el-table-column
                prop="createdTime"
                label="创建时间"
                :formatter="dateFormat"
                align="center"
                width="150">
              </el-table-column>
              <el-table-column
                prop="videos"
                label="视频数目"
                align="center"
                width="150">
              </el-table-column>
              <el-table-column
                prop="description"
                label="简介"
                align="center"
                width="200">
              </el-table-column>
<!--              <el-table-column-->
<!--                align="center"-->
<!--                label="是否已发布"-->
<!--                width="180"-->
<!--                show-overflow-tooltip>-->
<!--                <template slot-scope="scope">-->
<!--                  <el-switch-->
<!--                    v-model="scope.row.publish"-->
<!--                    active-color="#13ce66"-->
<!--                    inactive-color="#ff4949"-->
<!--                    :active-value="1"-->
<!--                    :inactive-value="0"-->
<!--                    @change="changeSwitch(scope.row,scope.$index)"-->
<!--                  >-->
<!--                  </el-switch>-->
<!--                </template>-->
<!--              </el-table-column>-->
              <el-table-column
                align="center"
                label="发布状态"
                width="180"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.publish =='1'">审核中</el-tag>
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
                @current-change="searchTree">
              </el-pagination>
            </div>

            <!--            上传视频-->
            <Modal
              v-model="modal3"
              title="新建专栏"
              @on-ok="addColumn"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="columnAdd" :rules="rules" class="demo-ruleForm" ref="columnAdd">
                <el-form-item label="专栏名称" prop="name" >
                  <el-input v-model="columnAdd.name"   placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="专栏简介">
                  <el-input  type="textarea" placeholder="请输入简介" :autosize="{ minRows: 3, maxRows: 10}" v-model="columnAdd.description"></el-input>
                </el-form-item>

                <el-form-item label="专栏封面" prop="picture">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    multiple
                    :http-request="imgAdd"
                    :limit="1"
                    accept=".png,.jpg"
                    v-model="columnAdd.picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>

              </el-form>
            </Modal>
            <Modal
              v-model="modal1"
              title="编辑专栏"
              @on-ok="editColumn"
              @on-cancel="cancel">
              <el-form label-position="left" label-width="80px" :model="columnEdit" :rules="rules" class="demo-ruleForm" ref="columnEdit">
                <el-form-item label="专栏名称" prop="name" >
                  <el-input v-model="columnEdit.name"   :placeholder="columnEdit.name" ></el-input>
                </el-form-item>
                <el-form-item label="专栏简介">
                  <el-input  type="textarea" :placeholder="columnEdit.description" :autosize="{ minRows: 3, maxRows: 10}" v-model="columnEdit.description"></el-input>
                </el-form-item>

                <el-form-item label="专栏封面" prop="picture">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    multiple
                    :http-request="imgAdd"
                    :limit="1"
                    accept=".png,.jpg"
                    v-model="columnEdit.picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
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
  deleteVideo,
  editPicture,
  editVideo,
  getTagList,
  getPersonalVideoByTitle, getTypeList, getVideoByType,
  uploadVideoToServer,
  addColumn,
  getAllColumns,
  editColumn,
  deleteColumn,
  columnPublish
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      loading:false,
      percentage:0,
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
        author:'',
        name:'',
        description:'',
        createdTime:'',
        videos:'',
        id:'',
        picture:''
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
      columnPublish:{
        // tag:'',
        columnId:'',
        publish:'',
      },
      type:this.$route.query.id,
      value:true,
      uping:false
    }
  },
  methods: {

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
        this.loading = false;
        this.tips="正在上传视频。。。"
        this.$Message.success(data.msg);
        this.getAllVideo(1);

      }else{
        this.$message.error("Fail");
      }
    },
    GoTo(row){
      // alert(id)
      this.$router.push({
        path: '/ColumnVideos',
        query: {
          id: row.id,
          name:row.name
        }
      })
    },
    submitUpload(formName){
      //alert(this.videoUpload.file)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
          if(this.uping===false){
            this.$Message.warning("请")
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
    async editColumn(){
      let formdata = new FormData();
      formdata.append('collectionId',this.columnEdit.collectionId)
      formdata.append('name',this.columnEdit.name);
      formdata.append('description',this.columnEdit.description);
      formdata.append('picture',this.columnEdit.picture.file);
      var data =(await editColumn(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.searchTree(this.curPage);
      }else{
        this.$message.error("编辑失败！");
      }
    },
    async addColumn(){
      // alert("addColumn")
      let formdata = new FormData();
      formdata.append('name',this.columnAdd.name);
      formdata.append('description',this.columnAdd.description);
      formdata.append('picture',this.columnAdd.picture.file);
      var data =(await addColumn(formdata)).data;
      if(data.status===200){
        this.$Message.success(data.msg);
        this.searchTree()
      }else{
        this.$message.error("发布失败！");
      }
      // formdata.append('typeId',this.videoUpload.type);
    },
    changeSwitch(row,index){
      if(row.publish===0){
        this.undoSetPublish(row);
      }else{
        this.publishRow(index,row)
      }
    },
    async setPublish(){
      this.columnPublish.publish = 1;
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('collectionId', this.columnPublish.columnId);
      formdata.append('publish',this.columnPublish.publish);
      var data =(await columnPublish(formdata)).data;
      if(data.status===200){
        this.$Message.success("已提交管理员审核！");
        this.getAllColumns();
        // this.getAllVideo(1);
      }else{
        this.$message.error("发布失败！");
      }
    },
    async undoSetPublish(row){
      // alert(this.videoUpload.type);
      var formdata = new FormData();
      formdata.append('collectionId',row.id);
      formdata.append('publish',-1);
      // formdata.append('tag',-1);
      var data =(await columnPublish(formdata)).data;
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

    async deleteColumn(videoId){
      var data  = (await(deleteColumn(videoId))).data;
      if(data.status===200){
        this.$message.success("删除成功")
        this.searchTree(this.curPage)
      }else{
        this.$message.error("删除失败")}
    },
    publishRow(index,rows) {
      this.$confirm('发布后你的专栏将所有人可见，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.columnPublish.columnId = rows.id
        this.setPublish()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
        location.reload()
      });
    },
    deleteRow(index,rows) {
      this.$confirm('此操作将永久删除该专栏及其下视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteColumn(rows.id);
        this.searchTree(this.curPage);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
        this.columnEdit.collectionId=rows.id;
        this.columnEdit.name = rows.name;
        this.columnEdit.picture = rows.picture;
        this.columnEdit.description = rows.description;
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
      // this.curPage = val
      this.getAllColumns(val)
    },

    async getAllColumns(val){
      if(val){
        this.curPage = val;
      }
      var data = (await (getAllColumns(this.curPage,this.pageSize))).data;
      if(data.status === 200){
        this.tableData = data.data.collectionsList;
        // console.log(tableData)
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

  mounted() {
    this.username = localStorage.getItem("username");
    this.type = this.$route.query.id
    if(this.type){
      //如果type有值，调用getVideoByType
      // alert(this.type)
      this.getVideoByType(1,this.type)
    }else{
      // alert("调用AllVideo方法")
      this.getAllColumns();
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
</style>
