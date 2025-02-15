<template>
  <view class="statistics-container">
    <!-- 时间筛选器 -->
    <view class="filter-section">
      <picker 
        mode="date" 
        fields="month"
        :value="selectedDate"
        @change="onDateChange"
      >
        <view class="date-picker">
          <text class="iconfont icon-calendar"></text>
          <text>{{selectedDate || '选择月份'}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <!-- 数据概览卡片 -->
    <view class="overview-cards">
      <view class="card supplier">
        <view class="card-header">
          <text class="title">供应商数据</text>
          <text class="iconfont icon-supplier"></text>
        </view>
        <view class="card-content">
          <view class="data-item">
            <text class="label">总供应商</text>
            <text class="value">{{overview.supplier.total}}</text>
          </view>
          <view class="data-item">
            <text class="label">本月新增</text>
            <text class="value">{{overview.supplier.new}}</text>
          </view>
          <view class="data-item">
            <text class="label">本月交易额</text>
            <text class="value">¥{{overview.supplier.amount}}</text>
          </view>
          <view class="data-item">
            <text class="label">本月采购订单数</text>
            <text class="value">{{overview.supplier.orders}}</text>
          </view>
          <view class="data-item">
            <text class="label">本月退货数</text>
            <text class="value">{{overview.supplier.returns}}</text>
          </view>
        </view>
      </view>
      
      <view class="card production">
        <view class="card-header">
          <text class="title">生产数据</text>
          <text class="iconfont icon-production"></text>
        </view>
        <view class="card-content">
          <view class="data-item">
            <text class="label">生产批次</text>
            <text class="value">{{overview.production.batches}}</text>
          </view>
          <view class="data-item">
            <text class="label">生产数量</text>
            <text class="value">{{overview.production.quantity}}吨</text>
          </view>
          <view class="data-item">
            <text class="label">合格率</text>
            <text class="value">{{overview.production.passRate}}%</text>
          </view>
          <view class="data-item">
            <text class="label">生产效率</text>
            <text class="value">{{overview.production.efficiency}}%</text>
          </view>
          <view class="data-item">
            <text class="label">废品率</text>
            <text class="value">{{overview.production.waste}}%</text>
          </view>
          <view class="data-item">
            <text class="label">生产成本</text>
            <text class="value">¥{{overview.production.cost}}</text>
          </view>
        </view>
      </view>
      
      <view class="card quality">
        <view class="card-header">
          <text class="title">品控数据</text>
          <text class="iconfont icon-quality"></text>
        </view>
        <view class="card-content">
          <view class="data-item">
            <text class="label">检验批次</text>
            <text class="value">{{overview.quality.batches}}</text>
          </view>
          <view class="data-item">
            <text class="label">合格批次</text>
            <text class="value">{{overview.quality.passed}}</text>
          </view>
          <view class="data-item">
            <text class="label">不合格批次</text>
            <text class="value">{{overview.quality.failed}}</text>
          </view>
          <view class="data-item">
            <text class="label">一次合格率</text>
            <text class="value">{{overview.quality.rate}}%</text>
          </view>
          <view class="data-item">
            <text class="label">平均检验时长</text>
            <text class="value">{{overview.quality.avgTime}}分钟</text>
          </view>
          <view class="data-item">
            <text class="label">主要问题类型</text>
            <text class="value">{{overview.quality.issues.join(', ')}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 数据图表区域 -->
    <view class="chart-section">
      <!-- 生产趋势图 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="title">生产趋势</text>
          <view class="actions">
            <text class="action-btn" @tap="printChart('production')">打印</text>
          </view>
        </view>
        <view class="chart-content">
          <u-line-chart
            :points="productionData"
            :tooltipOpts="tooltipOpts"
            :xAxis="xAxisOpts"
            :yAxis="yAxisOpts"
            :legend="legendOpts"
            height="400"
          />
        </view>
      </view>
      
      <!-- 品控分析图 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="title">品控分析</text>
          <view class="actions">
            <text class="action-btn" @tap="printChart('quality')">打印</text>
          </view>
        </view>
        <view class="chart-content">
          <u-line-chart
            :points="qualityData"
            :tooltipOpts="tooltipOpts"
            :xAxis="xAxisOpts"
            :yAxis="yAxisOpts"
            :legend="legendOpts"
            height="400"
          />
        </view>
      </view>
    </view>
    
    <!-- 打印预览弹窗 -->
    <view class="modal" v-if="showPrintModal">
      <view class="modal-mask" @tap="closePrintModal"></view>
      <view class="print-modal">
        <view class="modal-header">
          <text class="modal-title">打印预览</text>
          <text class="close-btn" @tap="closePrintModal">×</text>
        </view>
        <view class="modal-content">
          <!-- 打印预览内容 -->
          <view class="print-area">
            <!-- TODO: 根据选择的图表显示对应内容 -->
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closePrintModal">取消</button>
          <button class="modal-btn confirm" @tap="confirmPrint">确认打印</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      selectedDate: '',
      showPrintModal: false,
      currentPrintType: '',
      
      // 数据概览
      overview: {
        supplier: {
          total: 0,
          new: 0,
          amount: 0,
          orders: 0,
          returns: 0
        },
        production: {
          batches: 0,
          quantity: 0,
          passRate: 0,
          efficiency: 0,
          waste: 0,
          cost: 0
        },
        quality: {
          batches: 0,
          passed: 0,
          failed: 0,
          rate: 0,
          avgTime: 0,
          issues: []  // 初始化为空数组
        },
        warehouse: {
          total: 0,
          types: 0,
          warning: 0,
          turnover: 0,
          value: 0,
          space: 0
        }
      },
      
      // 图表数据
      productionData: [],
      qualityData: [],
      
      // 图表配置
      tooltipOpts: {
        showTooltip: true,
        tooltipFontSize: 12,
        tooltipPadding: 8,
        tooltipBgColor: '#000000',
        tooltipBgOpacity: 0.7
      },
      xAxisOpts: {
        show: true,
        fontSize: 12,
        color: '#666666',
        rotateLabel: true
      },
      yAxisOpts: {
        show: true,
        fontSize: 12,
        color: '#666666',
        min: 0,
        gridType: 'dash',
        gridColor: '#CCCCCC',
        splitNumber: 5
      },
      legendOpts: {
        show: true,
        position: 'top',
        float: 'right',
        itemGap: 10,
        fontSize: 12,
        padding: [10, 10]
      }
    }
  },
  
  onLoad() {
    this.initData()
  },
  
  methods: {
    // 初始化数据
    async initData() {
      const date = new Date()
      this.selectedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      try {
        await this.loadData()
      } catch(e) {
        console.error('初始化数据失败:', e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 加载数据
    async loadData() {
      try {
        uni.showLoading({
          title: '加载中...'
        })
        const res = await api.statistics.getStatisticsData({
          date: this.selectedDate
        })
        if(res && res.data) {
          this.overview = res.data.overview
          this.updateCharts(res.data.charts)
        }
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 日期选择
    onDateChange(e) {
      this.selectedDate = e.detail.value
      this.loadData()
    },
    
    // 打印图表
    printChart(type) {
      this.currentPrintType = type
      this.showPrintModal = true
    },
    
    closePrintModal() {
      this.showPrintModal = false
      this.currentPrintType = ''
    },
    
    // 确认打印
    async confirmPrint() {
      try {
        await api.statistics.printStatistics({
          type: this.currentPrintType,
          date: this.selectedDate
        })
        uni.showToast({
          title: '打印成功'
        })
        this.closePrintModal()
      } catch(e) {
        uni.showToast({
          title: '打印失败',
          icon: 'none'
        })
      }
    },
    
    // 更新图表数据
    updateCharts(data) {
      if(!data) return
      
      // 更新生产趋势图数据
      if(data.production) {
        this.productionData = [
          {
            name: '生产数量(吨)',
            color: '#1890ff',
            points: (data.production.dates || []).map((date, index) => ({
              x: date,
              y: data.production.quantities[index] || 0
            }))
          },
          {
            name: '生产批次',
            color: '#52c41a',
            points: (data.production.dates || []).map((date, index) => ({
              x: date,
              y: data.production.batches[index] || 0
            }))
          }
        ]
      }
      
      // 更新品控趋势图数据
      if(data.quality) {
        this.qualityData = [
          {
            name: '合格批次',
            color: '#52c41a',
            points: (data.quality.departments || []).map((dept, index) => ({
              x: dept,
              y: data.quality.passed[index] || 0
            }))
          },
          {
            name: '不合格批次',
            color: '#ff4d4f',
            points: (data.quality.departments || []).map((dept, index) => ({
              x: dept,
              y: data.quality.failed[index] || 0
            }))
          }
        ]
      }
    },
  }
}
</script>

<style lang="scss">
.statistics-container {
  min-height: 100vh;
  padding: 20rpx;
  background: #f5f7fa;
}

/* 筛选器样式 */
.filter-section {
  margin-bottom: 30rpx;
  
  .date-picker {
    background: #fff;
    padding: 20rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    .iconfont {
      font-size: 32rpx;
      color: #666;
    }
    
    .arrow {
      margin-left: auto;
      font-size: 24rpx;
      color: #999;
    }
  }
}

/* 数据概览卡片样式 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
  
  .card {
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .iconfont {
        font-size: 40rpx;
      }
    }
    
    .card-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16rpx;
      
      .data-item {
        text-align: center;
        
        .label {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
          display: block;
        }
        
        .value {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
        }
      }
    }
    
    &.supplier {
      .iconfont { color: #1890ff; }
      .value { color: #1890ff; }
    }
    
    &.production {
      .iconfont { color: #52c41a; }
      .value { color: #52c41a; }
    }
    
    &.quality {
      .iconfont { color: #faad14; }
      .value { color: #faad14; }
    }
  }
}

/* 图表区域样式 */
.chart-section {
  .chart-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .action-btn {
        font-size: 28rpx;
        color: #1890ff;
        padding: 8rpx 16rpx;
        
        &:active {
          opacity: 0.8;
        }
      }
    }
    
    .chart-content {
      height: 400rpx;
      width: 100%;
    }
  }
}

/* 打印预览弹窗样式 */
.print-modal {
  width: 90%;
  max-height: 90vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  
  .modal-header {
    padding: 24rpx;
    border-bottom: 2rpx solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .close-btn {
      font-size: 40rpx;
      color: #999;
      padding: 10rpx;
    }
  }
  
  .modal-content {
    padding: 24rpx;
    max-height: calc(90vh - 180rpx);
    overflow-y: auto;
  }
  
  .modal-footer {
    padding: 24rpx;
    border-top: 2rpx solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    
    .modal-btn {
      min-width: 180rpx;
      height: 72rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
      }
      
      &.confirm {
        background: #1890ff;
        color: #fff;
      }
    }
  }
}

/* 移除旧的简单图表样式 */
.chart-simple {
  display: none;
}
</style> 