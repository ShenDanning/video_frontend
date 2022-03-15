<template>
  <div>

    <el-empty v-if="collectionsInfo.length==0" description="暂时没有合集"></el-empty>
    <Row v-else style="margin-top: 20px">
      <Col :span="6" style="padding-left: 10px; padding-bottom: 10px;" v-for="item in collectionsInfo" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.picture" style="height:140px;width:100%" class="image" @click="openCollections(item)" >
          <div style="padding: 14px;text-align: left">
            <h3 style="font-weight: bold;color: #666" class="view-text">
              {{ item.name }} <el-tag  size="mini">合集</el-tag>
            </h3>

            <div class="bottom clearfix">
              <span class="time" >{{ dateFormat(item.uploadTime) }}</span>
              <span class="button" size="mini">来自:{{item.author}}</span>
            </div>
          </div>
        </el-card>
      </Col>
    </Row>
    <div class="block">
      <el-pagination
        :current-page="curPage"
        :page-size ="pageSize"
        :total ="total"
        style="padding:30px 0; text-align:center;"
        layout="total,prev,pager,next,jumper"
        @current-change="getPublishedCollectionsFront">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getPublishedCollections} from "../../api/api";
import moment from "moment";

export default {
  name: "Collections",
  data(){
    return{
      searchName:'',
      curPage:1,
      pageSize:8,
      total:0,
      collectionsInfo: []

      }
    },
    methods: {
      dateFormat(date) {

        return moment(date).format("YYYY-MM-DD");
      },


      openCollections(item) {
        this.$router.push({name:'CollectionVideo',
          query:{
            value:JSON.stringify(item)

          }})
      },
      async getPublishedCollectionsFront(val){
        var data = (await getPublishedCollections("",this.curPage,this.pageSize)).data;
        if(data.status===200){
          this.collectionsInfo = data.data.collectionsList;
          this.total = data.data.total;
          console.log(this.collectionsInfo,this.total)
        }
      },
    },
    mounted() {
      this.getPublishedCollectionsFront(1);
    }
}
</script>

<style scoped>

</style>
