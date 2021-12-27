<template>

      <Menu theme="light" width="auto" :active-name="activeName" :open-names="openNames">
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
            <Icon type="ios-videocam" />
            我的视频
          </template>
<!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
<!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
          <template>
            <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>
            <MenuItem v-for="item in menuList" :key="item.id" :value="item.id" :name="'2'+item.id+1" @click.native.prevent="insurance(item.id)">
              {{ item.type }}
            </MenuItem>
          </template>
          <!--          v-for="item in tagInfo"-->
        </Submenu>
<!--        <MenuItem name="2" to="/VideoManage">-->
<!--          <Icon type="ios-navigate" ></Icon>-->
<!--          <span>我的视频</span>-->
<!--        </MenuItem>-->
        <MenuItem name="5" to="/myColumn">
          <Icon type="ios-film" ></Icon>
          <span>我的专栏</span>
        </MenuItem>
        <MenuItem name="3" to="/TypeManage">
          <Icon type="ios-pricetag" ></Icon>
          <span>分类管理</span>
        </MenuItem>
        <MenuItem name="4" to = "/videoSquare">
          <Icon type="logo-youtube"></Icon>
          <span>视频广场</span>
        </MenuItem>

<!--          <MenuItem name="6" to = "/videoPass">-->
<!--            <Icon type="md-person"></Icon>-->
<!--            <span>视频审核</span>-->
<!--          </MenuItem>-->
          <Submenu v-if="identity>=1"  name="6" to="/videoPass">
            <template slot="title">
              <Icon type="md-person" />
              视频审核
            </template>
            <template>
              <MenuItem name="6-1" to="/videoPass">视频审核</MenuItem>
              <MenuItem name="6-2" to="/collectionPass">专栏审核</MenuItem>
            </template>
          </Submenu>
      </Menu>

</template>

<script>
import {getIdentity, getTypeList} from "../../api/api";

export default {
  name: "SideMenu",
  props: {

    'activeName':String,
    'openNames':Array

  },


  data(){
    return{
      identity:0,
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
    },
    async getIdentity(){
      var data = (await (getIdentity())).data;
      if(data.status ===200){
        this.identity = data.data;
      }

    }

  },

  mounted() {

    //获取分类
    this.getTypeList();
    //获取权限
      this.getIdentity()


  }
}
</script>

<style>

</style>
