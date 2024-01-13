import { request } from './request'

// 获取热门歌手
function getTopArtists(){
  return request({
    url: '/top/artists'
  })
}

// 获取歌手的详细信息
function getArtistDetailById(id){
  return request({
    url: '/artist/detail',
    params: {
      id: id
    }
  })
}

export { getTopArtists, getArtistDetailById }
