import request from '@/utils/request'
import { objectIterator } from '@/utils/iterator'

export function fetch_deploy_metadata() {
  return request({
    url: '/api-deploy/v1/metadata/bypage/',
    method: 'GET'
  })
}

export function exec_deploy(data) {
  return request({
    url: '/api-deploy/v1/deploy/create/',
    method: 'post',
    data
  })
}

export function fetch_config_file(data) {
  return request({
    url: '/api-deploy/v1/metadata/config/bypage/',
    method: 'post',
    data
  })
}

export function updata_configfile(data) {
  return request({
    url: '/api-deploy/v1/metadata/config/update/',
    method: 'post',
    data
  })
}

export function updata_ymlConfigfile(data) {
  return request({
    url: '/api-deploy/v1/metadata/ymlconfig/update/',
    method: 'post',
    data
  })
}

export function UnRarUploadFile(data) {
  return request({
    url: '/api-utils/v1/UnRarUploadFile/',
    method: 'post',
    data
  })
}
