import { request } from './request'

// 获取歌曲详情
function getSongDetail(id){
  return request({
    url: '/song/detail',
    params: {
      ids: id
    }
  })
}

// 获取歌词
function getSongLyric(id){
  return request({
    url: '/lyric',
    params: {
      id: id
    }
  })
}

// 获取歌曲评论
function getComments(id){
  return request({
    url: '/comment/music',
    params: {
      id
    }
  })
}

// 搜索
function getSearchResult(keywords, type){
  return request({
    url: '/search',
    params: {
      keywords,
      type
    }
  })
}

// 获取歌曲url
function getSongUrl(id, level='standard'){
  return request({
    url: '/song/url/v1',
    params: {
      id,
      level
    }
  })
}

export {
  getSongDetail, 
  getSongLyric, 
  getComments, 
  getSearchResult, 
  getSongUrl
}
