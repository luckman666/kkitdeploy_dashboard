import axios from 'axios'
import { getToken } from "@/utils/auth"
import { Message } from 'element-ui'
import store from '@/store'

// let BASE_API ='http://localhost:8001'
let BASE_API ='http://192.168.31.74:8001'

const service = axios.create({
  baseURL: BASE_API, // api 的 base_url
  timeout: 50000 // request timeout
})
service.defaults.withCredentials = true
// request interceptor


service.interceptors.request.use(
  config => {
    if(store.getters.token) {
      // config.headers['Content-Type'] = 'application/json'
      config.headers['authorization'] = 'JWT ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

axios.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  return Promise.reject(error);
})

// 返回有错误，查找错误函数
function findError(error){
  console.log('error!!!!',error)
  if(error.response.data.hasOwnProperty('detail')){
    return error.response.data.detail
  }else if(error.response.data.hasOwnProperty('non_field_errors')){
    return error.response.data.non_field_errors
  }
  else{
    return '未知错误'
  }
}
// 解析错误
service.interceptors.response.use(
  response => response,
  error => {
    Message({
      message: findError(error),
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('error')
  })

export default service
