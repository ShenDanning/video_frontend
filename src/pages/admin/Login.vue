<template>
  <div>

  </div>
</template>

<script>
import {login} from "@/api/api";
export default {
  name: "Login",
  data(){
    return{
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
        localStorage.setItem("userId", data.data.userId);
        this.$router.push('/VideoManage');
      } else {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href="http://v.shu.edu.cn";
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
    let token =  localStorage.getItem("token");
    let logout = localStorage.getItem("logout");
    if (token) {
      this.handleOnClickLogin("", "");
    } else if (logout === "comfirm") {
      localStorage.removeItem("logout");
      window.location.href =
        "https://oauth.shu.edu.cn/oauth/logout?redirect_uri=" +"http://v.shu.edu.cn/login" ;
    } else {
      var code = this.getQueryVariable("code");
      console.log(code);
      if (code) {
        // alert(document.location.href.split("?")[0]);
        this.handleOnClickLogin(code,"http://v.shu.edu.cn/login");
      } else {
        // 请求code
        // alert("重新请求")
        document.location.href =
          "http://oauth.shu.edu.cn/oauth/authorize?response_type=code&client_id=Tp8uecHJi00aHlpufk8Fqp2A_2zpaKzS" +
          "&redirect_uri=http://v.shu.edu.cn/login" +
          "&scope=1";
        //获取token
      }
    }}}
</script>

<style scoped>
</style>
