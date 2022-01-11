import axios from 'axios'
axios.defaults.baseURL = '/api';
//获取个人的所有视频
export function getPersonalVideo(curPage,pageSize) {
  return axios.get('/v1/personal/getAllVideo',
    {params:{
        'curPage':curPage, 'pageSize':pageSize
      }
    });
}
//获取所有视频
export function getAllVideo(curPage,pageSize) {
  return axios.get('/v1/getAllVideo',
    {params:{
        'curPage':curPage, 'pageSize':pageSize
      }
    });
}
// 通过视频标题获取视频
export function getVideoByTitle(title,curPage,pageSize){
  return axios.get('/v1/getVideoByTitle',
    {params:{
        'title':title,
        'curPage':curPage,
        'pageSize':pageSize,
      }
    });
}
// 通过视频标题获取个人视频
export function getPersonalVideoByTitle(title,curPage,pageSize){//有title则相当于按title查询个人视频，没有则返回个人的所有视频
  return axios.get('/v1/personal/getVideoByTitle',
    {params:{
        'title':title,
        'curPage':curPage,
        'pageSize':pageSize,
      }
    });
}
export function setViews(videoId){
  return axios.get('/v1/public/setViews',
    {params:{
        'videoId':videoId,
      }
    });
}
// 通过视频id获取视频
export function getVideoById(Id){
  return axios.get('/v1/getVideoById',
    {params:{
        'id':Id
      }
    });
}
export function deleteVideo(videoId){
  return axios.get('/v1/deleteVideo',
    {
      params:{
        'videoId':videoId
      }
    })
}
export function deleteType(TypeId){
  return axios.get('/v1/deleteType',
    {
      params:{
        'typeId':TypeId
      }
    })
}

export function getAllColumns(curPage,pageSize) {
  return axios.get('/v1/collections/getAll',
    {
      params:{
        'curPage':curPage,
        'pageSize':pageSize
      }
    })
}
export function deleteColumn(collectionId) {
  return axios.get('/v1/collections/delete',
    {
      params:{
        'collectionId':collectionId,
      }
    })
}

//获取的是专栏内用选择发布的视频
export function getVideoByColumn(collectionId,curPage,pageSize) {
  return axios.get('/v1/getVideoByCollectionId',
    {
      params:{
        'collectionId':collectionId,
        'curPage': curPage,
        'pageSize': pageSize
      }
    })
}
export function getAllVideoByColumn(collectionId) {
  return axios.get('/v1/personal/getAllVideoByCollectionId',
    {
      params:{
        'collectionId':collectionId
      }
    })
}
export function getVideoByCollectionId(collectionId,curPage,pageSize) {
  return axios.get('/v1/getVideoByCollectionId',
    {
      params:{
        'collectionId':collectionId,
        'curPage':curPage,
        'pageSize':pageSize
      }
    })
}
// 上移下移
export function setUp(videoId) {
  return axios.get('/v1/collections/setUp',
    {
      params:{
        'videoId':videoId
      }
    })
}
export function setDown(videoId) {
  return axios.get('/v1/collections/setDown',
    {
      params:{
        'videoId':videoId
      }
    })
}

// 获取所有待审核视频
export function getAllVideoToAudit(curPage,pageSize) {
  return axios.get('/v1/admin/getAllVideoToAudit',
    {
      params:{
        'curPage':curPage,
        'pageSize':pageSize
      }
    })
}
//获取所有审核通过的视频
export function getPublished2Video(curPage,pageSize) {
  return axios.get('/v1/public/getPublishedVideo',
    {
      params:{
        'curPage':curPage,
        'pageSize':pageSize
      }
    })
}

export function addVideo(params,config){
  return axios.post('/v1/collections/uploadVideo',params,config)
}


export function editColumn(params){
  return axios.post('/v1/collections/edit',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}

export function editVideo(params){
  return axios.post('/v1/editVideoInfo',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}
export function editPicture(params){
  return axios.post('/v1/editPicture',params,{ headers: {
      'Content-Type': false}
  })
}
export function editType(params){
  return axios.post('/v1/editType',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}

export function uploadVideoToServer(params,config){
  return axios.post('/v1/uploadVideo',params,config
  )
}
export function setPublish(params){
  return axios.post('/v1/setPublish',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}

export function columnPublish(params){
  return axios.post('/v1/collections/publish',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}
export function addColumn(params){
  return axios.post('/v1/collections/add',params,{ headers: {
      'Content-Type': 'multipart/form-data'}
  })
}

//获取登录用户的视频分类
export function getTypeList(){
  return axios.get('/v1/getTypeList')
}


export function getVideoByType(title,typeId,curPage,pageSize){//如果前端没有title则相当于按type查询，有title则相当于按title查询
  return axios.get('/v1/getVideoByType',{
    params:{
      'title':title,
      'typeId':typeId,
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}
export function addType(typeName){//如果前端没有title则相当于按type查询，有title则相当于按title查询
  return axios.get('/v1/addType',{
    params:{
      'typeName':typeName,
    }
  })
}
//获取所有待审核的专栏
export function getAudit(curPage,pageSize){//如果前端没有title则相当于按type查询，有title则相当于按title查询
  return axios.get('/v1/collections/getAudit',{
    params:{
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}
//获取所有审核通过的专栏
export function getPublishedAudit(curPage,pageSize){//如果前端没有title则相当于按type查询，有title则相当于按title查询
  return axios.get('/v1/collections/getPublished',{
    params:{
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}
export function login(params){
  return axios.post('/v1/login',params)
}

export function logout(){
  return axios.get('https://oauth.shu.edu.cn/oauth/logout', {params:{
    retUrl:"http://10.10.22.106"
    }})
}
//前台获取分类
export function getTagList(){
  return axios.get('/v1/public/getTagList');
}

// 获取已发布视频，当title不为空时相当于按标题查找，当tag不为空时相当于按tag查找
export function getPublishedVideo(title,tag,curPage,pageSize){
  return axios.get('/v1/public/getPublishedVideo',{
    params:{
      'title':title,
      'tag':tag,
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}

export function getPublishedCollections(name,curPage,pageSize){
  return axios.get("/v1/collections/getPublished",{
    params:{
      'name':name,
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}

export function getIdentity(){
  return axios.get("/v1/getIdentity");
}

export function getUserTypes(){
  return axios.get("/v1/admin/getUserTypes")

}

export function  getUsers(type,curPage,pageSize){
  return axios.get("/v1/admin/getAllUsers",{
    params:{
      'type':type,
      'curPage':curPage,
      'pageSize':pageSize
    }
  })
}

export function setUserType(userId,type,mail){
  return axios.get("/v1/admin/setUserType",{
    params:{
      'userId':userId,
      'type':type,
      'mail':mail
    }

  })

}
