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

// 根据分类获取歌手列表
function getArtistsByCats(type=-1, area=-1){
  return request({
    url: '/artist/list',
    params: {
      type, area,
      limit: 50
    }
  })
}

// 获取歌手的热门歌曲
function getArtistTopSongs(id){
  return request({
    url:  '/artist/top/song',
    params:{id}
  })
}

// 获取相似歌手
function getRelatedArtists(id){
  return request({
    url: '/simi/artist',
    params: {id}
  })
}

export { getTopArtists, getArtistDetailById, getArtistsByCats, getArtistTopSongs, getRelatedArtists }
