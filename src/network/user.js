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

function getLoginQrKey(){
  return request({
    url: '/login/qr/key',
    params: {
      timestamp: Date.now()
    }
  })
}

function getLoginQr(key){
  return request({
    url: '/login/qr/create',
    params: {
      key,
      timestamp: Date.now(),
      qrimg: true
    }
  })
}

function qrCheck(key){
  return request({
    url: '/login/qr/check',
    params: {
      key,
      timestamp: Date.now()
    }
  })
}

export {
  loginTmp,
  loginStatus,
  getLoginQrKey,
  getLoginQr,
  qrCheck
}