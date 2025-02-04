import { loading } from '@/utils/loading'

// 管理员API
export default {
  // 获取仓库数据
  getStorageData() {
    return new Promise((resolve) => {
      loading.show('加载仓库数据...')
      setTimeout(() => {
        resolve({
          data: {
            supplier: 30,    // 供应商仓占比
            production: 45,  // 生产仓占比
            management: 25   // 管理仓占比
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取用户活跃度
  getUserActivity() {
    return new Promise((resolve) => {
      loading.show('加载活跃度数据...')
      setTimeout(() => {
        resolve({
          data: {
            roles: [
              { name: '供应商', value: 40 },
              { name: '生产部', value: 35 },
              { name: '品控部', value: 15 },
              { name: '管理员', value: 10 }
            ],
            timeline: [
              /* 24小时活跃度数据 */
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 审核结算单
  reviewSettlement(data) {
    return new Promise((resolve) => {
      loading.show('提交审核...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '审核完成'
        })
        loading.hide()
      }, 500)
    })
  }
} 