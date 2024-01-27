import { request } from './request'

function getHomePageCoverList(){
  return request({
    url: '/homepage/block/page',
    params: {
      refresh: true
    }
  })
}

// 根据类型获取歌单
function getRecomMusicListByCat(cat) {
  return request({
    url: 'top/playlist',  // /top/playlist/highquality
    params: {
      offset: 20,
      limit: 10,
      order: cat
    }
  })
}

// 获取精品歌单
function getHighqualityList(cat){
  return request({
    url: '/top/playlist/highquality',
    params: {
      cat: cat
    }
  })
}

// 获取推荐歌单
function getRecomMusicList(){
  return request({
    url: '/personalized'
  })
}

// 获取推荐新歌
function getRecomNewMusic(){
  return request({
    url: '/personalized/newsong'
  })
}

// 新碟上架
function getNewAlbum(){
  return request({
    url: '/top/album'
  })
}

// 全部新碟
function getAllAlbum(){
  return request({
    url: '/album/new'
  })
}

function getAlbumDetail(id){
  return request({
    url: '/album',
    params: {
      id
    }
  })
}

// 歌单详情
function getListDetail(id){
  return request({
    url: '/playlist/detail',
    params: {
      id: id
    }
  })
}

// 获取相关歌单
function getRelatedList(id){
  return request({
    url: '/related/playlist',
    params: {
      id
    }
  })
}

// 获取歌曲全部榜单
function getAllTopLists(){
  return request({
    url: '/toplist'
  })
}

// 获得歌曲的相似歌单
function getSongRelatedLists(id){
  return request({
    url: '/simi/playlist',
    params: {
      id
    }
  })
}

export { 
  getRecomMusicList, 
  getHomePageCoverList,
  getHighqualityList, 
  getRecomMusicListByCat, 
  getRecomNewMusic,
  getNewAlbum,
  getAlbumDetail,
  getAllAlbum,
  getListDetail,
  getRelatedList,
  getAllTopLists,
  getSongRelatedLists
}