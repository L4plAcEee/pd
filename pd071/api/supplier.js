import { request } from '@/utils/request'

// 供应商API
export default {
  // 提交原料订单
  submitOrder(data) {
    return request({
      url: '/api/supplier/order/submit',
      method: 'POST',
      data
    })
  },

  // 获取历史订单
  getHistory(params = {}) {
    return request({
      url: '/api/supplier/order/history',
      method: 'GET',
      data: params
    })
  },

  // 获取价格参考
  getPriceReference(productName) {
    return request({
      url: '/api/supplier/price/reference',
      method: 'GET',
      data: { productName }
    })
  },
  
  // 获取产品信息（扫码）
  getProductByCode(code) {
    return request({
      url: '/api/supplier/product/scan',
      method: 'GET',
      data: { code }
    })
  },
  
  // 获取供应商列表
  getSupplierList(params = {}) {
    return request({
      url: '/api/supplier/list',
      method: 'GET',
      data: params
    })
  },

  // 添加供应商
  addSupplier(data) {
    return request({
      url: '/api/supplier/add',
      method: 'POST',
      data
    })
  },

  // 更新供应商信息
  updateSupplier(data) {
    return request({
      url: '/api/supplier/update',
      method: 'PUT',
      data
    })
  },

  // 获取供应商详情
  getSupplierDetail(id) {
    return request({
      url: `/api/supplier/${id}`,
      method: 'GET'
    })
  },

  // 获取供应商统计数据
  getSupplierStats() {
    return request({
      url: '/api/supplier/stats',
      method: 'GET'
    })
  },

  // 获取供应商订单列表
  getOrderList(params = {}) {
    return request({
      url: '/api/supplier/orders',
      method: 'GET',
      data: params
    })
  },

  // 提交供货申请
  submitSupply(data) {
    return request({
      url: '/api/supplier/supply',
      method: 'POST',
      data
    })
  },

  // 获取结算记录
  getSettlementList(params = {}) {
    return request({
      url: '/api/supplier/settlements',
      method: 'GET',
      data: params
    })
  }
} 