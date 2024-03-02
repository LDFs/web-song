import axios from 'axios'

axios.defaults.withCredentials=true;//让ajax携带cookie

export function request(config){
  const instance = axios.create({
    // baseURL: 'http://localhost:3000/',  
    baseURL: 'https://service-s06nieoc-1324477319.gz.tencentapigw.com.cn/release/',
    withCredentials: true,
  })
  
  return instance(config)
}