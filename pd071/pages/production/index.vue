<template>
  <view class="production-container">
    <!-- 添加下拉刷新 -->
    <scroll-view 
      scroll-y 
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      class="scroll-container"
    >
      <!-- 部门选择 -->
      <view class="dept-select">
        <text class="select-title">请选择部门</text>
        <view class="dept-options">
          <!-- 磨房部门 -->
          <view 
            class="dept-item"
            :class="{'dept-active': selectedDept === 'MF'}"
            @tap="selectDept('MF')"
          >
            <image class="dept-icon" src="/static/mf.png" mode="aspectFit"></image>
            <text class="dept-name">磨房部门</text>
            <text class="dept-desc">数据流转至品控部审核</text>
          </view>

          <!-- 其他部门 -->
          <view 
            class="dept-item"
            :class="{'dept-active': selectedDept === 'OTHER'}"
            @tap="selectDept('OTHER')"
          >
            <image class="dept-icon" src="/static/other.png" mode="aspectFit"></image>
            <text class="dept-name">其他部门</text>
            <text class="dept-desc">数据直接提交管理员审核</text>
          </view>
        </view>
      </view>

      <!-- 表单区域 -->
      <view class="form-content" v-if="selectedDept">
        <!-- 当选择的是其他部门时显示部门名称输入 -->
        <view class="form-item" v-if="selectedDept === 'OTHER'">
          <text class="label required">部门名称</text>
          <input
            class="input"
            v-model="formData.departmentName"
            placeholder="请输入部门名称"
          />
        </view>

        <!-- 新增产品名称 -->
        <view class="form-item">
          <text class="label required">产品名称</text>
          <view class="input-wrap">
            <input
              class="input"
              v-model="formData.productName"
              placeholder="请输入或选择产品名称"
              @focus="showProductList = true"
              @blur="onProductNameBlur"
            />
            <!-- 产品列表下拉框 -->
            <view class="history-dropdown" v-if="showProductList && filteredProducts.length">
              <view 
                class="history-item"
                v-for="(item, index) in filteredProducts"
                :key="index"
                @tap="selectProduct(item)"
              >
                <text class="item-name">{{item.name}}</text>
                <text class="item-price">￥{{formatPrice(item.lastPrice)}}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 产品编号 -->
        <view class="form-item">
          <text class="label required">产品编号</text>
          <input
            class="input"
            v-model="formData.productCode"
            placeholder="请输入产品编号"
          />
        </view>

        <!-- 生产数量 -->
        <view class="form-item">
          <text class="label required">生产数量</text>
          <view class="stepper">
            <text 
              class="step-btn"
              @tap="updateQuantity('minus')"
            >-</text>
            <input
              class="step-input"
              type="number"
              v-model="formData.quantity"
            />
            <text 
              class="step-btn"
              @tap="updateQuantity('plus')"
            >+</text>
          </view>
        </view>

        <!-- 单价 -->
        <view class="form-item">
          <text class="label required">单价(元)</text>
          <input
            class="input price-input"
            type="digit"
            v-model="formData.unitPrice"
            @input="calculateTotal"
            placeholder="请输入单价"
          />
        </view>

        <!-- 总价 -->
        <view class="form-item">
          <text class="label">总价(元)</text>
          <view class="total-price">
            <text>¥ {{totalPrice}}</text>
            <text class="price-tip" v-if="formData.unitPrice && formData.quantity">
              {{formData.quantity}} × {{formData.unitPrice}}
            </text>
          </view>
        </view>

        <!-- 备注信息 -->
        <view class="form-item">
          <text class="label">备注说明</text>
          <textarea
            class="textarea"
            v-model="formData.remark"
            placeholder="请输入备注说明"
          />
        </view>
      </view>

      <!-- 新增快捷操作区 -->
      <view class="quick-actions" v-if="selectedDept">
        <view class="action-item" @tap="scanCode">
          <text class="action-icon">📷</text>
          <text class="action-text">扫码录入</text>
        </view>
        <view class="action-item" @tap="viewHistory">
          <text class="action-icon">📋</text>
          <text class="action-text">历史记录</text>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="footer" v-if="selectedDept">
        <button 
          class="submit-btn"
          :disabled="!isValid || submitting"
          @tap="handleSubmit"
        >
          提交{{selectedDept === 'MF' ? '(待品控审核)' : '(待管理审核)'}}
        </button>
      </view>

      <!-- 提示组件 -->
      <pd-toast ref="toast" />
      <pd-loading v-if="submitting" type="global" text="提交中..." />
    </scroll-view>
  </view>
</template>

<script>
import { ORDER_STATUS } from '@/utils/constants'
import PdToast from '@/components/pd-toast/pd-toast'
import PdLoading from '@/components/pd-loading/pd-loading'

export default {
  components: {
    PdToast,
    PdLoading
  },

  data() {
    return {
      selectedDept: '',
      formData: {
        productName: '',
        productCode: '',
        departmentName: '',
        quantity: 1,
        unitPrice: '',
        totalPrice: 0,
        remark: ''
      },
      submitting: false,
      refreshing: false,
      showProductList: false,
      productList: [],
    }
  },

  computed: {
    filteredProducts() {
      if(!this.formData.productName) return this.productList
      return this.productList
        .filter(item => item.name.includes(this.formData.productName))
        .slice(0, 5)
    },

    isValid() {
      const { 
        productName,
        productCode,
        departmentName,
        quantity,
        unitPrice,
      } = this.formData

      const baseValid = productName &&
        productCode &&
        quantity > 0 &&
        unitPrice &&
        !isNaN(parseFloat(unitPrice))

      const deptNameValid = this.selectedDept === 'OTHER' ? departmentName : true

      return baseValid && deptNameValid
    },

    totalPrice() {
      if(!this.formData.unitPrice || !this.formData.quantity) return '0.00'
      const total = this.formData.quantity * parseFloat(this.formData.unitPrice)
      return total.toFixed(2)
    }
  },

  methods: {
    async initData() {
      try {
        const { data } = await this.$api.production.getProductList()
        this.productList = data.list || []
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '数据加载失败'
        })
      }
    },

    selectProduct(item) {
      this.formData.productName = item.name
      this.formData.unitPrice = item.lastPrice
      this.showProductList = false
      this.calculateTotal()
    },

    onProductNameBlur() {
      setTimeout(() => {
        this.showProductList = false
      }, 200)
    },

    async scanCode() {
      try {
        const { result } = await uni.scanCode()
        const { data } = await this.$api.production.getProductByCode(result)
        this.formData.productName = data.name
        this.formData.productCode = data.code
        this.formData.unitPrice = data.suggestedPrice
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '扫码失败'
        })
      }
    },

    viewHistory() {
      uni.navigateTo({
        url: '/pages/production/history'
      })
    },

    selectDept(dept) {
      this.selectedDept = dept
      this.resetForm()
    },

    updateQuantity(type) {
      if(type === 'minus' && this.formData.quantity > 1) {
        this.formData.quantity--
      } else if(type === 'plus') {
        this.formData.quantity++
      }
      this.calculateTotal()
    },

    calculateTotal() {
      this.formData.totalPrice = this.totalPrice
    },

    async handleSubmit() {
      if(!this.isValid || this.submitting) return
      
      this.submitting = true
      try {
        const orderData = {
          ...this.formData,
          deptCode: this.selectedDept,
          status: this.selectedDept === 'MF' ? 
            ORDER_STATUS.QC_REVIEW : 
            ORDER_STATUS.PENDING
        }

        const res = await this.$api.production.submitOrder(orderData)

        if(res.success) {
          this.$refs.toast.show({
            type: 'success',
            message: this.selectedDept === 'MF' ? 
              '提交成功，等待品控审核' : 
              '提交成功，等待管理审核'
          })
          this.resetForm()
        }
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '提交失败'
        })
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.formData = {
        productName: '',
        productCode: '',
        departmentName: '',
        quantity: 1,
        unitPrice: '',
        totalPrice: 0,
        remark: ''
      }
    },

    onRefresh() {
      this.refreshing = true
      this.initData()
      this.refreshing = false
    }
  }
}
</script>

<style>
/* 页面容器 */
.production-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 部门标识区 */
.dept-header {
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dept-info {
  color: #fff;
}

.dept-name {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.dept-code {
  font-size: 28rpx;
  opacity: 0.8;
}

.progress-circle {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.progress-label {
  color: #fff;
  font-size: 24rpx;
  opacity: 0.8;
}

/* 表单区域 */
.form-content {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

/* 数量步进器 */
.stepper {
  display: flex;
  align-items: center;
  width: 240rpx;
}

.step-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.step-input {
  flex: 1;
  height: 60rpx;
  background: #f8f8f8;
  margin: 0 20rpx;
  text-align: center;
  font-size: 28rpx;
}

/* 备注文本框 */
.textarea {
  width: 100%;
  height: 160rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

/* 底部提交 */
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

/* 价格输入框 */
.price-input {
  width: 300rpx;
}

/* 总价展示 */
.total-price {
  background: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.price-tip {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
  font-weight: normal;
}

/* 部门选择样式 */
.dept-select {
  padding: 30rpx;
}

.select-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.dept-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dept-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  transition: all 0.3s;
}

.dept-active {
  background: #e6f7ff;
  border: 2rpx solid #1890ff;
}

.dept-icon {
  width: 80rpx;
  height: 80rpx;
}

.dept-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.dept-desc {
  font-size: 24rpx;
  color: #666;
  margin-left: auto;
}

/* 表单区域在选择部门后显示 */
.form-content {
  margin-top: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

/* 新增样式 */
.input-wrap {
  position: relative;
}

.input-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.history-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.history-item {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-price {
  font-size: 24rpx;
  color: #999;
}

/* 新增快捷操作区 */
.quick-actions {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 32rpx;
  color: #333;
}

.action-text {
  font-size: 24rpx;
  color: #333;
}
</style> 