import { request } from '@/utils/request'

export default {
  // 获取统计数据
  getStatisticsData(params = {}) {
    return request({
      url: '/api/statistics/overview',
      method: 'GET',
      data: params
    })
  },

  // 打印统计报表
  printStatistics(data) {
    return request({
      url: '/api/statistics/print',
      method: 'POST',
      data
    })
  },

  // 导出统计数据
  exportStatistics(params = {}) {
    return request({
      url: '/api/statistics/export',
      method: 'POST',
      data: params
    })
  }
} 