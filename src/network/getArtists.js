import { request } from './request'

function getTopArtists(){
  return request({
    url: '/top/artists'
  })
}

export { getTopArtists }
