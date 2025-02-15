<template>
  <view class="supplier-container">
    <!-- 添加下拉刷新 -->
    <scroll-view 
      scroll-y 
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      class="scroll-container"
    >
      <!-- 头部功能区 -->
      <view class="header">
        <!-- 扫码按钮 -->
        <view class="scan-btn" @tap="handleScan">
          <text class="scan-icon">📷</text>
        </view>
        
        <!-- 今日统计 -->
        <view class="stats-card">
          <view class="stats-item">
            <text class="stats-label">今日提交</text>
            <text class="stats-value">{{todayStats.count}}单</text>
          </view>
          <view class="stats-item">
            <text class="stats-label">总金额</text>
            <text class="stats-value">￥{{formatPrice(todayStats.amount)}}</text>
          </view>
        </view>
      </view>

      <!-- 主体表单区 -->
      <view class="form-section">
        <!-- 新增供应商名称 -->
        <view class="form-item">
          <text class="label"><text class="required">*</text>供应商名称</text>
          <view class="input-wrap">
            <input
              class="input"
              v-model="formData.supplierName"
              placeholder="请输入或选择供应商名称"
              @focus="showSupplierList = true"
              @blur="onSupplierNameBlur"
            />
            <!-- 供应商列表下拉框 -->
            <view class="history-dropdown" v-if="showSupplierList && filteredSuppliers.length">
              <view 
                class="history-item"
                v-for="(item, index) in filteredSuppliers"
                :key="index"
                @tap="selectSupplier(item)"
              >
                <text class="item-name">{{item.name}}</text>
                <text class="item-code">{{item.code}}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 产品名称 -->
        <view class="form-item">
          <text class="label"><text class="required">*</text>产品名称</text>
          <view class="input-wrap">
            <input
              class="input"
              v-model="formData.productName"
              placeholder="请输入或选择产品名称"
              @input="onProductNameInput"
              @focus="showHistory = true"
              @blur="onProductNameBlur"
            />
            <!-- 历史记录下拉框 -->
            <view class="history-dropdown" v-if="showHistory && filteredHistory.length">
              <view 
                class="history-item"
                v-for="(item, index) in filteredHistory"
                :key="index"
                @tap="selectHistory(item)"
              >
                <text class="item-name">{{item.name}}</text>
                <text class="item-price">￥{{formatPrice(item.price)}}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 数量 -->
        <view class="form-item">
          <text class="label"><text class="required">*</text>数量</text>
          <view class="stepper">
            <text class="step-btn" @tap="updateQuantity(-1)">-</text>
            <input
              class="step-input"
              type="number"
              v-model="formData.quantity"
              @input="validateQuantity"
            />
            <text class="step-btn" @tap="updateQuantity(1)">+</text>
          </view>
        </view>

        <!-- 单价 -->
        <view class="form-item">
          <text class="label"><text class="required">*</text>单价</text>
          <view class="price-input-wrap">
            <input
              class="input"
              type="digit"
              v-model="formData.price"
              :class="{'price-warning': isPriceWarning}"
              @input="validatePrice"
            />
            <view class="price-tips" v-if="priceInfo.show">
              <text class="tip-item">历史均价：￥{{formatPrice(priceInfo.avgPrice)}}</text>
              <text class="tip-item">上次价格：￥{{formatPrice(priceInfo.lastPrice)}}</text>
            </view>
          </view>
        </view>

        <!-- 总价展示 -->
        <view class="total-section">
          <text class="total-label">总价</text>
          <text class="total-value">￥{{formatPrice(totalAmount)}}</text>
        </view>
      </view>

      <!-- 添加消息通知入口 -->
      <view class="message-entry" @tap="toMessage">
        <text class="message-icon">📨</text>
        <text class="message-badge" v-if="unreadCount">{{unreadCount}}</text>
      </view>
      
      <!-- 添加快捷操作区 -->
      <view class="quick-actions">
        <view class="action-item" @tap="toExport">
          <text class="action-icon">📊</text>
          <text class="action-text">导出数据</text>
        </view>
        <view class="action-item" @tap="toPrint">
          <text class="action-icon">🖨</text>
          <text class="action-text">打印记录</text>
        </view>
      </view>
      
    </scroll-view>

    <!-- 底部导航 -->
    <view class="footer">
      <button 
        class="submit-btn"
        :disabled="!canSubmit"
        @tap="handleSubmit"
      >提交订单</button>
      <text class="history-link" @tap="toHistory">历史记录</text>
    </view>

    <!-- 离线提示 -->
    <view class="offline-tip" v-if="isOffline">
      <text>当前处于离线状态，数据将在网络恢复后提交</text>
    </view>
  </view>
</template>

<script>
import supplierApi from '@/api/supplier'

export default {
  data() {
    return {
      // 表单数据
      formData: {
        supplierName: '',
        productName: '',
        quantity: 1,
        price: ''
      },
      // 今日统计
      todayStats: {
        count: 0,
        amount: 0
      },
      // 历史记录
      historyList: [],
      showHistory: false,
      // 价格信息
      priceInfo: {
        show: false,
        avgPrice: 0,
        lastPrice: 0,
        minPrice: 0 // 成本价
      },
      // 网络状态
      isOffline: false,
      refreshing: false,
      unreadCount: 0,
      // 添加防抖定时器
      inputTimer: null,
      // 添加产品缓存
      productCache: new Map(),
      // 新增供应商相关数据
      supplierList: [], // 供应商列表
      showSupplierList: false,
    }
  },
  computed: {
    // 过滤后的历史记录
    filteredHistory() {
      if(!this.formData.productName) return []
      return this.historyList
        .filter(item => item.name.includes(this.formData.productName))
        .slice(0, 5)
    },
    // 总价
    totalAmount() {
      return this.formData.quantity * (Number(this.formData.price) || 0)
    },
    // 价格是否超出预警
    isPriceWarning() {
      if(!this.formData.price) return false
      return Math.abs(this.formData.price - this.priceInfo.avgPrice) / this.priceInfo.avgPrice > 0.15
    },
    // 是否可提交
    canSubmit() {
      return this.formData.supplierName.length >= 2 && 
        this.formData.productName.length >= 2 && 
        this.formData.quantity >= 1 &&
        this.formData.price >= this.priceInfo.minPrice
    },
    // 新增供应商列表过滤计算属性
    filteredSuppliers() {
      if(!this.formData.supplierName) return this.supplierList
      return this.supplierList
        .filter(item => item.name.includes(this.formData.supplierName))
        .slice(0, 5)
    },
  },
  onLoad() {
    // 初始化数据
    this.initData()
    // 监听网络状态
    uni.onNetworkStatusChange(res => {
      this.isOffline = !res.isConnected
      if(res.isConnected) {
        this.syncOfflineData()
      }
    })
    // 恢复草稿
    this.restoreDraft()
  },
  methods: {
    // 初始化数据
    async initData() {
      try {
        // 获取供应商列表
        const { data } = await supplierApi.getSupplierList()
        this.supplierList = data.list || []
        
        // TODO: 调用接口获取数据
        this.todayStats = {
          count: 5,
          amount: 12345.67
        }
        this.historyList = [
          { name: '示例产品1', price: 100 },
          { name: '示例产品2', price: 200 }
        ]
        this.priceInfo = {
          show: false,
          avgPrice: 150,
          lastPrice: 160,
          minPrice: 80
        }
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
      }
    },
    
    // 下拉刷新
    async onRefresh() {
      this.refreshing = true
      try {
        await this.initData()
      } finally {
        this.refreshing = false
      }
    },
    
    // 优化产品名称输入处理
    onProductNameInput() {
      clearTimeout(this.inputTimer)
      this.inputTimer = setTimeout(async () => {
        if (this.formData.productName.length >= 2) {
          // 先查缓存
          if (this.productCache.has(this.formData.productName)) {
            this.priceInfo = this.productCache.get(this.formData.productName)
          } else {
            // 获取价格参考
            const res = await supplierApi.getPriceReference(this.formData.productName)
            this.priceInfo = res.data
            // 写入缓存
            this.productCache.set(this.formData.productName, res.data)
          }
          this.priceInfo.show = true
        }
      }, 300)
    },
    
    // 产品名称失焦
    onProductNameBlur() {
      setTimeout(() => {
        this.showHistory = false
      }, 200)
    },
    
    // 选择历史记录
    selectHistory(item) {
      this.formData.productName = item.name
      this.formData.price = item.price
      this.showHistory = false
      this.priceInfo.show = true
      this.saveDraft()
    },
    
    // 更新数量
    updateQuantity(delta) {
      const newValue = Number(this.formData.quantity) + delta
      if(newValue >= 1 && newValue <= 9999) {
        this.formData.quantity = newValue
        this.saveDraft()
      }
    },
    
    // 验证数量
    validateQuantity(e) {
      const value = e.detail.value
      if(value < 1) this.formData.quantity = 1
      if(value > 9999) this.formData.quantity = 9999
      this.saveDraft()
    },
    
    // 验证价格
    validatePrice() {
      this.priceInfo.show = true
      this.saveDraft()
    },
    
    // 格式化价格
    formatPrice(price) {
      return Number(price).toLocaleString('zh', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    // 提交订单
    async handleSubmit() {
      if(!this.canSubmit) return
      
      // 价格预警确认
      if(this.isPriceWarning) {
        const confirmed = await new Promise(resolve => {
          uni.showModal({
            title: '价格异常提醒',
            content: '当前单价与历史均价相差超过15%，是否继续提交？',
            success: res => resolve(res.confirm)
          })
        })
        if(!confirmed) return
      }
      
      try {
        uni.showLoading({title: '提交中'})
        // TODO: 调用提交接口
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 提交成功
        uni.hideLoading()
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        // 清空表单
        this.formData = {
          supplierName: '',
          productName: '',
          quantity: 1,
          price: ''
        }
        this.clearDraft()
      } catch(e) {
        uni.hideLoading()
        if(this.isOffline) {
          // 离线存储
          this.saveOfflineData()
          uni.showToast({
            title: '已保存至离线数据',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: '提交失败，请重试',
            icon: 'none'
          })
        }
      }
    },
    
    // 保存草稿
    saveDraft() {
      uni.setStorageSync('supplierDraft', this.formData)
    },
    
    // 恢复草稿
    restoreDraft() {
      const draft = uni.getStorageSync('supplierDraft')
      if(draft) {
        this.formData = draft
      }
    },
    
    // 清除草稿
    clearDraft() {
      uni.removeStorageSync('supplierDraft')
    },
    
    // 保存离线数据
    saveOfflineData() {
      const offlineData = uni.getStorageSync('offlineData') || []
      offlineData.push({
        ...this.formData,
        timestamp: Date.now()
      })
      uni.setStorageSync('offlineData', offlineData)
    },
    
    // 同步离线数据
    async syncOfflineData() {
      const offlineData = uni.getStorageSync('offlineData')
      if(!offlineData?.length) return
      
      try {
        // TODO: 调用批量提交接口
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 同步成功，清除离线数据
        uni.removeStorageSync('offlineData')
        uni.showToast({
          title: '离线数据同步成功',
          icon: 'success'
        })
      } catch(e) {
        console.error('离线数据同步失败', e)
      }
    },
    
    // 跳转历史记录
    toHistory() {
      uni.navigateTo({
        url: '/pages/supplier/history'
      })
    },
    
    // 优化扫码处理
    async handleScan() {
      try {
        const { result } = await uni.scanCode()
        const { data } = await supplierApi.getProductByCode(result)
        // 自动填充产品信息
        this.formData.productName = data.name
        this.formData.price = data.suggestedPrice
        this.priceInfo = {
          show: true,
          avgPrice: data.avgPrice,
          lastPrice: data.lastPrice,
          minPrice: data.minPrice
        }
      } catch (e) {
        uni.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      }
    },
    
    // 导出数据
    async toExport() {
      try {
        uni.showLoading({ title: '导出中' })
        const { data } = await supplierApi.exportData()
        // 处理文件下载
        await uni.downloadFile({
          url: data.url,
          success: (res) => {
            uni.openDocument({
              filePath: res.tempFilePath
            })
          }
        })
      } catch (e) {
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    // 打印记录
    toPrint() {
      // 跳转打印页面
      uni.navigateTo({
        url: '/pages/supplier/print'
      })
    },
    
    // 选择供应商
    selectSupplier(item) {
      this.formData.supplierName = item.name
      this.showSupplierList = false
      this.saveDraft()
    },
    
    // 供应商名称失焦
    onSupplierNameBlur() {
      setTimeout(() => {
        this.showSupplierList = false
      }, 200)
    },
  }
}
</script>

<style>
.supplier-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 120rpx;
}

/* 头部样式 */
.header {
  position: relative;
  padding: 20rpx;
}

.scan-btn {
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.scan-icon {
  font-size: 40rpx;
}

.stats-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.stats-value {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

/* 表单样式 */
.form-section {
  background: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.required {
  color: #ff4d4f;
  margin-right: 4rpx;
}

.input-wrap {
  position: relative;
}

.input {
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
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
  color: #666;
}

.stepper {
  display: flex;
  align-items: center;
}

.step-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #666;
}

.step-input {
  width: 120rpx;
  height: 60rpx;
  background: #f8f8f8;
  margin: 0 20rpx;
  text-align: center;
  font-size: 28rpx;
}

.price-input-wrap {
  position: relative;
}

.price-warning {
  border: 2rpx solid #ff4d4f;
}

.price-tips {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.tip-item {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.total-section {
  margin-top: 40rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.total-value {
  font-size: 40rpx;
  color: #ff4d4f;
  font-weight: bold;
}

/* 底部导航 */
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}

.submit-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background: #3cc51f;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  margin: 0;
  margin-right: 20rpx;
}

.history-link {
  font-size: 28rpx;
  color: #666;
  padding: 20rpx;
}

/* 离线提示 */
.offline-tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fffbe6;
  padding: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #faad14;
}

/* 添加新样式 */
.scroll-container {
  height: calc(100vh - 120rpx);
}

.message-entry {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.message-badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 6rpx;
  background: #ff4d4f;
  border-radius: 16rpx;
  color: #fff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

/* 新增供应商列表项样式 */
.item-code {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}
</style> 