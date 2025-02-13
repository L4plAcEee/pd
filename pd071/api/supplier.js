import { loading } from '@/utils/loading'

// 供应商API
export default {
  // 提交原料订单
  submitOrder(data) {
    return new Promise((resolve) => {
      loading.show('提交订单...')
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Date.now(),
            ...data
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取历史订单
  getHistory(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载历史记录...')
      setTimeout(() => {
        resolve({
          data: {
            total: 30,
            list: [
              {
                id: '1',
                productName: '原料A',
                quantity: 500,
                price: 12.5,
                totalAmount: 6250,
                createTime: '2024-01-15 14:20:00',
                status: 'finished'
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取价格参考
  getPriceReference(productName) {
    return new Promise((resolve) => {
      loading.show('获取价格参考...')
      setTimeout(() => {
        resolve({
          data: {
            avgPrice: 12.8,    // 历史均价
            lastPrice: 12.5,   // 上次价格
            minPrice: 10.0     // 最低限价
          }
        })
        loading.hide()
      }, 500)
    })
  },
  
  // 获取产品信息（扫码）
  getProductByCode(code) {
    return new Promise((resolve) => {
      loading.show('获取产品信息...')
      setTimeout(() => {
        resolve({
          data: {
            name: '示例产品',
            suggestedPrice: 12.5,
            avgPrice: 12.8,
            lastPrice: 12.5,
            minPrice: 10.0
          }
        })
        loading.hide()
      }, 500)
    })
  },
  
  // 获取供应商列表
  getSupplierList() {
    return new Promise((resolve) => {
      loading.show('加载供应商列表...')
      setTimeout(() => {
        resolve({
          data: {
            list: [
              { name: '供应商A', code: 'SUP001' },
              { name: '供应商B', code: 'SUP002' },
              { name: '供应商C', code: 'SUP003' }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  }
} 