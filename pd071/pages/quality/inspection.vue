<template>
  <view class="inspection-container">
    <!-- 产品信息 -->
    <view class="product-info">
      <view class="info-row">
        <text class="label">产品名称：</text>
        <text class="value">{{orderInfo.productName}}</text>
      </view>
      <view class="info-row">
        <text class="label">产品编号：</text>
        <text class="value">{{orderInfo.productCode}}</text>
      </view>
      <view class="info-row">
        <text class="label">提交数量：</text>
        <text class="value">{{orderInfo.quantity}}{{orderInfo.unit}}</text>
      </view>
      <view class="info-row">
        <text class="label">来源部门：</text>
        <text class="value">{{orderInfo.source}}</text>
      </view>
      <view class="info-row">
        <text class="label">提交时间：</text>
        <text class="value">{{orderInfo.time}}</text>
      </view>
    </view>

    <!-- 品控结果 -->
    <view class="quality-result">
      <text class="section-title">品控结果</text>
      
      <!-- 合格状态选择 -->
      <view class="status-select">
        <view 
          class="status-item"
          :class="{'status-active': result.status === 'PASS'}"
          @tap="selectStatus('PASS')"
        >
          <text class="status-text">全部合格</text>
        </view>
        <view 
          class="status-item"
          :class="{'status-active': result.status === 'PARTIAL'}"
          @tap="selectStatus('PARTIAL')"
        >
          <text class="status-text">部分合格</text>
        </view>
      </view>

      <!-- 合格数量输入 -->
      <view class="quantity-input" v-if="result.status">
        <text class="input-label">合格数量</text>
        <input 
          class="step-input"
          type="digit"
          v-model="result.passQuantity"
          @input="onQuantityInput"
          :max="orderInfo.quantity"
          placeholder="请输入合格数量"
        />
        <text class="unit-text">{{orderInfo.unit}}</text>
        <text class="quantity-tip" v-if="result.passQuantity">
          最大可输入数量：{{orderInfo.quantity}}{{orderInfo.unit}}
        </text>
      </view>

      <!-- 不合格原因 -->
      <view class="reject-reason" v-if="result.status === 'PARTIAL'">
        <text class="input-label">不合格原因</text>
        <textarea
          class="reason-input"
          v-model="result.rejectReason"
          placeholder="请输入不合格原因"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="footer">
      <button 
        class="submit-btn"
        :disabled="!isValid"
        @tap="handleSubmit"
      >
        提交审核结果
      </button>
    </view>

    <!-- 提示组件 -->
    <pd-toast ref="toast" />
  </view>
</template>

<script>
import { QUALITY_STATUS } from '@/utils/constants'

export default {
  data() {
    return {
      orderId: '',
      orderInfo: {
        productName: '',
        productCode: '',
        quantity: 0,
        unit: 'kg',
        source: '',
        time: ''
      },
      result: {
        status: '', // PASS: 全部合格, PARTIAL: 部分合格
        passQuantity: 0,
        rejectReason: ''
      }
    }
  },

  computed: {
    isValid() {
      const { status, passQuantity, rejectReason } = this.result
      if (!status) return false
      
      if (status === 'PASS') {
        return passQuantity === this.orderInfo.quantity
      }
      
      return passQuantity > 0 && 
        passQuantity < this.orderInfo.quantity && 
        rejectReason.length >= 5
    }
  },

  onLoad(options) {
    this.orderId = options.id
    this.loadOrderInfo()
  },

  methods: {
    async loadOrderInfo() {
      try {
        const { data } = await this.$api.quality.getOrderDetail(this.orderId)
        this.orderInfo = data
        this.result.passQuantity = data.quantity
      } catch (e) {
        this.$refs.toast.show({
          type: 'error',
          message: '加载订单信息失败'
        })
      }
    },

    selectStatus(status) {
      this.result.status = status
      if (status === 'PASS') {
        this.result.passQuantity = this.orderInfo.quantity
        this.result.rejectReason = ''
      }
    },

    onQuantityInput(e) {
      let value = e.detail.value
      // 转换为数字
      value = parseFloat(value) || 0
      // 限制最大值
      if (value > this.orderInfo.quantity) {
        value = this.orderInfo.quantity
        this.$refs.toast.show({
          type: 'warning',
          message: '不能超过提交数量'
        })
      }
      this.result.passQuantity = value
    },

    async handleSubmit() {
      if (!this.isValid) return

      try {
        const res = await this.$api.quality.submitReview({
          orderId: this.orderId,
          status: this.result.status,
          passQuantity: this.result.passQuantity,
          rejectReason: this.result.rejectReason
        })

        if (res.success) {
          this.$refs.toast.show({
            type: 'success',
            message: '审核结果提交成功'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (e) {
        this.$refs.toast.show({
          type: 'error',
          message: '提交失败'
        })
      }
    }
  }
}
</script>

<style>
.inspection-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.product-info {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  margin-bottom: 16rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
}

.value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.quality-result {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.status-select {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.status-item {
  flex: 1;
  height: 80rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.status-text {
  font-size: 28rpx;
  color: #333;
}

.quantity-input {
  margin-bottom: 30rpx;
  position: relative;
}

.input-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.step-input {
  width: 100%;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 120rpx 0 20rpx;
  text-align: center;
  font-size: 28rpx;
}

.unit-text {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #666;
}

.quantity-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.reason-input {
  width: 100%;
  height: 160rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #1890ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  margin: 0;
}

.submit-btn[disabled] {
  opacity: 0.5;
}
</style> 