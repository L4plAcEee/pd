import { request } from '@/utils/request'
import { ORDER_STATUS } from '@/utils/constants'

// 生产部门API
export default {
  // 提交生产订单
  submitOrder(data) {
    return request({
      url: '/api/production/order/submit',
      method: 'POST',
      data
    })
  },

  // 获取订单列表
  getOrders(params = {}) {
    return request({
      url: '/api/production/order/list',
      method: 'GET',
      data: params
    })
  },

  // 获取统计数据
  getStats() {
    return request({
      url: '/api/production/stats',
      method: 'GET'
    })
  },

  // 获取产品列表
  getProductList() {
    return request({
      url: '/api/production/product/list',
      method: 'GET'
    })
  },

  // 扫码获取产品信息
  getProductByCode(code) {
    return request({
      url: '/api/production/product/scan',
      method: 'GET',
      data: { code }
    })
  },

  // 获取生产任务列表
  getTaskList(params = {}) {
    return request({
      url: '/api/production/task/list',
      method: 'GET',
      data: params
    })
  },

  // 创建生产任务
  createTask(data) {
    return request({
      url: '/api/production/task/create',
      method: 'POST',
      data
    })
  },

  // 更新任务状态
  updateTaskStatus(data) {
    return request({
      url: '/api/production/task/status',
      method: 'PUT',
      data
    })
  },

  // 获取生产记录
  getRecordList(params = {}) {
    return request({
      url: '/api/production/record/list',
      method: 'GET',
      data: params
    })
  }
} 