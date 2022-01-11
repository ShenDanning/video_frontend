<template>
  <div class="layout">
    <Layout>
      <HeadMenu :message="username" v-if="username.length>0"></HeadMenu>
      <Layout>
        <Sider class="sider" hide-trigger>
          <SideMenu v-bind:openNames="['7']" v-bind:activeName="'7-1'"/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px',margin: '88px 0 0 200px', minHeight: '800px', background: '#fff'}">
            <div style="float: left">
              <el-tag>身份选择</el-tag>
              <el-select v-model="role" placeholder="请选择" size="small" @change="selectRole">
                <el-option
                  v-for="item in userTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <Button type="primary"  icon="md-add" style="float: left;margin-left: 10px"
                    @click.native.prevent="addUserModal=true"
            >手动添加用户</Button>
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="600px">
              <el-table-column
                prop="id"
                label="工号/学号"
                width="200">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="200">
              </el-table-column>
              <el-table-column
                prop="type"
                label="身份"
                width="200">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.type===0">普通用户</el-tag>
                    <el-tag size="medium" type="success" v-if="scope.row.type===1">系统用户</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.type===2">管理员</el-tag>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="mail"
                label="邮箱"
                width="300">
              </el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="selectPerson(scope.row)"
                    type="text"
                    size="small">
                    修改权限
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
                @current-change="getUsers">
              </el-pagination>
            </div>

            <Modal
              v-model="edit"
              title="修改权限"
              @on-ok="editOk()"
              @on-cancel="cancel">
              <el-form :model="editRole"  :rules="rules" ref="editRole">
                <el-form-item label="身份">
                  <el-select v-model="editRole.type" placeholder="请选择" size="small">
                    <el-option
                      v-if="item.id!=-1"
                      v-for="item in userTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="邮箱" v-if="editRole.type!=0" prop="mail">
                  <el-input v-model="editRole.mail" placeholder="邮箱"></el-input>
                </el-form-item>
              </el-form>
            </Modal>
            <Modal
              v-model="addUserModal"
              title="添加用户"
              @on-ok="addUser"
              @on-cancel="cancel">
              <el-form :model="userInfo" size="small">
                <el-form-item label="学号/工号">
                  <el-input v-model="userInfo.id" ></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="userInfo.id"></el-input>
                </el-form-item>
                <el-form-item label="身份">
                  <el-select v-model="userInfo.type" placeholder="请选择">
                    <el-option
                      v-if="item.id!=-1"
                      v-for="item in userTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="邮箱" v-if="userInfo.type!=0" prop="mail">
                  <el-input v-model="userInfo.mail" placeholder="邮箱"></el-input>
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
import HeadMenu from "../admin/HeadMenu";
import SideMenu from "../admin/SideMenu";


import {
  setPublish,
  uploadVideoToServer,
  getVideoByColumn, editVideo, editPicture, addVideo, deleteVideo, getAllVideoByColumn,
  setUp, setDown, getAllVideoToAudit, getPublished2Video, getTagList, getUserTypes, getUsers, setUserType
} from "../../api/api";
export default {
  name: "VideoManange",
  components: {SideMenu, HeadMenu},

  data(){

    return{
      edit:false,
      addUserModal:false,
      curPage:1,
      pageSize:8,
      total:0,
      username:'',
      role:'',
      editRole:{
        userId:'',
        type:'',
        mail: ''
      },
      userInfo:{
        id:'',
        name:'',
        type:'',
        mail: ''
      },
      userTypes:[],
      tableData:[],
      rules: {
        mail: [
          { required: true, message: '请输入邮箱以便收到审核通知', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    selectPerson(row){
      this.editRole.userId = row.id;
    //  alert(this.editRole.userId)
      this.edit = true;

    },
    cancel(){
      this.addUserModal=false;
      this.edit=false;
    },

    selectRole(val){
      //alert(val)
      if(val===-1){
        val = ''
      }
      this.role = val;
      this.getUsers(1);
    },
    async editOk(){
      if(this.editRole.type!=0&&this.editRole.mail===''){
        this.$Message.warning("请填写完整");
      }else {
        var data = (await setUserType(this.editRole.userId,this.editRole.type,this.editRole.mail)).data;
        if(data.status===200){
          this.$Message.success("修改成功");
          this.getUsers();
        }

      }

    },
    addUser(){
      alert("添加用户")
    },


    async getUserTypes(){
      var data = (await getUserTypes()).data;
      if(data.status===200){
        this.userTypes = data.data.userTypes;
      }
    },

    async getUsers(val){
      if(val){
        this.curPage = val;
      }

      var data = (await getUsers(this.role,this.curPage,this.pageSize)).data;
      if(data.status === 200){
        this.tableData = data.data.userList;
        this.total = data.data.total;
      }

    }




  },




  mounted() {
    this.username = localStorage.getItem("username");
    this.getUserTypes();
    this.getUsers();


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
