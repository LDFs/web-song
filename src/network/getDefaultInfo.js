import { request } from './request'

function getBannerInfo(){
  return request({
    url: 'banner'
  })
}

export { getBannerInfo }
