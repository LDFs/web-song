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
function getRecomMusicListByCat(cat='全部', order='hot', limit=20, offset=0) {
  return request({
    url: 'top/playlist',
    params: {
      offset,
      limit,
      order,
      cat
    }
  })
}

// 获取精品歌单
function getHighqualityList(cat='全部', order='hot', limit=20, offset=0){
  return request({
    url: '/top/playlist',
    params: {
      cat,order, limit, offset
    }
  })
}

// 获取推荐歌单
function getRecomMusicList(limit=10){
  return request({
    url: '/personalized',
    params: {
      limit
    }
  })
}

// 获取推荐新歌
function getRecomNewMusic(limit=10){
  return request({
    url: '/personalized/newsong',
    params: {
      limit
    }
  })
}

// 新碟上架
function getNewAlbum(limit=10, offset=0, type='new', area='all'){
  return request({
    url: '/top/album',
    params: {
      limit, offset, type, area
    }
  })
}

// 全部新碟
function getAllAlbum(limit=30, offset=0, area='all'){
  return request({
    url: '/album/new',
    params: {
      limit, offset, area
    }
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

// 获取歌手热门专辑
function getArtHotAlbum(params){
  return request({
    url: '/artist/album',
    params: params
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

// 获取歌单的所有分类
function getAllCats(){
  return request({
    url: '/playlist/catlist'
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
  getArtHotAlbum,
  getListDetail,
  getRelatedList,
  getAllTopLists,
  getSongRelatedLists,
  getAllCats
}