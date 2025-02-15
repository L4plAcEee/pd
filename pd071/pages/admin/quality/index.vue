<template>
  <view class="quality-container">
    <!-- 顶部统计卡片 -->
    <view class="stat-cards">
      <view class="stat-card">
        <text class="stat-value">{{stats.total}}</text>
        <text class="stat-label">总检验数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.pending}}</text>
        <text class="stat-label">待检验</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.today}}</text>
        <text class="stat-label">今日检验</text>
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
          :range="qualityStatus" 
          @change="onStatusChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-filter"></text>
            <text>检验状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 品控数据列表 -->
    <scroll-view 
      class="quality-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="quality-item"
        v-for="(item, index) in dataList"
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
          <view class="info-row" v-if="item.inspector">
            <text class="label">检验人员：</text>
            <text class="value">{{item.inspector}}</text>
          </view>
          <view class="info-row" v-if="item.inspectionTime">
            <text class="label">检验时间：</text>
            <text class="value">{{item.inspectionTime}}</text>
          </view>
        </view>
        
        <view class="item-footer">
          <button class="action-btn detail" @tap="viewDetail(item)">
            查看详情
          </button>
          <template v-if="item.status === 'pending'">
            <button class="action-btn reject" @tap="showRejectModal(item)">
              不合格
            </button>
            <button class="action-btn approve" @tap="approveQuality(item)">
              合格
            </button>
          </template>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <view class="modal" v-if="showDetailModal">
      <view class="modal-mask" @tap="closeDetailPopup"></view>
      <view class="detail-modal">
        <view class="modal-header">
          <text class="modal-title">检验详情</text>
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
          
          <!-- 检验信息 -->
          <view class="detail-section">
            <view class="section-title">检验信息</view>
            <view class="detail-row">
              <text class="label">检验人员</text>
              <text class="value">{{selectedItem?.inspector || '-'}}</text>
            </view>
            <view class="detail-row">
              <text class="label">检验时间</text>
              <text class="value">{{selectedItem?.inspectionTime || '-'}}</text>
            </view>
            <view class="detail-row" v-if="selectedItem?.failReason">
              <text class="label">不合格原因</text>
              <text class="value error">{{selectedItem?.failReason}}</text>
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
    </view>

    <!-- 不合格原因弹窗 -->
    <view class="modal" v-if="showRejectModal">
      <view class="modal-mask" @tap="closeRejectPopup"></view>
      <view class="reject-modal">
        <view class="modal-header">
          <text class="modal-title">填写不合格原因</text>
          <text class="close-btn" @tap="closeRejectPopup">×</text>
        </view>
        
        <view class="modal-content">
          <textarea
            class="reject-reason"
            v-model="rejectReason"
            placeholder="请输入不合格原因"
            maxlength="200"
          ></textarea>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeRejectPopup">取消</button>
          <button class="modal-btn confirm" @tap="rejectQuality">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 状态切换
      tabs: [
        { name: '待品控', badge: 0 },
        { name: '已品控', badge: 0 }
      ],
      activeTab: 0,
      
      // 搜索和筛选
      searchKey: '',
      departments: ['全部', '磨房一部', '磨房二部', '包装部'],
      selectedDept: 0,
      qualityStatus: ['全部', '待检验', '合格', '不合格'],
      selectedStatus: 0,
      
      // 数据列表
      dataList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      
      // 编辑相关
      editingItem: null,
      formData: {
        passQuantity: '',
        rejectReason: ''
      },
      stats: {
        total: 0,
        pending: 0,
        today: 0
      },
      
      // 当前选中项
      selectedItem: null,
      
      // 不合格原因
      rejectReason: '',
      
      // 控制弹窗显示
      showDetailModal: false,
      showRejectModal: false
    }
  },
  
  async onLoad() {
    try {
      // 获取品控统计数据
      const statsData = await this.$api.admin.getQualityStats()
      if (statsData) {
        this.stats = statsData
        // 更新待品控标签数量
        this.tabs[0].badge = statsData.pending || 0
      }
      
      // 加载列表数据
      await this.loadData()
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },
  
  methods: {
    // 查看详情
    viewDetail(item) {
      this.selectedItem = item
      this.showDetailModal = true
    },
    
    // 编辑品控结果
    editItem(item) {
      this.editingItem = item
      this.formData = {
        passQuantity: item.passQuantity,
        rejectReason: item.rejectReason || ''
      }
      this.$refs.editPopup.open()
    },
    
    // 关闭编辑弹窗
    closeEditModal() {
      this.$refs.editPopup.close()
      this.editingItem = null
      this.formData = {
        passQuantity: '',
        rejectReason: ''
      }
    },
    
    // 提交表单
    async submitForm() {
      if(!this.editingItem) return
      
      try {
        const res = await this.$api.admin.updateQualityResult({
          id: this.editingItem.id,
          ...this.formData
        })
        
        if(res.success) {
          uni.showToast({
            title: '修改成功'
          })
          this.closeEditModal()
          this.resetList()
          this.loadData()
        }
      } catch(e) {
        uni.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    },

    onDepartmentChange(e) {
      this.selectedDept = e.detail.value
      this.resetList()
      this.loadData()
    },

    onStatusChange(e) {
      this.selectedStatus = e.detail.value
      this.resetList()
      this.loadData()
    },

    onSearch() {
      this.resetList()
      this.loadData()
    },

    loadMore() {
      // TODO: 实现分页加载
    },

    refresh() {
      // TODO: 实现下拉刷新
    },

    showRejectModal(item) {
      this.selectedItem = item
      this.rejectReason = ''
      this.showRejectModal = true
    },

    closeRejectPopup() {
      this.showRejectModal = false
      this.selectedItem = null
      this.rejectReason = ''
    },

    async rejectQuality() {
      if (!this.rejectReason) {
        uni.showToast({
          title: '请输入不合格原因',
          icon: 'none'
        })
        return
      }
      
      try {
        await this.$api.admin.rejectQuality({
          id: this.selectedItem.id,
          failReason: this.rejectReason,
          inspector: '当前用户姓名' // TODO: 从用户信息中获取
        })
        
        uni.showToast({
          title: '已提交'
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

    async approveQuality(item) {
      try {
        await this.$api.admin.approveQuality({
          id: item.id,
          inspector: '当前用户姓名' // TODO: 从用户信息中获取
        })
        uni.showToast({
          title: '已合格'
        })
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 加载列表数据
    async loadData() {
      try {
        const params = {
          keyword: this.searchKey,
          department: this.departments[this.selectedDept],
          status: ['all', 'pending', 'passed', 'failed'][this.selectedStatus]
        }
        const res = await this.$api.admin.getQualityList(params)
        this.dataList = res.data.list
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    // 重置列表
    resetList() {
      this.dataList = []
    },

    closeDetailPopup() {
      this.showDetailModal = false
      this.selectedItem = null
    },

    // 下拉刷新和加载更多
    async refresh() {
      this.refreshing = true
      try {
        await this.onLoad()
      } catch (error) {
        console.error('刷新失败:', error)
      }
      this.refreshing = false
    },

    loadMore() {
      // TODO: 实现分页加载
    }
  }
}
</script>

<style lang="scss">
.quality-container {
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

/* 列表样式 */
.quality-list {
  height: calc(100vh - 300rpx);
  
  .quality-item {
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
          background: #fff1f0;
          color: #f5222d;
          
          &:active {
            background: darken(#fff1f0, 5%);
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

/* 弹窗样式 */
.detail-modal, .reject-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  animation: modalFadeIn 0.3s;
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

/* 弹窗遮罩层 */
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  
  .modal-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
  }
  
  .detail-modal,
  .reject-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
}
</style> 