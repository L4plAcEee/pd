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
          <view class="chart-simple">
            <view 
              class="chart-item" 
              v-for="(item, index) in chartData.production.series" 
              :key="index"
            >
              <text class="item-name">{{item.name}}</text>
              <text class="item-value">{{item.data[item.data.length-1]}}</text>
            </view>
          </view>
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
          <view class="chart-simple">
            <view 
              class="chart-item" 
              v-for="(item, index) in chartData.quality.series" 
              :key="index"
            >
              <text class="item-name">{{item.name}}</text>
              <text class="item-value">{{item.data[0]}}</text>
            </view>
          </view>
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
          total: 0,        // 供应商总数
          new: 0,          // 本月新增供应商
          amount: 0,       // 本月采购金额
          orders: 0,       // 本月采购订单数
          returns: 0       // 本月退货数
        },
        production: {
          batches: 0,      // 生产批次
          quantity: 0,     // 生产数量(吨)
          passRate: 0,     // 合格率
          efficiency: 0,   // 生产效率
          waste: 0,        // 废品率
          cost: 0          // 生产成本
        },
        quality: {
          batches: 0,      // 检验批次
          passed: 0,       // 合格批次
          failed: 0,       // 不合格批次
          rate: 0,         // 一次合格率
          avgTime: 0,      // 平均检验时长
          issues: ['水分超标', '杂质超标']  // 主要问题类型
        },
        warehouse: {
          total: 0,        // 库存总量
          types: 0,        // 产品类型数
          warning: 0,      // 预警数量
          turnover: 0,     // 周转率
          value: 0,        // 库存价值
          space: 0         // 仓储利用率
        }
      },
      
      // 图表数据
      chartData: {
        production: {
          categories: [],
          series: []
        },
        quality: {
          categories: [],
          series: []
        }
      }
    }
  },
  
  mounted() {
    this.initData()
  },
  
  methods: {
    // 初始化数据
    async initData() {
      const date = new Date()
      this.selectedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      await this.loadData()
    },
    
    // 加载数据
    async loadData() {
      try {
        const res = await api.statistics.getStatisticsData({
          date: this.selectedDate
        })
        this.overview = res.data.overview
        // 更新图表数据
        this.updateCharts(res.data.charts)
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
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
      // 更新图表数据
      this.chartData.production = {
        categories: data.production.dates,
        series: [
          {
            name: '生产数量(吨)',
            data: data.production.quantities
          },
          {
            name: '生产批次',
            data: data.production.batches
          }
        ]
      }
      
      this.chartData.quality = {
        categories: data.quality.departments,
        series: [
          {
            name: '合格批次',
            data: data.quality.passed
          },
          {
            name: '不合格批次',
            data: data.quality.failed
          }
        ]
      }
    }
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
      // TODO: 图表样式
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

/* 简单图表样式 */
.chart-simple {
  padding: 20rpx;
  display: flex;
  justify-content: space-around;
  
  .chart-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .item-name {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    
    .item-value {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }
}
</style> 