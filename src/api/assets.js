import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

export function create_Admin_User(data) {
  return request({
    url: '/api-assets/v1/assetsadminuser/create/',
    method: 'post',
    data
  })
}
// fetch
export function fetch_Admin_User(pagination,obj){
  let st = objectIterator(obj)
  return request({
    // url: '/api-assets/v1/assetsadminuser/bypage/'+st+'page='+pagination.page+'&limit='+pagination.limit,
    url: '/api-assets/v1/assetsadminuser/bypage/'+st+'page='+pagination.page,
    method: 'GET'
  })
}

// update_admin_User

// 更改系统用户
export function update_admin_User(data){
  return request({
    url: '/api-assets/v1/assetsadminuser/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

//删除
export function delete_admin_User(data) {
  return request({
    url: '/api-assets/v1/assetsadminuser/'+data.id+'/delete/',
    method: 'DELETE',
    data: data
  })
}

// 创建用户
export function create_Assets(data){
  return request({
    url: 'api-assets/v1/assets/create/',
    method: 'POST',
    data: data
  })
}

export function fetch_Assets(pagination,obj) {
  let st = objectIterator(obj)
  return request({
    // url: '/api-assets/v1/assets/bypage/'+st+'page='+pagination.page+'&limit='+pagination.limit,
    url: '/api-assets/v1/assets/bypage/'+st+'page='+pagination.page,
    method: 'GET'
  })
}

export function delete_Assets(data) {
    return request({
    url: '/api-assets/v1/assets/'+data.id+'/delete/',
    method: 'DELETE',
    data: data
  })
}

export function fetch_Assets_page(pagination) {
  return request({
    url: '/api-assets/v1/assets/bypage/?page='+pagination.page,
    method: 'GET'
  })
}

// 更改资产
export function update_Assets(data){
  return request({
    url: '/api-assets/v1/assets/'+data.id+'/update/',
    method: 'PUT',
    data: data
  })
}

// 更新硬件信息
export function fetch_Hardware(data) {
    return request({
    url: '/api-utils/v1/ansible/',
    method: 'POST',
    data: data
  })
}
