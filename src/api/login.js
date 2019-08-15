import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 获取七牛token
export function getQiniuToken() {
  return request({
    url: '/admin/upload/qiniuToken',
    method: 'get'
  })
}

