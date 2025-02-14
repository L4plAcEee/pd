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

    <!-- 搜索和筛选区域 -->
    <view class="filter-section">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input"
          v-model="searchKey"
          placeholder="搜索供应商/货物名称"
          @input="onSearch"
        />
      </view>
      
      <view class="filter-options">
        <picker 
          mode="selector" 
          :range="auditStatus" 
          @change="onStatusChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-filter"></text>
            <text>审核状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 货物列表 -->
    <scroll-view 
      class="goods-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="goods-item"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <view class="item-header">
          <text class="supplier-name">{{item.supplierName}}</text>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-row">
            <text class="label">货物名称：</text>
            <text class="value">{{item.goodsName}}</text>
          </view>
          <view class="info-row">
            <text class="label">数量/规格：</text>
            <text class="value">{{item.quantity}}{{item.unit}}</text>
          </view>
          <view class="info-row">
            <text class="label">提交时间：</text>
            <text class="value">{{item.submitTime}}</text>
          </view>
          <view class="info-row" v-if="item.status === 'rejected'">
            <text class="label">拒绝原因：</text>
            <text class="value reject-reason">{{item.rejectReason}}</text>
          </view>
        </view>
        
        <view class="item-footer">
          <button class="action-btn detail" @tap="viewDetail(item)">
            查看详情
          </button>
          <template v-if="item.status === 'pending'">
            <button class="action-btn reject" @tap="showRejectModal(item)">
              拒绝
            </button>
            <button class="action-btn approve" @tap="approveGoods(item)">
              通过
            </button>
          </template>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="detail-modal">
        <view class="modal-header">
          <text class="modal-title">货物详情</text>
          <text class="close-btn" @tap="closeDetailPopup">×</text>
        </view>
        
        <view class="modal-content">
          <view class="detail-row">
            <text class="label">供应商</text>
            <text class="value">{{selectedItem?.supplierName}}</text>
          </view>
          <view class="detail-row">
            <text class="label">货物名称</text>
            <text class="value">{{selectedItem?.goodsName}}</text>
          </view>
          <view class="detail-row">
            <text class="label">数量规格</text>
            <text class="value">{{selectedItem?.quantity}}{{selectedItem?.unit}}</text>
          </view>
          <view class="detail-row">
            <text class="label">生产日期</text>
            <text class="value">{{selectedItem?.productionDate}}</text>
          </view>
          <view class="detail-row">
            <text class="label">保质期</text>
            <text class="value">{{selectedItem?.shelfLife}}</text>
          </view>
          <view class="detail-row">
            <text class="label">批次号</text>
            <text class="value">{{selectedItem?.batchNo}}</text>
          </view>
          <view class="detail-row">
            <text class="label">提交时间</text>
            <text class="value">{{selectedItem?.submitTime}}</text>
          </view>
          <view class="detail-row">
            <text class="label">备注说明</text>
            <text class="value">{{selectedItem?.remark || '无'}}</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 拒绝原因弹窗 -->
    <uni-popup ref="rejectPopup" type="center">
      <view class="reject-modal">
        <view class="modal-header">
          <text class="modal-title">拒绝原因</text>
          <text class="close-btn" @tap="closeRejectPopup">×</text>
        </view>
        
        <view class="modal-content">
          <textarea
            class="reject-reason"
            v-model="rejectReason"
            placeholder="请输入拒绝原因"
          />
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeRejectPopup">取消</button>
          <button class="modal-btn confirm" @tap="rejectGoods">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss">
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
  
  .stat-card {
    flex: 1;
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    
    &:nth-child(1) {
      .stat-value { color: #1890ff; }
      background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
    }
    
    &:nth-child(2) {
      .stat-value { color: #52c41a; }
      background: linear-gradient(135deg, #f6ffed 0%, #ffffff 100%);
    }
    
    &:nth-child(3) {
      .stat-value { color: #faad14; }
      background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
    }
    
    .stat-value {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 12rpx;
    }
    
    .stat-label {
      font-size: 26rpx;
      color: #666;
    }
  }
}

/* 搜索和筛选区样式 */
.filter-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .search-box {
    display: flex;
    align-items: center;
    background: #f5f7fa;
    border-radius: 8rpx;
    padding: 16rpx;
    margin-bottom: 20rpx;
    
    .icon-search {
      font-size: 32rpx;
      color: #999;
      margin-right: 16rpx;
    }
    
    .search-input {
      flex: 1;
      font-size: 28rpx;
      height: 48rpx;
      line-height: 48rpx;
    }
  }
  
  .filter-options {
    display: flex;
    gap: 20rpx;
    
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
      transition: all 0.3s;
      
      &:active {
        background: #e6f7ff;
      }
      
      .iconfont {
        margin-right: 8rpx;
        font-size: 32rpx;
      }
      
      .arrow {
        margin-left: 8rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

/* 货物列表样式 */
.goods-list {
  height: calc(100vh - 300rpx);
  
  .goods-item {
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.98);
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .supplier-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .status {
        padding: 4rpx 16rpx;
        border-radius: 4rpx;
        font-size: 24rpx;
        
        &.pending {
          background: #fff7e6;
          color: #faad14;
        }
        
        &.approved {
          background: #f6ffed;
          color: #52c41a;
        }
        
        &.rejected {
          background: #fff1f0;
          color: #f5222d;
        }
      }
    }
    
    .item-content {
      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        
        .label {
          font-size: 28rpx;
          color: #666;
          width: 160rpx;
        }
        
        .value {
          font-size: 28rpx;
          color: #333;
          
          &.reject-reason {
            color: #f5222d;
          }
        }
      }
    }
    
    .item-footer {
      display: flex;
      gap: 20rpx;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 2rpx solid #f0f0f0;
      
      .action-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64rpx;
        border-radius: 8rpx;
        font-size: 28rpx;
        transition: all 0.3s;
        
        &.detail {
          background: #e6f7ff;
          color: #1890ff;
          &:active {
            background: darken(#e6f7ff, 5%);
          }
        }
        
        &.reject {
          background: #fff7e6;
          color: #faad14;
          &:active {
            background: darken(#fff7e6, 5%);
          }
        }
        
        &.approve {
          background: #f6ffed;
          color: #52c41a;
          &:active {
            background: darken(#f6ffed, 5%);
          }
        }
      }
    }
  }
}

/* 弹窗样式优化 */
.detail-modal, .reject-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  animation: modalFadeIn 0.3s;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      padding-left: 24rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 28rpx;
        background: #1890ff;
        border-radius: 3rpx;
      }
    }
    
    .close-btn {
      font-size: 32rpx;
      color: #999;
      padding: 10rpx;
      margin: -10rpx;
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s;
      
      &:active {
        background: #f5f5f5;
        color: #333;
      }
    }
  }
  
  .modal-content {
    max-height: calc(80vh - 180rpx);
    overflow-y: auto;
    
    /* 详情弹窗内容样式 */
    .detail-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 24rpx;
      padding: 16rpx;
      background: #fafafa;
      border-radius: 8rpx;
      transition: all 0.3s;
      
      &:hover {
        background: #f0f7ff;
      }
      
      .label {
        font-size: 28rpx;
        color: #666;
        width: 160rpx;
        padding-right: 20rpx;
      }
      
      .value {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        word-break: break-all;
      }
    }
    
    /* 拒绝原因输入框样式 */
    .reject-reason {
      width: 100%;
      height: 320rpx;
      padding: 24rpx;
      background: #fafafa;
      border: 2rpx solid #f0f0f0;
      border-radius: 12rpx;
      font-size: 28rpx;
      color: #333;
      transition: all 0.3s;
      
      &:focus {
        background: #fff;
        border-color: #1890ff;
      }
      
      &::placeholder {
        color: #999;
      }
    }
  }
  
  .modal-footer {
    margin-top: 32rpx;
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    
    .modal-btn {
      min-width: 180rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8rpx;
      font-size: 28rpx;
      transition: all 0.3s;
      
      &.cancel {
        background: #f5f5f5;
        color: #666;
        
        &:active {
          background: darken(#f5f5f5, 5%);
        }
      }
      
      &.confirm {
        background: #1890ff;
        color: #fff;
        
        &:active {
          background: darken(#1890ff, 5%);
        }
      }
    }
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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
      auditStatus: ['全部', '待审核', '已通过', '已拒绝'],
      selectedStatus: 0,
      
      // 列表数据
      goodsList: [],
      refreshing: false,
      
      // 当前选中项
      selectedItem: null,
      
      // 拒绝原因
      rejectReason: ''
    }
  },
  
  mounted() {
    this.loadData()
    this.loadStats()
  },
  
  methods: {
    // 加载数据
    async loadData() {
      try {
        const params = {
          keyword: this.searchKey,
          status: ['all', 'pending', 'approved', 'rejected'][this.selectedStatus]
        }
        const res = await this.$api.admin.getSupplierGoods(params)
        this.goodsList = res.data.list
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 加载统计数据
    async loadStats() {
      try {
        const res = await this.$api.admin.getSupplierStats()
        this.stats = res.data
      } catch(e) {
        console.error(e)
      }
    },
    
    // 搜索
    onSearch() {
      this.resetList()
      this.loadData()
    },
    
    // 状态筛选
    onStatusChange(e) {
      this.selectedStatus = e.detail.value
      this.resetList()
      this.loadData()
    },
    
    // 重置列表
    resetList() {
      this.goodsList = []
    },
    
    // 查看详情
    viewDetail(item) {
      this.selectedItem = item
      this.$refs.detailPopup.open()
    },
    
    closeDetailPopup() {
      this.$refs.detailPopup.close()
      this.selectedItem = null
    },
    
    // 拒绝相关
    showRejectModal(item) {
      this.selectedItem = item
      this.rejectReason = ''
      this.$refs.rejectPopup.open()
    },
    
    closeRejectPopup() {
      this.$refs.rejectPopup.close()
      this.selectedItem = null
      this.rejectReason = ''
    },
    
    async rejectGoods() {
      if (!this.rejectReason) {
        uni.showToast({
          title: '请输入拒绝原因',
          icon: 'none'
        })
        return
      }
      
      try {
        await this.$api.admin.rejectSupplierGoods({
          id: this.selectedItem.id,
          rejectReason: this.rejectReason
        })
        
        uni.showToast({
          title: '已拒绝'
        })
        this.closeRejectPopup()
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    // 通过审核
    async approveGoods(item) {
      try {
        await this.$api.admin.approveSupplierGoods(item.id)
        uni.showToast({
          title: '已通过'
        })
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    // 下拉刷新和加载更多
    async refresh() {
      this.refreshing = true
      await this.loadData()
      this.refreshing = false
    },
    
    loadMore() {
      // TODO: 实现分页加载
    }
  }
}
</script> 