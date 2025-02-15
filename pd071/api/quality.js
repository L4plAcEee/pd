import { loading } from '@/utils/loading'

// 品控部门API
export default {
  // 获取统计数据
  getStats() {
    return new Promise((resolve) => {
      loading.show('加载统计数据...')
      setTimeout(() => {
        resolve({
          data: {
            pending: 12,    // 待处理数量
            today: 25,      // 今日完成数量
            rate: 96        // 合格率
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取订单列表
  getOrders(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载订单列表...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                productCode: 'MF-001',
                quantity: 100,
                params: {
                  temperature: 25,
                  pressure: 1.5
                },
                images: [
                  '/static/sample1.jpg',
                  '/static/sample2.jpg'
                ],
                deptName: '磨房',
                createTime: '2024-01-20 10:30:00',
                urgent: true
              },
              // ... 其他订单数据
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 提交审核结果
  submitReview(data) {
    return new Promise((resolve) => {
      loading.show('提交审核...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '审核提交成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取订单详情
  getOrderDetail(orderId) {
    return new Promise((resolve) => {
      loading.show('加载订单详情...')
      setTimeout(() => {
        resolve({
          data: {
            productName: '精磨面粉',
            productCode: 'MF-001',
            quantity: 1000,
            unit: 'kg',
            source: '磨房车间',
            time: '2023-12-01 10:30'
          }
        })
        loading.hide()
      }, 500)
    })
  }
} 