import { request } from '@/utils/request'

// 管理员API
export default {
  // 获取仓库数据
  getStorageData() {
    return request({
      url: '/api/admin/storage/overview',
      method: 'GET'
    })
  },

  // 获取用户活跃度
  getUserActivity() {
    return request({
      url: '/api/admin/user/activity',
      method: 'GET'
    })
  },

  // 审核结算单
  reviewSettlement(data) {
    return request({
      url: '/api/admin/settlement/review',
      method: 'POST',
      data
    })
  },

  // 获取生产数据列表
  getProductionList(params = {}) {
    return request({
      url: '/api/admin/production/list',
      method: 'GET',
      data: params
    })
  },

  // 品控管理相关API
  getQualityList(params = {}) {
    return request({
      url: '/api/admin/quality/list',
      method: 'GET',
      data: params
    })
  },

  updateQualityResult(data) {
    return request({
      url: `/api/admin/quality/${data.id}/update`,
      method: 'PUT',
      data
    })
  },

  // 获取仓库数据列表
  getStorageList(params = {}) {
    return request({
      url: '/api/admin/storage/list',
      method: 'GET',
      data: params
    })
  },

  // 更新库存信息
  updateStorage(params = {}) {
    return request({
      url: '/api/admin/storage/update',
      method: 'PUT',
      data: params
    })
  },

  // 仓库调拨
  transferStorage(params = {}) {
    return request({
      url: '/api/admin/storage/transfer',
      method: 'POST',
      data: params
    })
  },

  // 删除库存记录
  deleteStorage(id) {
    return request({
      url: `/api/admin/storage/${id}`,
      method: 'DELETE'
    })
  },

  // 获取仓库预警列表
  getWarningList() {
    return request({
      url: '/api/admin/storage/warnings',
      method: 'GET'
    })
  },

  // 获取仓库操作日志
  getOperationLogs() {
    return request({
      url: '/api/admin/storage/logs',
      method: 'GET'
    })
  },

  // 获取用户列表
  getUserList(params = {}) {
    return request({
      url: '/api/admin/user/list',
      method: 'GET',
      data: params
    })
  },

  // 添加用户
  addUser(data) {
    return request({
      url: '/api/admin/user/add',
      method: 'POST',
      data
    })
  },

  // 更新用户
  updateUser(data) {
    return request({
      url: `/api/admin/user/${data.id}/update`,
      method: 'PUT',
      data
    })
  },

  // 删除用户
  deleteUser(id) {
    return request({
      url: `/api/admin/user/${id}`,
      method: 'DELETE'
    })
  },

  // 切换用户状态
  toggleUserStatus(id) {
    return request({
      url: `/api/admin/user/${id}/toggle-status`,
      method: 'POST'
    })
  },

  // 获取供应商货物列表
  getSupplierGoods(params = {}) {
    return request({
      url: '/api/admin/supplier/goods',
      method: 'GET',
      data: params
    })
  },

  // 审核供应商货物
  approveSupplierGoods(id) {
    return request({
      url: `/api/admin/supplier/goods/${id}/approve`,
      method: 'POST'
    })
  },

  // 拒绝供应商货物
  rejectSupplierGoods(data) {
    return request({
      url: `/api/admin/supplier/goods/${data.id}/reject`,
      method: 'POST',
      data: { rejectReason: data.rejectReason }
    })
  },

  // 获取供应商统计数据
  getSupplierStats() {
    return request({
      url: '/api/admin/supplier/stats',
      method: 'GET'
    })
  },

  // 获取生产统计数据
  getProductionStats() {
    return request({
      url: '/api/admin/production/stats',
      method: 'GET'
    })
  },

  // 确认生产数据
  approveProduction(id) {
    return request({
      url: `/api/admin/production/${id}/approve`,
      method: 'POST'
    })
  },

  // 驳回生产数据
  rejectProduction(data) {
    return request({
      url: `/api/admin/production/${data.id}/reject`,
      method: 'POST',
      data: { rejectReason: data.rejectReason }
    })
  },

  // 获取品控统计数据
  getQualityStats() {
    return request({
      url: '/api/admin/quality/stats',
      method: 'GET'
    })
  },

  // 合格处理
  approveQuality(data) {
    return request({
      url: `/api/admin/quality/${data.id}/approve`,
      method: 'POST',
      data
    })
  },

  // 不合格处理
  rejectQuality(data) {
    return request({
      url: `/api/admin/quality/${data.id}/reject`,
      method: 'POST',
      data
    })
  },

  // 获取统计数据
  getStatisticsData(params = {}) {
    return request({
      url: '/api/admin/statistics/overview',
      method: 'GET',
      data: params
    })
  },

  // 打印统计数据
  printStatistics(data) {
    return request({
      url: '/api/admin/statistics/print',
      method: 'POST',
      data
    })
  },

  // 获取仪表盘数据
  getDashboardData() {
    return request({
      url: '/api/admin/dashboard',
      method: 'GET'
    })
  },

  // 获取待处理事项
  getPendingTasks() {
    return request({
      url: '/api/admin/pending-tasks',
      method: 'GET'
    })
  },

  // 获取待审核列表
  getPendingReviews() {
    return request({
      url: '/api/admin/pending-reviews',
      method: 'GET'
    })
  },

  // 获取今日订单
  getTodayOrders() {
    return request({
      url: '/api/admin/today-orders',
      method: 'GET'
    })
  }
} 