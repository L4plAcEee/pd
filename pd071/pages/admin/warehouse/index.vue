<template>
  <view class="warehouse-container">
    <!-- 仓库类型切换 -->
    <scroll-view 
      class="warehouse-tabs" 
      scroll-x 
      show-scrollbar="false"
      enhanced
    >
      <view 
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{'active': activeTab === index}"
        @tap="switchTab(index)"
      >
        <text class="tab-name">{{tab.name}}</text>
        <text class="badge" v-if="tab.badge">{{tab.badge}}</text>
      </view>
    </scroll-view>

    <!-- 供应商仓/生产仓：列表展示 -->
    <block v-if="activeTab < 2">
      <view class="filter-section">
        <view class="search-box">
          <text class="iconfont icon-search"></text>
          <input 
            class="search-input"
            v-model="searchKey"
            placeholder="搜索产品名称/编号"
            @input="onSearch"
          />
        </view>
        
        <view class="filter-options">
          <picker 
            mode="selector" 
            :range="storageStatus" 
            @change="onStatusChange"
          >
            <view class="filter-item">
              <text class="iconfont icon-filter"></text>
              <text>库存状态</text>
              <text class="arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 库存列表 -->
      <scroll-view 
        class="storage-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="refresh"
      >
        <view 
          class="storage-item"
          v-for="(item, index) in dataList"
          :key="index"
          @longpress="showActionSheet(item)"
        >
          <view class="item-header">
            <text class="product-name">{{item.productName}}</text>
            <text class="status" :class="item.status">{{item.statusText}}</text>
          </view>
          
          <view class="item-content">
            <view class="info-row">
              <text class="label">产品编号：</text>
              <text class="value">{{item.productCode}}</text>
            </view>
            <view class="info-row">
              <text class="label">库存数量：</text>
              <text class="value">{{item.quantity}}{{item.unit}}</text>
            </view>
            <view class="info-row">
              <text class="label">预警阈值：</text>
              <text class="value">{{item.warningThreshold}}{{item.unit}}</text>
            </view>
            <view class="info-row">
              <text class="label">入库时间：</text>
              <text class="value">{{item.storageTime}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </block>

    <!-- 管理仓：仓库状态总览 -->
    <block v-else>
      <view class="overview-section">
        <!-- 仓库容量统计 -->
        <view class="capacity-chart">
          <text class="section-title">仓库容量统计</text>
          <!-- TODO: 接入图表组件 -->
        </view>
        
        <!-- 库存预警 -->
        <view class="warning-list">
          <text class="section-title">库存预警</text>
          <view 
            class="warning-item"
            v-for="(item, index) in warningList"
            :key="index"
          >
            <view class="warning-info">
              <text class="product-name">{{item.productName}}</text>
              <text class="warning-type" :class="item.type">{{item.typeText}}</text>
            </view>
            <text class="warning-desc">{{item.description}}</text>
          </view>
        </view>
        
        <!-- 仓库操作记录 -->
        <view class="operation-log">
          <text class="section-title">最近操作记录</text>
          <view 
            class="log-item"
            v-for="(log, index) in operationLogs"
            :key="index"
          >
            <text class="log-type" :class="log.type">{{log.typeText}}</text>
            <view class="log-content">
              <text class="log-desc">{{log.description}}</text>
              <text class="log-time">{{log.time}}</text>
            </view>
          </view>
        </view>
      </view>
    </block>

    <!-- 长按操作菜单 -->
    <uni-popup ref="actionPopup" type="bottom">
      <view class="action-sheet">
        <view class="action-item" @tap="viewDetail">
          <text class="iconfont icon-view"></text>
          <text>查看详情</text>
        </view>
        <view class="action-item" @tap="editItem">
          <text class="iconfont icon-edit"></text>
          <text>修改库存</text>
        </view>
        <view class="action-item" @tap="transferItem">
          <text class="iconfont icon-transfer"></text>
          <text>仓库调拨</text>
        </view>
        <view class="action-item warning" @tap="deleteItem">
          <text class="iconfont icon-delete"></text>
          <text>删除记录</text>
        </view>
        <view class="action-cancel" @tap="closeActionSheet">取消</view>
      </view>
    </uni-popup>

    <!-- 详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="detail-modal">
        <view class="modal-header">
          <text class="modal-title">库存详情</text>
          <text class="close-btn" @tap="closeDetailPopup">×</text>
        </view>
        
        <view class="modal-content">
          <view class="detail-row">
            <text class="label">产品名称</text>
            <text class="value">{{selectedItem?.productName}}</text>
          </view>
          <view class="detail-row">
            <text class="label">产品编号</text>
            <text class="value">{{selectedItem?.productCode}}</text>
          </view>
          <view class="detail-row">
            <text class="label">当前库存</text>
            <text class="value">{{selectedItem?.quantity}}{{selectedItem?.unit}}</text>
          </view>
          <view class="detail-row">
            <text class="label">预警阈值</text>
            <text class="value">{{selectedItem?.warningThreshold}}{{selectedItem?.unit}}</text>
          </view>
          <view class="detail-row">
            <text class="label">入库时间</text>
            <text class="value">{{selectedItem?.storageTime}}</text>
          </view>
          <view class="detail-row">
            <text class="label">最近操作</text>
            <text class="value">{{selectedItem?.lastOperation}}</text>
          </view>
          <view class="detail-row">
            <text class="label">备注说明</text>
            <text class="value">{{selectedItem?.remark || '无'}}</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 编辑弹窗 -->
    <uni-popup ref="editPopup" type="center">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">修改库存</text>
          <text class="close-btn" @tap="closeEditPopup">×</text>
        </view>
        
        <view class="modal-content">
          <view class="form-item">
            <text class="form-label">当前库存</text>
            <input 
              class="form-input"
              type="number"
              v-model="editForm.quantity"
              placeholder="请输入库存数量"
            />
            <text class="input-unit">{{selectedItem?.unit}}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">预警阈值</text>
            <input 
              class="form-input"
              type="number"
              v-model="editForm.warningThreshold"
              placeholder="请输入预警阈值"
            />
            <text class="input-unit">{{selectedItem?.unit}}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">备注说明</text>
            <textarea
              class="form-textarea"
              v-model="editForm.remark"
              placeholder="请输入备注说明"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeEditPopup">取消</button>
          <button class="modal-btn confirm" @tap="submitEdit">确定</button>
        </view>
      </view>
    </uni-popup>

    <!-- 调拨弹窗 -->
    <uni-popup ref="transferPopup" type="center">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">仓库调拨</text>
          <text class="close-btn" @tap="closeTransferPopup">×</text>
        </view>
        
        <view class="modal-content">
          <view class="form-item">
            <text class="form-label required">调出仓库</text>
            <picker 
              mode="selector"
              :range="warehouseOptions"
              @change="onSourceWarehouseChange"
            >
              <view class="picker-value">
                {{transferForm.sourceWarehouse || '请选择调出仓库'}}
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label required">调入仓库</text>
            <picker 
              mode="selector"
              :range="warehouseOptions"
              @change="onTargetWarehouseChange"
            >
              <view class="picker-value">
                {{transferForm.targetWarehouse || '请选择调入仓库'}}
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label required">调拨数量</text>
            <input 
              class="form-input"
              type="number"
              v-model="transferForm.quantity"
              :placeholder="`当前库存: ${selectedItem?.quantity}${selectedItem?.unit}`"
            />
            <text class="input-unit">{{selectedItem?.unit}}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">备注说明</text>
            <textarea
              class="form-textarea"
              v-model="transferForm.remark"
              placeholder="请输入备注说明"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeTransferPopup">取消</button>
          <button class="modal-btn confirm" @tap="submitTransfer">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 仓库类型
      tabs: [
        { name: '供应商仓', badge: 0 },
        { name: '生产仓', badge: 0 },
        { name: '管理仓', badge: 3 }
      ],
      activeTab: 0,
      
      // 搜索和筛选
      searchKey: '',
      storageStatus: ['全部', '充足', '预警', '不足'],
      selectedStatus: 0,
      selectedDate: '',
      
      // 数据列表
      dataList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      
      // 管理仓数据
      warningList: [],
      operationLogs: [],
      
      // 当前操作的项目
      selectedItem: null,
      
      // 编辑表单数据
      editForm: {},
      
      // 调拨表单数据
      transferForm: {},
      
      // 仓库选项
      warehouseOptions: ['供应商仓', '生产仓', '管理仓']
    }
  },
  
  mounted() {
    // 初始化加载数据
    this.loadData()
    if (this.activeTab === 2) {
      this.loadWarningList()
      this.loadOperationLogs()
    }
  },

  methods: {
    // 切换仓库类型
    switchTab(index) {
      this.activeTab = index
      this.resetList()
      this.loadData()
      if (index === 2) {
        this.loadWarningList()
        this.loadOperationLogs()
      }
    },
    
    // 重置列表数据
    resetList() {
      this.dataList = []
      this.page = 1
      this.hasMore = true
    },
    
    // 加载数据
    async loadData() {
      if(this.loading || !this.hasMore) return
      
      this.loading = true
      try {
        const params = {
          page: this.page,
          type: ['SUPPLIER', 'PRODUCTION', 'MANAGEMENT'][this.activeTab],
          keyword: this.searchKey,
          status: this.selectedStatus,
          date: this.selectedDate
        }
        
        const res = await this.$api.admin.getStorageList(params)
        const { list, total } = res.data
        
        this.dataList = [...this.dataList, ...list]
        this.hasMore = this.dataList.length < total
        this.page++
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 长按显示操作菜单
    showActionSheet(item) {
      this.selectedItem = item
      this.$refs.actionPopup.open()
    },
    
    closeActionSheet() {
      this.$refs.actionPopup.close()
      this.selectedItem = null
    },

    // 查看详情
    viewDetail() {
      this.$refs.actionPopup.close()
      this.$refs.detailPopup.open()
    },
    
    closeDetailPopup() {
      this.$refs.detailPopup.close()
      this.selectedItem = null
    },

    // 编辑相关
    editItem() {
      this.$refs.actionPopup.close()
      // 初始化编辑表单数据
      this.editForm = {
        quantity: this.selectedItem.quantity,
        warningThreshold: this.selectedItem.warningThreshold,
        remark: this.selectedItem.remark || ''
      }
      this.$refs.editPopup.open()
    },
    
    closeEditPopup() {
      this.$refs.editPopup.close()
      this.editForm = {}
    },
    
    async submitEdit() {
      if (!this.editForm.quantity) {
        uni.showToast({
          title: '请输入库存数量',
          icon: 'none'
        })
        return
      }
      
      try {
        // TODO: 调用修改API
        const params = {
          id: this.selectedItem.id,
          ...this.editForm
        }
        // const res = await this.$api.admin.updateStorage(params)
        
        uni.showToast({
          title: '修改成功'
        })
        this.closeEditPopup()
        this.resetList()
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    },

    // 调拨相关
    transferItem() {
      this.$refs.actionPopup.close()
      // 初始化调拨表单数据
      this.transferForm = {
        productId: this.selectedItem.id,
        productName: this.selectedItem.productName,
        sourceWarehouse: '',
        targetWarehouse: '',
        quantity: '',
        remark: ''
      }
      this.$refs.transferPopup.open()
    },
    
    closeTransferPopup() {
      this.$refs.transferPopup.close()
      this.transferForm = {}
    },
    
    onSourceWarehouseChange(e) {
      const index = e.detail.value
      this.transferForm.sourceWarehouse = this.warehouseOptions[index]
    },
    
    onTargetWarehouseChange(e) {
      const index = e.detail.value
      this.transferForm.targetWarehouse = this.warehouseOptions[index]
    },
    
    async submitTransfer() {
      // 表单验证
      if (!this.transferForm.sourceWarehouse) {
        uni.showToast({
          title: '请选择调出仓库',
          icon: 'none'
        })
        return
      }
      if (!this.transferForm.targetWarehouse) {
        uni.showToast({
          title: '请选择调入仓库',
          icon: 'none'
        })
        return
      }
      if (!this.transferForm.quantity) {
        uni.showToast({
          title: '请输入调拨数量',
          icon: 'none'
        })
        return
      }
      if (this.transferForm.sourceWarehouse === this.transferForm.targetWarehouse) {
        uni.showToast({
          title: '调出和调入仓库不能相同',
          icon: 'none'
        })
        return
      }
      
      try {
        // TODO: 调用调拨API
        // const res = await this.$api.admin.transferStorage(this.transferForm)
        
        uni.showToast({
          title: '调拨成功'
        })
        this.closeTransferPopup()
        this.resetList()
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '调拨失败',
          icon: 'none'
        })
      }
    },

    // 删除相关
    deleteItem() {
      this.$refs.actionPopup.close()
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该记录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // TODO: 调用删除API
              // const res = await this.$api.admin.deleteStorage(this.selectedItem.id)
              
              uni.showToast({
                title: '删除成功'
              })
              this.resetList()
              this.loadData()
            } catch(e) {
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    // 搜索和筛选
    onSearch() {
      this.resetList()
      this.loadData()
    },
    
    onStatusChange(e) {
      this.selectedStatus = e.detail.value
      this.resetList()
      this.loadData()
    },
    
    // 下拉刷新和加载更多
    async refresh() {
      this.refreshing = true
      this.resetList()
      await this.loadData()
      this.refreshing = false
    },
    
    loadMore() {
      this.loadData()
    },

    // 加载预警列表
    async loadWarningList() {
      try {
        const res = await this.$api.admin.getWarningList()
        this.warningList = res.data
      } catch(e) {
        console.error(e)
      }
    },

    // 加载操作日志
    async loadOperationLogs() {
      try {
        const res = await this.$api.admin.getOperationLogs()
        this.operationLogs = res.data
      } catch(e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss">
/* 基础容器样式 */
.warehouse-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

/* 选项卡样式 */
.warehouse-tabs {
  display: flex;
  background: #fff;
  padding: 4rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    position: relative;
    
    &.active {
      background: #e6f7ff;
      border-radius: 8rpx;
      
      .tab-name {
        color: #1890ff;
        font-weight: 500;
      }
    }
    
    .tab-name {
      font-size: 28rpx;
      color: #666;
    }
    
    .badge {
      position: absolute;
      top: 6rpx;
      right: 20rpx;
      min-width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      background: #ff4d4f;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      padding: 0 8rpx;
      transform: scale(0.8);
    }
  }
}

/* 搜索和筛选样式 */
.filter-section {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .search-box {
    display: flex;
    align-items: center;
    background: #f5f7fa;
    padding: 16rpx 24rpx;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    
    .icon-search {
      font-size: 32rpx;
      color: #999;
      margin-right: 16rpx;
    }
    
    .search-input {
      flex: 1;
      font-size: 28rpx;
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
      padding: 16rpx;
      background: #f5f7fa;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #666;
      
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

/* 列表区域样式 */
.storage-list {
  height: calc(100vh - 240rpx);
  
  .storage-item {
    background: #fff;
    border-radius: 12rpx;
    margin: 20rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .product-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }
      
      .status {
        padding: 4rpx 16rpx;
        border-radius: 4rpx;
        font-size: 24rpx;
        
        &.sufficient {
          background: #f6ffed;
          color: #52c41a;
        }
        
        &.warning {
          background: #fff7e6;
          color: #faad14;
        }
        
        &.insufficient {
          background: #fff1f0;
          color: #f5222d;
        }
      }
    }
    
    .item-content {
      .info-row {
        display: flex;
        margin-bottom: 16rpx;
        font-size: 28rpx;
        
        .label {
          width: 160rpx;
          color: #666;
        }
        
        .value {
          flex: 1;
          color: #333;
        }
      }
    }
  }
}

/* 管理仓样式 */
.overview-section {
  padding: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      width: 6rpx;
      height: 32rpx;
      background: #1890ff;
      margin-right: 16rpx;
      border-radius: 3rpx;
    }
  }
  
  .warning-list {
    margin-bottom: 30rpx;
    
    .warning-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      
      .warning-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;
        
        .product-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
        
        .warning-type {
          padding: 4rpx 16rpx;
          border-radius: 4rpx;
          font-size: 24rpx;
          
          &.insufficient {
            background: #fff1f0;
            color: #f5222d;
          }
          
          &.warning {
            background: #fff7e6;
            color: #faad14;
          }
        }
      }
      
      .warning-desc {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
  
  .operation-log {
    .log-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: flex-start;
      
      .log-type {
        padding: 4rpx 16rpx;
        border-radius: 4rpx;
        font-size: 24rpx;
        margin-right: 16rpx;
        
        &.in {
          background: #f6ffed;
          color: #52c41a;
        }
        
        &.out {
          background: #fff7e6;
          color: #faad14;
        }
        
        &.transfer {
          background: #e6f7ff;
          color: #1890ff;
        }
      }
      
      .log-content {
        flex: 1;
        
        .log-desc {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .log-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

/* 长按操作菜单样式 */
.action-sheet {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 20rpx;
  
  .action-item {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #333;
    border-bottom: 2rpx solid #f5f5f5;
    
    .iconfont {
      margin-right: 12rpx;
      font-size: 36rpx;
    }
    
    &.warning {
      color: #f5222d;
    }
  }
  
  .action-cancel {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 32rpx;
    color: #999;
    margin-top: 16rpx;
  }
}

/* 详情弹窗样式 */
.detail-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .close-btn {
      font-size: 32rpx;
      color: #999;
    }
  }
  
  .modal-content {
    .detail-row {
      display: flex;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      
      .label {
        width: 160rpx;
        color: #666;
      }
      
      .value {
        flex: 1;
        color: #333;
      }
    }
  }
}

/* 编辑弹窗样式 */
.edit-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .close-btn {
      font-size: 32rpx;
      color: #999;
    }
  }
  
  .modal-content {
    .form-item {
      margin-bottom: 20rpx;
      
      .form-label {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .form-input {
        width: 100%;
        padding: 16rpx;
        border: 1rpx solid #d9d9d9;
        border-radius: 8rpx;
        font-size: 28rpx;
      }
      
      .input-unit {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20rpx;
    
    .modal-btn {
      padding: 16rpx 32rpx;
      border: none;
      border-radius: 8rpx;
      font-size: 32rpx;
      color: #fff;
      background: #1890ff;
      
      &.cancel {
        background: #f5f5f5;
        color: #333;
        margin-right: 16rpx;
      }
      
      &.confirm {
        background: #1890ff;
      }
    }
  }
}

/* 调拨弹窗样式 */
.edit-modal {
  width: 80%;
  max-height: 80vh;
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .close-btn {
      font-size: 32rpx;
      color: #999;
    }
  }
  
  .modal-content {
    .form-item {
      margin-bottom: 20rpx;
      
      .form-label {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .form-input {
        width: 100%;
        padding: 16rpx;
        border: 1rpx solid #d9d9d9;
        border-radius: 8rpx;
        font-size: 28rpx;
      }
      
      .input-unit {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20rpx;
    
    .modal-btn {
      padding: 16rpx 32rpx;
      border: none;
      border-radius: 8rpx;
      font-size: 32rpx;
      color: #fff;
      background: #1890ff;
      
      &.cancel {
        background: #f5f5f5;
        color: #333;
        margin-right: 16rpx;
      }
      
      &.confirm {
        background: #1890ff;
      }
    }
  }
}
</style> 