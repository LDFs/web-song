import { request } from './request'

function loginTmp(){
  return request({
    url: '/register/anonimous'
  })
}

function loginStatus(){
  return request({
    url: '/login/status'
  })
}

export {
  loginTmp,
  loginStatus
}