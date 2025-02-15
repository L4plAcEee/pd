import { loading } from '@/utils/loading'

export default {
  // 获取统计数据
  getStatisticsData(params = {}) {
    return new Promise((resolve) => {
      loading.show('加载数据...')
      setTimeout(() => {
        resolve({
          data: {
            overview: {
              supplier: {
                total: 128,      // 供应商总数
                new: 12,         // 本月新增供应商
                amount: 156800,  // 本月采购金额
                orders: 56,      // 本月采购订单数
                returns: 3       // 本月退货数
              },
              production: {
                batches: 86,     // 生产批次
                quantity: 256.8,  // 生产数量(吨)
                passRate: 98.5,  // 合格率
                efficiency: 95.2, // 生产效率
                waste: 1.8,      // 废品率
                cost: 125600     // 生产成本
              },
              quality: {
                batches: 86,     // 检验批次
                passed: 82,      // 合格批次
                failed: 4,       // 不合格批次
                rate: 95.3,      // 一次合格率
                avgTime: 45,     // 平均检验时长(分钟)
                issues: ['水分超标', '杂质超标', '色泽异常']  // 主要问题类型
              },
              warehouse: {
                total: 1280,     // 库存总量(吨)
                types: 12,       // 产品类型数
                warning: 3,      // 预警数量
                turnover: 85,    // 周转率
                value: 986000,   // 库存价值
                space: 78        // 仓储利用率
              }
            },
            charts: {
              // 生产趋势数据
              production: {
                dates: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
                quantities: [35.6, 42.8, 38.9, 45.2, 39.7, 41.5, 40.2],
                batches: [12, 15, 13, 16, 14, 15, 14]
              },
              // 品控分析数据
              quality: {
                departments: ['磨房一部', '磨房二部', '包装部'],
                passed: [45, 38, 42],
                failed: [2, 3, 1]
              },
              // 库存分析
              warehouse: {
                categories: ['精磨面粉', '特制面粉', '标准面粉', '其他'],
                quantities: [320, 280, 450, 230],
                values: [320000, 308000, 405000, 184000]
              }
            }
          }
        })
        loading.hide()
      }, 500)
    })
  },

  // 打印统计报表
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
  },

  // 导出统计数据
  exportStatistics(params) {
    return new Promise((resolve) => {
      loading.show('导出中...')
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            url: 'https://example.com/export/statistics.xlsx'
          }
        })
        loading.hide()
      }, 1500)
    })
  }
} 