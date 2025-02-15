import { request } from '@/utils/request'

export default {
  // 登录
  login(data) {
    return request({
      url: '/api/user/login',
      method: 'POST',
      data
    })
  },

  // 获取验证码
  getVerifyCode(phone) {
    return request({
      url: '/api/user/verify-code',
      method: 'POST',
      data: { phone }
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/api/user/info',
      method: 'GET'
    })
  },

  // 更新用户信息
  updateUserInfo(data) {
    return request({
      url: '/api/user/info',
      method: 'PUT',
      data
    })
  },

  // 退出登录
  logout() {
    return request({
      url: '/api/user/logout',
      method: 'POST'
    })
  }
} 