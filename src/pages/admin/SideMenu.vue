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
            <Icon type="ios-videocam" />
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
        <div v-if="identity>=1">
<!--          <MenuItem name="6" to = "/videoPass">-->
<!--            <Icon type="md-person"></Icon>-->
<!--            <span>视频审核</span>-->
<!--          </MenuItem>-->
          <Submenu name="6" to="/videoPass">
            <template slot="title">
              <Icon type="md-person" />
              视频审核
            </template>
            <!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
            <!--          <MenuItem name="2-1" to="/VideoManage">全部</MenuItem>-->
            <template>
              <MenuItem name="6-0" to="/videoPass">视频审核</MenuItem>
              <MenuItem name="6-1" to="/collectionPass">专栏审核</MenuItem>
<!--              <MenuItem name="6-2" to="/peopleManage">人员管理</MenuItem>-->

            </template>
            <!--          v-for="item in tagInfo"-->
          </Submenu>
<!--          <Submenu name="6" to="">-->
<!--            <template slot="title">-->
<!--              <Icon type="md-person" />-->
<!--              管理员-->
<!--            </template>-->
<!--            <template>-->
<!--              <MenuItem name="6-0" to="/videoPass">视频审核</MenuItem>-->

<!--            </template>-->
<!--            &lt;!&ndash;          v-for="item in tagInfo"&ndash;&gt;-->
<!--          </Submenu>-->
        </div>



      </Menu>

</template>

<script>
import {getTypeList} from "../../api/api";

export default {
  name: "SideMenu",
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
    }

  },
  mounted() {

    //获取分类
    this.getTypeList();
    this.identity = localStorage.getItem("identity")
    // alert("identity is"+this.identity)

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
