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
function getHighqualityList(){
  return request({
    url: '/top/playlist/highquality'
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

export { 
  getRecomMusicList, 
  getHomePageCoverList,
  getHighqualityList, 
  getRecomMusicListByCat, 
  getRecomNewMusic,
  getNewAlbum
}