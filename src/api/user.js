import request from '@/utils/request'
import { removeToken } from "@/utils/auth"
// 登录
export function login(data) {
  console.log('data',data)
  return request({
    url: '/api-auth/login/',
    method: 'POST',
    data:{
      username:data.username,
      password:data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api-auth/userinfo/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api-auth/logout/',
    method: 'post'
  })
  // removeToken()
}

