<template>
  <view class="supplier-container">
    <!-- 顶部统计卡片 -->
    <view class="stat-cards">
      <view class="stat-card">
        <text class="stat-value">{{stats.total}}</text>
        <text class="stat-label">供应商总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.active}}</text>
        <text class="stat-label">本月活跃</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.pending}}</text>
        <text class="stat-label">待审核</text>
      </view>
    </view>

    <!-- 搜索和筛选区 -->
    <view class="filter-section">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input"
          v-model="searchKey"
          placeholder="搜索供应商名称/联系人"
          @input="onSearch"
        />
      </view>
      
      <view class="filter-options">
        <picker 
          mode="selector" 
          :range="statusOptions" 
          @change="onStatusChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-filter"></text>
            <text>供应商状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        
        <picker 
          mode="selector"
          :range="categoryOptions"
          @change="onCategoryChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-category"></text>
            <text>产品类别</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 供应商列表 -->
    <scroll-view 
      class="supplier-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="supplier-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="item-header">
          <view class="header-left">
            <text class="supplier-name">{{item.name}}</text>
            <text class="supplier-code">{{item.code}}</text>
          </view>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-grid">
            <view class="info-block">
              <text class="block-label">主营产品</text>
              <text class="block-value">{{item.mainProducts}}</text>
            </view>
            <view class="info-block">
              <text class="block-label">合作时长</text>
              <text class="block-value">{{item.cooperationTime}}</text>
            </view>
            <view class="info-block">
              <text class="block-label">月均交易</text>
              <text class="block-value">{{item.monthlyTrade}}</text>
            </view>
          </view>
          
          <view class="contact-info">
            <view class="contact-item">
              <text class="iconfont icon-user"></text>
              <text class="label">联系人：</text>
              <text class="value">{{item.contact}}</text>
            </view>
            <view class="contact-item">
              <text class="iconfont icon-phone"></text>
              <text class="label">联系电话：</text>
              <text class="value">{{item.phone}}</text>
            </view>
            <view class="contact-item">
              <text class="iconfont icon-location"></text>
              <text class="label">地址：</text>
              <text class="value">{{item.address}}</text>
            </view>
          </view>
          
          <view class="quality-info">
            <view class="quality-item">
              <text class="quality-label">产品合格率</text>
              <view class="progress-bar">
                <view 
                  class="progress" 
                  :style="{width: item.qualityRate + '%'}"
                  :class="getQualityClass(item.qualityRate)"
                ></view>
              </view>
              <text class="quality-value">{{item.qualityRate}}%</text>
            </view>
            <view class="quality-item">
              <text class="quality-label">订单准时率</text>
              <view class="progress-bar">
                <view 
                  class="progress" 
                  :style="{width: item.onTimeRate + '%'}"
                  :class="getQualityClass(item.onTimeRate)"
                ></view>
              </view>
              <text class="quality-value">{{item.onTimeRate}}%</text>
            </view>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="item-actions">
          <button 
            class="action-btn view"
            @tap="viewDetail(item)"
          >
            <text class="iconfont icon-view"></text>
            <text>详情</text>
          </button>
          <button 
            class="action-btn edit"
            @tap="editItem(item)"
          >
            <text class="iconfont icon-edit"></text>
            <text>编辑</text>
          </button>
          <button 
            class="action-btn history"
            @tap="viewHistory(item)"
          >
            <text class="iconfont icon-history"></text>
            <text>历史</text>
          </button>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <text class="iconfont icon-loading loading-icon"></text>
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="!hasMore">没有更多数据了</view>
    </scroll-view>

    <!-- 添加按钮 -->
    <view class="add-btn" @tap="showAddModal">
      <text class="iconfont icon-add"></text>
    </view>

    <!-- 编辑弹窗 -->
    <uni-popup ref="editPopup" type="center">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">{{editingItem ? '编辑数据' : '添加数据'}}</text>
          <text class="close-btn" @tap="closeEditModal">×</text>
        </view>
        
        <view class="modal-content">
          <!-- 表单内容 -->
          <view class="form-item">
            <text class="form-label">供应商名称</text>
            <input 
              class="form-input"
              v-model="formData.supplierName"
              placeholder="请输入供应商名称"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">产品名称</text>
            <input 
              class="form-input"
              v-model="formData.productName"
              placeholder="请输入产品名称"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">数量</text>
            <input 
              class="form-input"
              type="number"
              v-model="formData.quantity"
              placeholder="请输入数量"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">单价</text>
            <input 
              class="form-input"
              type="digit"
              v-model="formData.price"
              placeholder="请输入单价"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button 
            class="modal-btn cancel"
            @tap="closeEditModal"
          >取消</button>
          <button 
            class="modal-btn confirm"
            @tap="submitForm"
          >确定</button>
        </view>
      </view>
    </uni-popup>

    <!-- 删除确认弹窗 -->
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
        type="warning"
        title="确认删除"
        content="是否确认删除该条数据？"
        :before-close="true"
        @confirm="confirmDelete"
        @close="closeDeletePopup"
      />
    </uni-popup>
  </view>
</template>

<style>
.supplier-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

/* 统计卡片样式 */
.stat-cards {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 12rpx;
}

.stat-label {
  font-size: 26rpx;
  color: #666;
}

/* 搜索和筛选区样式 */
.filter-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 20rpx;
}

.icon-search {
  font-size: 32rpx;
  color: #999;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.filter-options {
  display: flex;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 16rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.filter-item .iconfont {
  margin-right: 8rpx;
  font-size: 32rpx;
}

.arrow {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #999;
}

/* 供应商列表样式 */
.supplier-list {
  height: calc(100vh - 300rpx);
}

.supplier-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.supplier-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.supplier-code {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
}

.status {
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
}

.status.active {
  background: #f6ffed;
  color: #52c41a;
}

.status.pending {
  background: #fff7e6;
  color: #faad14;
}

.status.disabled {
  background: #fff1f0;
  color: #f5222d;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.info-block {
  text-align: center;
}

.block-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.block-value {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

/* 联系信息样式 */
.contact-info {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.contact-item .iconfont {
  font-size: 32rpx;
  color: #1890ff;
  margin-right: 12rpx;
}

.contact-item .label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
}

.contact-item .value {
  font-size: 28rpx;
  color: #333;
}

/* 质量信息样式 */
.quality-info {
  padding: 20rpx 0;
}

.quality-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.quality-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
}

.progress-bar {
  flex: 1;
  height: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.progress.excellent {
  background: #52c41a;
}

.progress.good {
  background: #1890ff;
}

.progress.normal {
  background: #faad14;
}

.progress.poor {
  background: #f5222d;
}

.quality-value {
  font-size: 28rpx;
  color: #333;
  width: 80rpx;
  text-align: right;
}

/* 操作按钮样式 */
.item-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0f0f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.action-btn .iconfont {
  margin-right: 8rpx;
  font-size: 32rpx;
}

.action-btn.view {
  background: #e6f7ff;
  color: #1890ff;
}

.action-btn.edit {
  background: #fff7e6;
  color: #faad14;
}

.action-btn.history {
  background: #f6ffed;
  color: #52c41a;
}

/* 添加按钮样式 */
.add-btn {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(24,144,255,0.3);
}

.add-btn .icon-add {
  color: #fff;
  font-size: 48rpx;
}
</style>

<script>
export default {
  data() {
    return {
      // 统计数据
      stats: {
        total: 128,
        active: 86,
        pending: 5
      },
      
      // 搜索和筛选
      searchKey: '',
      statusOptions: ['全部', '正常', '待审核', '已禁用'],
      categoryOptions: ['全部', '面粉', '食用油', '调味品', '其他'],
      selectedStatus: 0,
      selectedCategory: 0,
      
      // 数据列表
      dataList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      
      // 编辑相关
      editingItem: null,
      formData: {
        supplierName: '',
        productName: '',
        quantity: '',
        price: ''
      },
      
      // 删除相关
      deletingItem: null
    }
  },
  
  methods: {
    // 获取质量等级样式
    getQualityClass(rate) {
      if (rate >= 90) return 'excellent'
      if (rate >= 80) return 'good'
      if (rate >= 60) return 'normal'
      return 'poor'
    },
    
    // ... 其他方法实现
  }
}
</script> 