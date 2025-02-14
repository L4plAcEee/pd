<template>
  <view class="production-container">
    <!-- 顶部统计卡片 -->
    <view class="stat-cards">
      <view class="stat-card">
        <text class="stat-value">{{stats.total}}</text>
        <text class="stat-label">生产总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.pending}}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.today}}</text>
        <text class="stat-label">今日生产</text>
      </view>
    </view>

    <!-- 搜索和筛选区域 -->
    <view class="filter-section">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input"
          v-model="searchKey"
          placeholder="搜索产品名称/批次号"
          @input="onSearch"
        />
      </view>
      
      <view class="filter-options">
        <picker 
          mode="selector" 
          :range="departments" 
          @change="onDepartmentChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-dept"></text>
            <text>生产部门</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        
        <picker 
          mode="selector" 
          :range="productionStatus" 
          @change="onStatusChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-filter"></text>
            <text>生产状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 生产数据列表 -->
    <scroll-view 
      class="production-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="production-item"
        v-for="(item, index) in productionList"
        :key="index"
      >
        <view class="item-header">
          <text class="dept-name">{{item.department}}</text>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-row">
            <text class="label">产品名称：</text>
            <text class="value">{{item.productName}}</text>
          </view>
          <view class="info-row">
            <text class="label">生产数量：</text>
            <text class="value">{{item.quantity}}{{item.unit}}</text>
          </view>
          <view class="info-row">
            <text class="label">批次号：</text>
            <text class="value">{{item.batchNo}}</text>
          </view>
          <view class="info-row">
            <text class="label">生产时间：</text>
            <text class="value">{{item.productionTime}}</text>
          </view>
          
          <!-- 磨房部门显示品控进度 -->
          <view class="quality-status" v-if="item.department.includes('磨房')">
            <text class="status-label">品控状态：</text>
            <text class="status-text" :class="item.qualityStatus">
              {{item.qualityStatusText}}
            </text>
          </view>
        </view>
        
        <view class="item-footer">
          <button class="action-btn detail" @tap="viewDetail(item)">
            查看详情
          </button>
          <template v-if="!item.department.includes('磨房') && item.status === 'pending'">
            <button class="action-btn reject" @tap="showRejectModal(item)">
              驳回
            </button>
            <button class="action-btn approve" @tap="approveProduction(item)">
              确认
            </button>
          </template>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="detail-modal">
        <view class="modal-header">
          <text class="modal-title">生产详情</text>
          <text class="close-btn" @tap="closeDetailPopup">×</text>
        </view>
        
        <view class="modal-content">
          <!-- 部门和状态 -->
          <view class="detail-section">
            <view class="section-header">
              <text class="dept-name">{{selectedItem?.department}}</text>
              <text class="status" :class="selectedItem?.status">
                {{selectedItem?.statusText}}
              </text>
            </view>
          </view>
          
          <!-- 基本信息 -->
          <view class="detail-section">
            <view class="section-title">基本信息</view>
            <view class="detail-row">
              <text class="label">产品名称</text>
              <text class="value">{{selectedItem?.productName}}</text>
            </view>
            <view class="detail-row">
              <text class="label">生产数量</text>
              <text class="value">{{selectedItem?.quantity}}{{selectedItem?.unit}}</text>
            </view>
            <view class="detail-row">
              <text class="label">批次号</text>
              <text class="value">{{selectedItem?.batchNo}}</text>
            </view>
            <view class="detail-row">
              <text class="label">生产时间</text>
              <text class="value">{{selectedItem?.productionTime}}</text>
            </view>
          </view>
          
          <!-- 品控信息(仅磨房部门显示) -->
          <view class="detail-section" v-if="selectedItem?.department.includes('磨房')">
            <view class="section-title">品控信息</view>
            <view class="detail-row">
              <text class="label">品控状态</text>
              <text class="status-tag" :class="selectedItem?.qualityStatus">
                {{selectedItem?.qualityStatusText}}
              </text>
            </view>
            <view class="detail-row" v-if="selectedItem?.qualityStatus === 'failed'">
              <text class="label">不合格原因</text>
              <text class="value error">{{selectedItem?.qualityReason || '-'}}</text>
            </view>
          </view>
          
          <!-- 备注信息 -->
          <view class="detail-section">
            <view class="section-title">备注说明</view>
            <view class="remark-content">
              {{selectedItem?.remark || '暂无备注'}}
            </view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 驳回原因弹窗 -->
    <uni-popup ref="rejectPopup" type="center">
      <view class="reject-modal">
        <!-- 弹窗内容... -->
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 统计数据
      stats: {
        total: 0,
        pending: 0,
        today: 0
      },
      
      // 搜索和筛选
      searchKey: '',
      departments: ['全部', '磨房一部', '磨房二部', '包装部', '仓储部'],
      selectedDepartment: 0,
      productionStatus: ['全部', '待处理', '已确认', '已驳回'],
      selectedStatus: 0,
      
      // 列表数据
      productionList: [],
      refreshing: false,
      
      // 当前选中项
      selectedItem: null,
      
      // 驳回原因
      rejectReason: ''
    }
  },
  
  mounted() {
    this.loadData()
    this.loadStats()
  },
  
  methods: {
    // 加载统计数据
    async loadStats() {
      try {
        const res = await this.$api.admin.getProductionStats()
        this.stats = res.data
      } catch(e) {
        console.error(e)
      }
    },

    // 加载生产数据列表
    async loadData() {
      try {
        const params = {
          keyword: this.searchKey,
          department: this.departments[this.selectedDepartment],
          status: ['all', 'pending', 'approved', 'rejected'][this.selectedStatus]
        }
        const res = await this.$api.admin.getProductionList(params)
        this.productionList = res.data.list
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    // 搜索
    onSearch() {
      this.resetList()
      this.loadData()
    },

    // 部门筛选
    onDepartmentChange(e) {
      this.selectedDepartment = e.detail.value
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
      this.productionList = []
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

    // 驳回相关
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

    async rejectProduction() {
      if (!this.rejectReason) {
        uni.showToast({
          title: '请输入驳回原因',
          icon: 'none'
        })
        return
      }
      
      try {
        await this.$api.admin.rejectProduction({
          id: this.selectedItem.id,
          rejectReason: this.rejectReason
        })
        
        uni.showToast({
          title: '已驳回'
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

    // 确认生产数据
    async approveProduction(item) {
      try {
        await this.$api.admin.approveProduction(item.id)
        uni.showToast({
          title: '已确认'
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

<style lang="scss">
.production-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

/* 统计卡片样式优化 */
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
      .stat-value { color: #faad14; }
      background: linear-gradient(135deg, #fff7e6 0%, #ffffff 100%);
    }
    
    &:nth-child(3) {
      .stat-value { color: #52c41a; }
      background: linear-gradient(135deg, #f6ffed 0%, #ffffff 100%);
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

/* 搜索和筛选区样式优化 */
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

/* 生产数据列表样式优化 */
.production-list {
  height: calc(100vh - 300rpx);
  
  .production-item {
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
      
      .dept-name {
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
        }
      }
      
      .quality-status {
        margin-top: 20rpx;
        padding: 16rpx;
        background: #fafafa;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        
        .status-label {
          font-size: 28rpx;
          color: #666;
          margin-right: 16rpx;
        }
        
        .status-text {
          font-size: 28rpx;
          padding: 4rpx 16rpx;
          border-radius: 4rpx;
          
          &.pending {
            background: #fff7e6;
            color: #faad14;
          }
          
          &.passed {
            background: #f6ffed;
            color: #52c41a;
          }
          
          &.failed {
            background: #fff1f0;
            color: #f5222d;
          }
        }
      }
    }
  }
}

/* 详情弹窗样式优化 */
.detail-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  animation: modalFadeIn 0.3s;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: #fafafa;
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
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #999;
      border-radius: 50%;
      transition: all 0.3s;
      
      &:active {
        background: #f5f5f5;
        color: #333;
      }
    }
  }
  
  .modal-content {
    padding: 24rpx;
    max-height: calc(80vh - 180rpx);
    overflow-y: auto;
    
    .detail-section {
      margin-bottom: 32rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;
        padding-bottom: 16rpx;
        border-bottom: 2rpx solid #f0f0f0;
        
        .dept-name {
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
      
      .section-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
        position: relative;
        padding-left: 16rpx;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4rpx;
          height: 24rpx;
          background: #1890ff;
          border-radius: 2rpx;
        }
      }
      
      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        padding: 12rpx 16rpx;
        background: #fafafa;
        border-radius: 8rpx;
        transition: all 0.3s;
        
        &:hover {
          background: #f0f7ff;
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
          
          &.error {
            color: #f5222d;
          }
        }
        
        .status-tag {
          padding: 4rpx 16rpx;
          border-radius: 4rpx;
          font-size: 24rpx;
          
          &.pending {
            background: #fff7e6;
            color: #faad14;
          }
          
          &.passed {
            background: #f6ffed;
            color: #52c41a;
          }
          
          &.failed {
            background: #fff1f0;
            color: #f5222d;
          }
        }
      }
      
      .remark-content {
        padding: 16rpx;
        background: #fafafa;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #666;
        min-height: 120rpx;
      }
    }
  }
}

/* 驳回原因弹窗样式 */
.reject-modal {
  width: 80%;
  max-width: 600rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
}

.reject-modal .form-item {
  margin-bottom: 16rpx;
}

.form-label {
  font-size: 24rpx;
  color: #999;
}

.form-input {
  width: 100%;
  padding: 12rpx;
  border: 1rpx solid #d9d9d9;
  border-radius: 4rpx;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
}

.modal-btn {
  padding: 8rpx 16rpx;
  border: none;
  border-radius: 4rpx;
  font-size: 28rpx;
  color: #fff;
}

.modal-btn.cancel {
  background: linear-gradient(135deg, #999, #666);
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #52c41a, #389e0d);
}
</style> 