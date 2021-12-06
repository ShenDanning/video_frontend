<template>

      <Menu theme="light" width="auto" :open-names="['1']">
        <MenuItem name="1" to="/home">
          <Icon type="ios-navigate"></Icon>
          <span>返回首页</span>
        </MenuItem>
<!--        <MenuItem name="2" to="/VideoManage">-->
<!--          <Icon type="ios-navigate" ></Icon>-->
<!--          <span>我的视频</span>-->
<!--        </MenuItem>-->
        <Submenu name="2" to="/VideoManage">
          <template slot="title">
            <Icon type="ios-people" />
            我的视频
          </template>
<!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
<!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
          <template>
            <MenuItem name="2-0" to="/VideoManage">全部</MenuItem>
            <MenuItem v-for="item in menuList" :key="item.id" :value="item.id" :name="'2'+item.id" @click.native.prevent="insurance(item.id)">
              {{ item.type }}
            </MenuItem>
          </template>

          <!--          v-for="item in tagInfo"-->
        </Submenu>
        <MenuItem name="2" to="/VideoManage">
          <Icon type="ios-navigate" ></Icon>
          <span>我的视频</span>
        </MenuItem>
        <MenuItem name="3" to="/TypeManage">
          <Icon type="ios-navigate" ></Icon>
          <span>分类管理</span>
        </MenuItem>
        <MenuItem name="4" to = "/videoSquare">
          <Icon type="ios-navigate"></Icon>
          <span>视频广场</span>
        </MenuItem>
      </Menu>

</template>

<script>
import {getTypeList} from "../../api/api";

export default {
  name: "SideMenu",
  data(){
    return{
      menuList:{
        author:'',
        id:'',
        type:'',
        name:''
      },

    }
  },
  methods:{
    insurance(id){
      // alert(id)
      this.$router.push({
        path: '/VideoManage',
        query: {
          id: id
        }
      })
    },
    async getTypeList(){
      var data = (await (getTypeList())).data;
      if(data.status === 200){
        // alert(data.data.typeList)
        this.menuList = data.data.typeList;
      }
    }

  },
  mounted() {

    //获取分类
    this.getTypeList();

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
