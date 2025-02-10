<template>
  <view class="quality-container">
    <!-- 顶部状态栏 -->
    <view class="status-bar">
      <text class="title">品控部门</text>
      <text class="status">{{status}}</text>
    </view>

    <!-- 待检验列表 -->
    <view class="inspection-list">
      <view class="list-header">
        <text class="header-title">待检验订单</text>
        <text class="count">{{pendingList.length}}个</text>
      </view>
      
      <view 
        class="inspection-item"
        v-for="(item, index) in pendingList"
        :key="index"
        @tap="handleInspection(item)"
      >
        <view class="item-header">
          <text class="order-id">订单号：{{item.orderId}}</text>
          <text class="time">{{item.time}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-row">
            <text class="label">产品：</text>
            <text class="value">{{item.productName}}</text>
          </view>
          <view class="info-row">
            <text class="label">数量：</text>
            <text class="value">{{item.quantity}}{{item.unit}}</text>
          </view>
          <view class="info-row">
            <text class="label">来源：</text>
            <text class="value">{{item.source}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 检验记录 -->
    <view class="inspection-history">
      <view class="list-header">
        <text class="header-title">检验记录</text>
      </view>
      
      <view 
        class="history-item"
        v-for="(item, index) in historyList"
        :key="index"
      >
        <view class="item-header">
          <text class="order-id">{{item.orderId}}</text>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <view class="item-content">
          <text class="product-name">{{item.productName}}</text>
          <text class="time">{{item.time}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      status: '正常运行',
      pendingList: [
        {
          orderId: 'QC20231201001',
          time: '2023-12-01 10:30',
          productName: '精磨面粉',
          quantity: 1000,
          unit: 'kg',
          source: '磨房车间'
        }
      ],
      historyList: [
        {
          orderId: 'QC20231130001',
          productName: '特制面粉',
          time: '2023-11-30 15:20',
          status: 'pass',
          statusText: '通过'
        },
        {
          orderId: 'QC20231130002',
          productName: '标准面粉',
          time: '2023-11-30 14:10',
          status: 'reject',
          statusText: '退回'
        }
      ]
    }
  },
  
  methods: {
    handleInspection(item) {
      uni.navigateTo({
        url: './inspection?id=' + item.orderId
      })
    }
  }
}
</script>

<style>
.quality-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.status-bar {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.status {
  font-size: 28rpx;
  color: #52c41a;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.count {
  font-size: 26rpx;
  color: #666;
}

.inspection-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.inspection-item {
  border-bottom: 1rpx solid #f0f0f0;
  padding: 20rpx 0;
}

.inspection-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.order-id {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.time {
  font-size: 26rpx;
  color: #999;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-row {
  display: flex;
  align-items: center;
}

.label {
  font-size: 26rpx;
  color: #666;
  width: 100rpx;
}

.value {
  font-size: 26rpx;
  color: #333;
}

.inspection-history {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.history-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.status {
  font-size: 26rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status.pass {
  background: #f6ffed;
  color: #52c41a;
}

.status.reject {
  background: #fff2f0;
  color: #ff4d4f;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}
</style> 