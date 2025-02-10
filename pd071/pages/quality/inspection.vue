<template>
  <view class="inspection-container">
    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-header">
        <text class="title">订单信息</text>
      </view>
      <view class="info-content">
        <view class="info-row">
          <text class="label">订单号：</text>
          <text class="value">{{orderInfo.orderId}}</text>
        </view>
        <view class="info-row">
          <text class="label">产品：</text>
          <text class="value">{{orderInfo.productName}}</text>
        </view>
        <view class="info-row">
          <text class="label">数量：</text>
          <text class="value">{{orderInfo.quantity}}{{orderInfo.unit}}</text>
        </view>
        <view class="info-row">
          <text class="label">来源：</text>
          <text class="value">{{orderInfo.source}}</text>
        </view>
      </view>
    </view>

    <!-- 检验表单 -->
    <view class="inspection-form">
      <view class="form-header">
        <text class="title">质检项目</text>
      </view>
      
      <view class="form-content">
        <!-- 检验项目列表 -->
        <view 
          class="check-item"
          v-for="(item, index) in checkItems"
          :key="index"
        >
          <text class="item-name">{{item.name}}</text>
          <view class="item-input">
            <input 
              type="text"
              v-model="item.value"
              :placeholder="item.placeholder"
            />
            <text class="unit">{{item.unit}}</text>
          </view>
        </view>

        <!-- 备注 -->
        <view class="remark-section">
          <text class="remark-title">备注说明</text>
          <textarea 
            v-model="remark"
            placeholder="请输入备注信息"
            class="remark-input"
          />
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button 
        class="reject-btn"
        @tap="handleReject"
      >退回</button>
      <button 
        class="pass-btn"
        @tap="handlePass"
      >通过</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      orderInfo: {
        orderId: '',
        productName: '',
        quantity: 0,
        unit: '',
        source: ''
      },
      checkItems: [
        {
          name: '水分含量',
          value: '',
          placeholder: '请输入水分含量',
          unit: '%'
        },
        {
          name: '蛋白质含量',
          value: '',
          placeholder: '请输入蛋白质含量',
          unit: '%'
        },
        {
          name: '灰分含量',
          value: '',
          placeholder: '请输入灰分含量',
          unit: '%'
        }
      ],
      remark: ''
    }
  },

  onLoad(options) {
    if(options.id) {
      this.orderId = options.id
      this.getOrderInfo()
    }
  },

  methods: {
    // 获取订单信息
    getOrderInfo() {
      // 模拟获取订单数据
      this.orderInfo = {
        orderId: this.orderId,
        productName: '精磨面粉',
        quantity: 1000,
        unit: 'kg',
        source: '磨房车间'
      }
    },

    // 处理退回
    handleReject() {
      if(!this.remark) {
        uni.showToast({
          title: '请填写退回原因',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认退回',
        content: '是否确认退回该订单？',
        success: (res) => {
          if(res.confirm) {
            // TODO: 提交退回处理
            uni.showToast({
              title: '已退回',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    },

    // 处理通过
    handlePass() {
      // 检查是否填写完整
      const incomplete = this.checkItems.some(item => !item.value)
      if(incomplete) {
        uni.showToast({
          title: '请完成所有检验项目',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认通过',
        content: '是否确认通过该订单？',
        success: (res) => {
          if(res.confirm) {
            // TODO: 提交通过处理
            uni.showToast({
              title: '已通过',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    }
  }
}
</script>

<style>
.inspection-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.order-info, .inspection-form {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.info-header, .form-header {
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 120rpx;
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.check-item {
  margin-bottom: 30rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.item-input {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
}

.item-input input {
  flex: 1;
  font-size: 28rpx;
}

.unit {
  font-size: 28rpx;
  color: #999;
  margin-left: 12rpx;
}

.remark-section {
  margin-top: 40rpx;
}

.remark-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.remark-input {
  width: 100%;
  height: 200rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 40rpx 20rpx;
}

.reject-btn, .pass-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.reject-btn {
  background: #fff2f0;
  color: #ff4d4f;
}

.pass-btn {
  background: #f6ffed;
  color: #52c41a;
}
</style> 