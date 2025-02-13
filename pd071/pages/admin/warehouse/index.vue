<template>
  <view class="warehouse-container">
    <!-- 仓库类型切换 -->
    <view class="warehouse-tabs">
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
    </view>

    <!-- 搜索和筛选 -->
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
        
        <picker 
          mode="date" 
          @change="onDateChange"
        >
          <view class="filter-item">
            <text class="iconfont icon-calendar"></text>
            <text>入库日期</text>
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
      >
        <view class="item-header">
          <view class="header-left">
            <text class="product-name">{{item.productName}}</text>
            <text class="product-code">{{item.productCode}}</text>
          </view>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-grid">
            <view class="info-block">
              <text class="block-label">库存数量</text>
              <text class="block-value">{{item.quantity}}</text>
              <text class="block-unit">{{item.unit}}</text>
            </view>
            <view class="info-block">
              <text class="block-label">预警阈值</text>
              <text class="block-value">{{item.warningThreshold}}</text>
              <text class="block-unit">{{item.unit}}</text>
            </view>
            <view class="info-block">
              <text class="block-label">入库时间</text>
              <text class="block-value">{{item.storageTime}}</text>
            </view>
          </view>
          
          <view class="source-info">
            <text class="source-label">来源：</text>
            <text class="source-value">{{item.source}}</text>
          </view>
          
          <view class="remark" v-if="item.remark">
            <text class="remark-content">{{item.remark}}</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="item-actions">
          <button 
            class="action-btn view"
            @tap="viewDetail(item)"
          >
            <text class="iconfont icon-view"></text>
            <text>查看</text>
          </button>
          <button 
            class="action-btn edit"
            @tap="editItem(item)"
          >
            <text class="iconfont icon-edit"></text>
            <text>修改</text>
          </button>
          <button 
            class="action-btn delete"
            @tap="deleteItem(item)"
          >
            <text class="iconfont icon-delete"></text>
            <text>删除</text>
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

    <!-- 编辑弹窗样式优化 -->
    <uni-popup ref="editPopup" type="center">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">{{editingItem ? '修改库存' : '新增入库'}}</text>
          <text class="close-btn" @tap="closeEditModal">×</text>
        </view>
        
        <view class="modal-content">
          <view class="form-group">
            <view class="form-item">
              <text class="form-label required">产品名称</text>
              <input 
                class="form-input"
                v-model="formData.productName"
                placeholder="请输入产品名称"
              />
            </view>
            
            <view class="form-item">
              <text class="form-label required">产品编号</text>
              <input 
                class="form-input"
                v-model="formData.productCode"
                placeholder="请输入产品编号"
              />
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-item">
              <text class="form-label required">库存数量</text>
              <input 
                class="form-input"
                type="number"
                v-model="formData.quantity"
                placeholder="请输入数量"
              />
              <text class="input-unit">{{formData.unit || '单位'}}</text>
            </view>
            
            <view class="form-item">
              <text class="form-label required">预警阈值</text>
              <input 
                class="form-input"
                type="number"
                v-model="formData.warningThreshold"
                placeholder="请输入预警阈值"
              />
              <text class="input-unit">{{formData.unit || '单位'}}</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label required">来源</text>
            <picker 
              mode="selector"
              :range="sourceOptions"
              @change="onSourceChange"
            >
              <view class="picker-value">
                {{formData.source || '请选择来源'}}
                <text class="arrow">▼</text>
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea
              class="form-textarea"
              v-model="formData.remark"
              placeholder="请输入备注信息"
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
        content="是否确认删除该条库存记录？"
        :before-close="true"
        @confirm="confirmDelete"
        @close="closeDeletePopup"
      />
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
        { name: '管理仓', badge: 0 }
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
      
      // 编辑相关
      editingItem: null,
      formData: {
        productName: '',
        productCode: '',
        quantity: '',
        source: '',
        remark: ''
      },
      sourceOptions: ['供应商', '生产部门', '其他'],
      
      // 删除相关
      deletingItem: null
    }
  },
  
  methods: {
    // ... 实现相关方法
  }
}
</script>

<style lang="scss">
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
    
    .badge {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      background: #ff4d4f;
      color: #fff;
      font-size: 20rpx;
      padding: 2rpx 8rpx;
      border-radius: 20rpx;
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

/* 列表项样式 */
.storage-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .header-left {
      .product-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }
      
      .product-code {
        font-size: 24rpx;
        color: #999;
        margin-left: 16rpx;
      }
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
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .info-block {
      text-align: center;
      padding: 16rpx;
      background: #f5f7fa;
      border-radius: 8rpx;
      
      .block-label {
        font-size: 24rpx;
        color: #999;
      }
      
      .block-value {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        margin: 8rpx 0;
      }
      
      .block-unit {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

/* 操作按钮样式 */
.item-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    
    .iconfont {
      margin-right: 8rpx;
      font-size: 32rpx;
    }
    
    &.view {
      background: #e6f7ff;
      color: #1890ff;
    }
    
    &.edit {
      background: #fff7e6;
      color: #faad14;
    }
    
    &.delete {
      background: #fff1f0;
      color: #f5222d;
    }
  }
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
  
  .icon-add {
    color: #fff;
    font-size: 48rpx;
  }
}

/* 编辑弹窗样式 */
.edit-modal {
  width: 680rpx;
  background: #fff;
  border-radius: 16rpx;
  
  .modal-header {
    padding: 24rpx;
    border-bottom: 2rpx solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .modal-title {
      font-size: 32rpx;
      font-weight: 500;
    }
    
    .close-btn {
      font-size: 40rpx;
      color: #999;
      padding: 0 16rpx;
    }
  }
  
  .modal-content {
    padding: 24rpx;
    max-height: 800rpx;
    overflow-y: auto;
  }
  
  .form-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    margin-bottom: 20rpx;
  }
  
  .form-item {
    margin-bottom: 24rpx;
    
    .form-label {
      display: block;
      margin-bottom: 12rpx;
      font-size: 28rpx;
      color: #333;
      
      &.required::before {
        content: '*';
        color: #f5222d;
        margin-right: 8rpx;
      }
    }
    
    .form-input,
    .form-textarea,
    .picker-value {
      width: 100%;
      padding: 16rpx;
      background: #f5f7fa;
      border-radius: 8rpx;
      font-size: 28rpx;
    }
    
    .form-textarea {
      height: 160rpx;
    }
    
    .input-unit {
      margin-left: 8rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .modal-footer {
    padding: 24rpx;
    border-top: 2rpx solid #f0f0f0;
    display: flex;
    gap: 20rpx;
    
    .modal-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 8rpx;
      font-size: 28rpx;
      
      &.cancel {
        background: #f5f7fa;
        color: #666;
      }
      
      &.confirm {
        background: #1890ff;
        color: #fff;
      }
    }
  }
}
</style> 