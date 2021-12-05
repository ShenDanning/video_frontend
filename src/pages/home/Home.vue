<template>
<div>
  <Header :style="{position: 'fixed', width: '100%',padding: 0,zIndex:'3'}">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo">
        <img src="../../assets/shu.png" style="height: 40px">
      </div>

      <MenuItem name="1" >
        <p style="color:white;margin-left: 20px;font-size: 20px;font-weight:bold;font-family: Bahnschrift">上海大学视频服务站</p>
      </MenuItem>


      <MenuItem name="6" style="float: right" :to="{name:'Login'}">
        <div v-if="username==='未登陆'">
          <p style="color: white">登录</p>
        </div>
        <div v-else>

          <p style="color: white">后台管理</p>
        </div>

      </MenuItem>
      <MenuItem name="5" to="Control" style="float: right">
        {{username}}

      </MenuItem>


    </Menu>
  </Header>
  <div class="block">
    <span class="demonstration">默认 Hover 指示器触发</span>
    <el-carousel height="300px">
      <el-carousel-item>
       <img src="../../assets/shu.jpg">
      </el-carousel-item>
    </el-carousel>
  </div>
  <VideoList style="margin-left: 10%;margin-right: 10%"/>
</div>
</template>

<script>
import VideoList from "../Videos/videoList";
import {login} from "../../api/api";
export default {
  name: "Home",
  components: {VideoList},
  data(){
    return {
      username:'',
      activeIndex: '',
      tagList: [],
      videoInfo:[],
      curPage:1,
      pageSize:8,
      total:0,
      searchTitle:'',

    }

  },
  methods:{
    async handleOnClickLogin(code,url){
      var formdata={
        "code":code,
        "url":url
      };

      var data = (await(login(formdata))).data;
      if(data.status === 200){//登陆成功
        localStorage.setItem("token", data.data.token);
        // localStorage.setItem("identity", res.data.data.identity);
        // localStorage.setItem("identity2", JSON.stringify(this.identity));
        localStorage.setItem("collegeId", data.data.collegeId);
        localStorage.setItem("collegeName", data.data.collegeName);
        localStorage.setItem("username", data.data.name);
        this.$router.push('/VideoManage');

      } else {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href="http://127.0.0.1:8080";
        this.$Notice.warning({ title: "请检查工号或密码是否正确" });

      }

    },
    getQueryVariable (variable) {
      const after1 = window.location.href.split('?', 2)[1];
      if(after1){
        const after = after1.split('#/')[0];
        console.log(after)
        if (after) {
          const reg = new RegExp('(^|&)' + variable + '=([^&]*)(&|$)')
          const r = after.match(reg)
          if (r != null) {
            return decodeURIComponent(r[2])
          } else {
            return false
          }
        }
      }

    }

  },
  mounted() {
    var code = this.getQueryVariable("code");
    this.username = localStorage.getItem("username")===null?"未登陆":localStorage.getItem("username")
    console.log(code);
    if (code&&this.username==="未登陆") {
      // alert(document.location.href.split("?")[0]);
      this.handleOnClickLogin(code,"http://127.0.0.1:8080/login");
    }
  }
}
</script>

<style scoped>
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
</style>
