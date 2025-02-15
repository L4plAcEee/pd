import { request } from '@/utils/request'

// 品控部门API
export default {
  // 获取统计数据
  getStats() {
    return request({
      url: '/api/quality/stats',
      method: 'GET'
    })
  },

  // 获取订单列表
  getOrders(params = {}) {
    return request({
      url: '/api/quality/order/list',
      method: 'GET',
      data: params
    })
  },

  // 获取待检验列表
  getInspectionList(params = {}) {
    return request({
      url: '/api/quality/inspection/list',
      method: 'GET',
      data: params
    })
  },

  // 获取订单详情
  getOrderDetail(id) {
    return request({
      url: `/api/quality/inspection/${id}`,
      method: 'GET'
    })
  },

  // 提交审核结果
  submitReview(data) {
    return request({
      url: '/api/quality/inspection/review',
      method: 'POST',
      data
    })
  },

  // 获取历史记录
  getHistoryList(params = {}) {
    return request({
      url: '/api/quality/history',
      method: 'GET',
      data: params
    })
  },

  // 获取品控统计数据
  getQualityStats() {
    return request({
      url: '/api/quality/stats',
      method: 'GET'
    })
  },

  // 获取待处理任务
  getPendingTasks() {
    return request({
      url: '/api/quality/pending-tasks',
      method: 'GET'
    })
  },

  // 获取系统状态
  getSystemStatus() {
    return request({
      url: '/api/quality/system/status',
      method: 'GET'
    })
  }
} 