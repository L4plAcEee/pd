import { baseURL } from '@/config'
import { loading } from './loading'

// 请求拦截器
const requestInterceptor = (config) => {
  // 添加 token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // 请求成功
  if (statusCode === 200) {
    if (data.code === 0) {
      return data.data
    }
    // 业务错误
    throw new Error(data.message || '请求失败')
  }
  
  // 401 未登录
  if (statusCode === 401) {
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.reLaunch({
      url: '/pages/login/login'
    })
    throw new Error('请先登录')
  }
  
  // 其他错误
  throw new Error(data.message || '请求失败')
}

// 统一请求方法
export const request = (options) => {
  const { loading: showLoading = true, ...config } = options
  
  // 显示加载提示
  if (showLoading) {
    loading.show()
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      url: `${baseURL}${config.url}`,
      success: (res) => {
        try {
          const data = responseInterceptor(res)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        reject(new Error('网络请求失败'))
      },
      complete: () => {
        if (showLoading) {
          loading.hide()
        }
      }
    })
  })
} 