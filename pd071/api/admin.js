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
  },

  // 获取生产数据列表
  getProductionList(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                department: '磨房一部',
                productName: '精磨面粉',
                quantity: 1000,
                unit: 'kg',
                batchNo: 'PD20240120001',
                productionTime: '2024-01-20 10:30:00',
                status: 'pending',
                statusText: '待处理',
                qualityStatus: 'pending',
                qualityStatusText: '待审核',
                remark: '1月份第一批生产'
              },
              {
                id: '2',
                department: '包装部',
                productName: '特制面粉',
                quantity: 500,
                unit: 'kg',
                batchNo: 'PD20240120002',
                productionTime: '2024-01-19 15:20:00',
                status: 'approved',
                statusText: '已确认',
                remark: ''
              },
              {
                id: '3',
                department: '磨房二部',
                productName: '标准面粉',
                quantity: 800,
                unit: 'kg',
                batchNo: 'PD20240120003',
                productionTime: '2024-01-18 14:30:00',
                status: 'pending',
                statusText: '待处理',
                qualityStatus: 'pending',
                qualityStatusText: '待审核',
                remark: ''
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 品控管理相关API
  getQualityList(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                department: '磨房一部',
                productName: '精磨面粉',
                quantity: 1000,
                unit: 'kg',
                batchNo: 'PD20240120001',
                productionTime: '2024-01-20 10:30:00',
                status: 'pending',
                statusText: '待检验',
                inspector: '',
                inspectionTime: '',
                remark: '1月份第一批生产'
              },
              {
                id: '2',
                department: '磨房二部',
                productName: '特制面粉',
                quantity: 500,
                unit: 'kg',
                batchNo: 'PD20240120002',
                productionTime: '2024-01-19 15:20:00',
                status: 'passed',
                statusText: '已合格',
                inspector: '张三',
                inspectionTime: '2024-01-19 16:30:00',
                remark: ''
              },
              {
                id: '3',
                department: '磨房一部',
                productName: '标准面粉',
                quantity: 800,
                unit: 'kg',
                batchNo: 'PD20240120003',
                productionTime: '2024-01-18 14:30:00',
                status: 'failed',
                statusText: '不合格',
                inspector: '李四',
                inspectionTime: '2024-01-18 15:40:00',
                failReason: '水分含量超标',
                remark: ''
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  updateQualityResult(data) {
    return new Promise((resolve) => {
      loading.show('提交修改...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '修改成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取仓库数据列表
  getStorageList(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                productName: '精磨面粉',
                productCode: 'MF-001',
                quantity: 1000,
                unit: 'kg',
                warningThreshold: 200,
                source: '供应商',
                status: 'sufficient',
                statusText: '库存充足',
                storageTime: '2024-01-20 10:30:00',
                lastOperation: '入库操作 - 2024-01-20 10:30:00',
                remark: '1月份第一批'
              },
              {
                id: '2',
                productName: '特制面粉',
                productCode: 'MF-002',
                quantity: 150,
                unit: 'kg',
                warningThreshold: 200,
                source: '生产部',
                status: 'warning',
                statusText: '库存预警',
                storageTime: '2024-01-19 15:20:00',
                lastOperation: '出库操作 - 2024-01-20 09:15:00',
                remark: ''
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 更新库存信息
  updateStorage(params = {}) {
    return new Promise((resolve) => {
      loading.show('更新中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '更新成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 仓库调拨
  transferStorage(params = {}) {
    return new Promise((resolve) => {
      loading.show('调拨中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '调拨成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 删除库存记录
  deleteStorage(id) {
    return new Promise((resolve) => {
      loading.show('删除中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '删除成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取仓库预警列表
  getWarningList() {
    return new Promise((resolve) => {
      loading.show('加载预警数据...')
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              productName: '特制面粉',
              type: 'warning',
              typeText: '库存预警',
              description: '当前库存150kg，低于预警值200kg'
            },
            {
              id: '2',
              productName: '高筋面粉',
              type: 'insufficient',
              typeText: '库存不足',
              description: '当前库存50kg，严重不足'
            }
          ]
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取仓库操作日志
  getOperationLogs() {
    return new Promise((resolve) => {
      loading.show('加载日志...')
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              type: 'in',
              typeText: '入库',
              description: '精磨面粉入库1000kg',
              time: '2024-01-20 10:30:00'
            },
            {
              id: '2',
              type: 'out',
              typeText: '出库',
              description: '特制面粉出库200kg',
              time: '2024-01-20 09:15:00'
            },
            {
              id: '3',
              type: 'transfer',
              typeText: '调拨',
              description: '高筋面粉从供应商仓调拨至生产仓500kg',
              time: '2024-01-19 16:45:00'
            }
          ]
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取用户列表
  getUserList(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                openid: 'oXw5s5E-xhxjgGNjiDm1',
                avatarUrl: '/static/default-avatar.png',
                nickname: '张三',
                realName: '张三丰',
                phone: '13800138000',
                company: '平德面粉供应商',
                department: '磨房一部',
                status: 'active',
                statusText: '正常',
                remark: '面粉供应商负责人',
                createTime: '2024-01-20 10:30:00'
              },
              {
                id: '2',
                openid: 'oXw5s5E-xhxjgGNjiDm2',
                avatarUrl: '/static/default-avatar.png',
                nickname: '李四',
                realName: '李四光',
                phone: '13800138001',
                company: '',
                department: '品控部',
                status: 'disabled',
                statusText: '已禁用',
                remark: '品控部主管',
                createTime: '2024-01-19 15:20:00'
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 添加用户
  addUser(data) {
    return new Promise((resolve) => {
      loading.show('添加中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '添加成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 更新用户
  updateUser(data) {
    return new Promise((resolve) => {
      loading.show('更新中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '更新成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 删除用户
  deleteUser(id) {
    return new Promise((resolve) => {
      loading.show('删除中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '删除成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 切换用户状态
  toggleUserStatus(id) {
    return new Promise((resolve) => {
      loading.show('操作中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '操作成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取供应商货物列表
  getSupplierGoods(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            total: 35,
            list: [
              {
                id: '1',
                supplierName: '平德面粉供应商',
                goodsName: '精磨面粉',
                quantity: 1000,
                unit: 'kg',
                batchNo: 'PD20240120001',
                productionDate: '2024-01-20',
                shelfLife: '12个月',
                submitTime: '2024-01-20 10:30:00',
                status: 'pending',
                statusText: '待审核',
                remark: '1月份第一批货物'
              },
              {
                id: '2',
                supplierName: '优质面粉供应商',
                goodsName: '特制面粉',
                quantity: 500,
                unit: 'kg',
                batchNo: 'PD20240120002',
                productionDate: '2024-01-19',
                shelfLife: '12个月',
                submitTime: '2024-01-19 15:20:00',
                status: 'approved',
                statusText: '已通过',
                remark: ''
              },
              {
                id: '3',
                supplierName: '标准面粉供应商',
                goodsName: '标准面粉',
                quantity: 800,
                unit: 'kg',
                batchNo: 'PD20240120003',
                productionDate: '2024-01-18',
                shelfLife: '12个月',
                submitTime: '2024-01-18 14:30:00',
                status: 'rejected',
                statusText: '已拒绝',
                rejectReason: '产品水分含量超标',
                remark: ''
              }
            ]
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 通过供应商货物
  approveSupplierGoods(id) {
    return new Promise((resolve) => {
      loading.show('审核中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '审核通过'
        })
        loading.hide()
      }, 500)
    })
  },

  // 拒绝供应商货物
  rejectSupplierGoods(data) {
    return new Promise((resolve) => {
      loading.show('提交中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '已拒绝'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取供应商统计数据
  getSupplierStats() {
    return new Promise((resolve) => {
      loading.show('加载统计...')
      setTimeout(() => {
        resolve({
          data: {
            total: 128,    // 供应商总数
            active: 86,    // 本月活跃数
            pending: 5     // 待审核数
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取生产统计数据
  getProductionStats() {
    return new Promise((resolve) => {
      loading.show('加载统计...')
      setTimeout(() => {
        resolve({
          data: {
            total: 256,    // 生产总数
            pending: 12,   // 待处理数
            today: 28      // 今日生产数
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 确认生产数据
  approveProduction(id) {
    return new Promise((resolve) => {
      loading.show('处理中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '确认成功'
        })
        loading.hide()
      }, 500)
    })
  },

  // 驳回生产数据
  rejectProduction(data) {
    return new Promise((resolve) => {
      loading.show('提交中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '已驳回'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取品控统计数据
  getQualityStats() {
    return new Promise((resolve) => {
      loading.show('加载统计...')
      setTimeout(() => {
        resolve({
          data: {
            total: 328,    // 总检验数
            pending: 15,   // 待检验数
            today: 32      // 今日检验数
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 合格处理
  approveQuality(id) {
    return new Promise((resolve) => {
      loading.show('处理中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '已合格'
        })
        loading.hide()
      }, 500)
    })
  },

  // 不合格处理
  rejectQuality(data) {
    return new Promise((resolve) => {
      loading.show('提交中...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '已提交'
        })
        loading.hide()
      }, 500)
    })
  },

  // 获取统计数据
  getStatisticsData(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            overview: {
              supplier: {
                total: 128,      // 总供应商数
                new: 12,         // 本月新增
                amount: 156800   // 本月交易额
              },
              production: {
                batches: 86,     // 生产批次
                quantity: 256.8,  // 生产数量(吨)
                passRate: 98.5   // 合格率
              },
              quality: {
                batches: 86,     // 检验批次
                passed: 82,      // 合格批次
                failed: 4        // 不合格批次
              }
            },
            charts: {
              production: {
                dates: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
                quantities: [35.6, 42.8, 38.9, 45.2, 39.7, 41.5, 40.2],
                batches: [12, 15, 13, 16, 14, 15, 14]
              },
              quality: {
                departments: ['磨房一部', '磨房二部'],
                passed: [45, 38],
                failed: [2, 3]
              }
            }
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 打印统计数据
  printStatistics(data) {
    return new Promise((resolve) => {
      loading.show('准备打印...')
      setTimeout(() => {
        resolve({
          success: true,
          message: '打印成功'
        })
        loading.hide()
      }, 1000)
    })
  }
} 