import { loading } from '@/utils/loading'
import { ORDER_STATUS } from '@/utils/constants'

// 生产部门API
export default {
  // 提交生产订单
  submitOrder(data) {
    return new Promise((resolve) => {
      loading.show('提交订单...')
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Date.now(),
            status: ORDER_STATUS.PENDING,
            ...data
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
            total: 25,
            list: [
              {
                id: '1',
                productCode: 'MF-001',
                quantity: 100,
                unitPrice: 15.5,
                totalPrice: 1550,
                status: ORDER_STATUS.PENDING,
                createTime: '2024-01-20 10:30:00'
              },
              // ... 其他订单数据
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取统计数据
  getStats() {
    return new Promise((resolve) => {
      loading.show('加载统计数据...')
      setTimeout(() => {
        resolve({
          data: {
            today: 12,      // 今日订单
            pending: 5,     // 待处理
            finished: 45    // 已完成
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取产品列表
  getProductList() {
    return new Promise((resolve) => {
      loading.show('加载产品列表...')
      setTimeout(() => {
        resolve({
          data: {
            list: [
              {
                name: '产品A',
                code: 'S230815-0001',
                lastPrice: 15.5,
                suggestedPrice: 15.8
              },
              {
                name: '产品B',
                code: 'S230815-0002',
                lastPrice: 12.5,
                suggestedPrice: 12.8
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 扫码获取产品信息
  getProductByCode(code) {
    return new Promise((resolve) => {
      loading.show('获取产品信息...')
      setTimeout(() => {
        resolve({
          data: {
            name: '产品A',
            code: 'S230815-0001',
            suggestedPrice: 15.8,
            lastPrice: 15.5
          }
        })
        loading.hide()
      }, 500)
    })
  }
} 