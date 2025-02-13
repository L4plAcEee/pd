<template>
  <view class="production-container">
    <!-- 数据概览卡片组 -->
    <view class="overview-cards">
      <view class="overview-card">
        <view class="card-content">
          <view class="card-title">今日生产总量</view>
          <view class="card-number">2,580</view>
          <view class="card-footer">
            <text class="trend up">↑12.5%</text>
            <text class="compare">较昨日</text>
          </view>
        </view>
        <view class="card-icon production">
          <text class="iconfont icon-production"></text>
        </view>
      </view>
      
      <view class="overview-card">
        <view class="card-content">
          <view class="card-title">待品控订单</view>
          <view class="card-number">15</view>
          <view class="card-footer">
            <text class="trend down">↓8.2%</text>
            <text class="compare">较昨日</text>
          </view>
        </view>
        <view class="card-icon quality">
          <text class="iconfont icon-quality"></text>
        </view>
      </view>
      
      <view class="overview-card">
        <view class="card-content">
          <view class="card-title">生产效率</view>
          <view class="card-number">95<text class="unit">%</text></view>
          <view class="card-footer">
            <text class="trend up">↑2.1%</text>
            <text class="compare">较上周</text>
          </view>
        </view>
        <view class="card-icon efficiency">
          <text class="iconfont icon-efficiency"></text>
        </view>
      </view>
      
      <view class="overview-card">
        <view class="card-content">
          <view class="card-title">合格率</view>
          <view class="card-number">98<text class="unit">%</text></view>
          <view class="card-footer">
            <text class="trend stable">→</text>
            <text class="compare">持平</text>
          </view>
        </view>
        <view class="card-icon rate">
          <text class="iconfont icon-rate"></text>
        </view>
      </view>
    </view>

    <!-- 生产数据管理区域 -->
    <view class="content-area">
      <!-- 部门切换标签页 -->
      <view class="section-header">
        <view class="tabs">
          <view 
            class="tab-item"
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{'active': activeTab === index}"
            @tap="switchTab(index)"
          >
            <text class="tab-text">{{tab.name}}</text>
            <text class="tab-badge" v-if="tab.badge">{{tab.badge}}</text>
          </view>
        </view>
        
        <!-- 功能按钮组 -->
        <view class="action-group">
          <button class="action-btn primary" @tap="showAddModal">
            <text class="iconfont icon-add"></text>
            <text>新建生产单</text>
          </button>
          <button class="action-btn" @tap="exportData">
            <text class="iconfont icon-export"></text>
            <text>导出数据</text>
          </button>
        </view>
      </view>

      <!-- 高级搜索区 -->
      <view class="search-area">
        <view class="search-form">
          <view class="form-item">
            <text class="label">关键词</text>
            <input 
              class="input"
              v-model="searchKey"
              placeholder="产品名称/编号"
            />
          </view>
          
          <view class="form-item">
            <text class="label">生产状态</text>
            <picker 
              mode="selector" 
              :range="statusOptions" 
              @change="onStatusChange"
            >
              <view class="picker">
                {{statusOptions[selectedStatus]}}
                <text class="iconfont icon-arrow-down"></text>
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="label">日期范围</text>
            <picker 
              mode="date" 
              @change="onStartDateChange"
            >
              <view class="picker">
                {{startDate || '开始日期'}}
                <text class="iconfont icon-calendar"></text>
              </view>
            </picker>
            <text class="separator">至</text>
            <picker 
              mode="date" 
              @change="onEndDateChange"
            >
              <view class="picker">
                {{endDate || '结束日期'}}
                <text class="iconfont icon-calendar"></text>
              </view>
            </picker>
          </view>
          
          <view class="form-buttons">
            <button class="btn-search" @tap="search">
              <text class="iconfont icon-search"></text>
              <text>搜索</text>
            </button>
            <button class="btn-reset" @tap="resetSearch">
              <text class="iconfont icon-reset"></text>
              <text>重置</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 数据列表 -->
      <scroll-view 
        class="data-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="refresh"
      >
        <view class="list-header">
          <text class="col product">产品信息</text>
          <text class="col quantity">生产数量</text>
          <text class="col progress">进度</text>
          <text class="col quality">品控状态</text>
          <text class="col time">时间信息</text>
          <text class="col action">操作</text>
        </view>
        
        <view 
          class="list-item"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <view class="col product">
            <text class="product-name">{{item.productName}}</text>
            <text class="product-code">{{item.productCode}}</text>
          </view>
          
          <view class="col quantity">
            <view class="quantity-row">
              <text class="label">计划：</text>
              <text class="value">{{item.planQuantity}}{{item.unit}}</text>
            </view>
            <view class="quantity-row">
              <text class="label">实际：</text>
              <text class="value">{{item.actualQuantity}}{{item.unit}}</text>
            </view>
          </view>
          
          <view class="col progress">
            <view class="progress-info">
              <text class="progress-text">{{item.progress}}%</text>
              <view class="progress-bar">
                <view 
                  class="progress-inner" 
                  :style="{width: item.progress + '%'}"
                  :class="getProgressClass(item.progress)"
                ></view>
              </view>
            </view>
            <text class="status-tag" :class="item.status">{{item.statusText}}</text>
          </view>
          
          <view class="col quality">
            <view class="quality-info">
              <text class="quality-rate">{{item.qualityRate}}%</text>
              <text class="quality-status" :class="getQualityClass(item.qualityRate)">
                {{getQualityText(item.qualityRate)}}
              </text>
            </view>
          </view>
          
          <view class="col time">
            <view class="time-row">
              <text class="label">开始：</text>
              <text class="value">{{item.startTime}}</text>
            </view>
            <view class="time-row">
              <text class="label">预计完成：</text>
              <text class="value">{{item.estimatedEndTime}}</text>
            </view>
          </view>
          
          <view class="col action">
            <view class="action-buttons">
              <button class="btn-icon view" @tap="viewDetail(item)">
                <text class="iconfont icon-view"></text>
              </button>
              <button class="btn-icon edit" @tap="editItem(item)">
                <text class="iconfont icon-edit"></text>
              </button>
              <button class="btn-icon report" @tap="submitReport(item)">
                <text class="iconfont icon-report"></text>
              </button>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="list-footer">
          <view class="loading-more" v-if="loading">
            <text class="iconfont icon-loading loading-icon"></text>
            <text>加载中...</text>
          </view>
          <view class="no-more" v-if="!hasMore">没有更多数据了</view>
        </view>
      </scroll-view>
    </view>

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
            <text class="form-label">部门名称</text>
            <input 
              class="form-input"
              v-model="formData.deptName"
              placeholder="请输入部门名称"
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
            <text class="form-label">产品编号</text>
            <input 
              class="form-input"
              v-model="formData.productCode"
              placeholder="请输入产品编号"
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

<script>
export default {
  data() {
    return {
      // 统计数据
      stats: {
        total: 2580,
        pending: 15,
        efficiency: 95
      },
      
      // 部门切换
      tabs: [
        { name: '磨房', badge: 8 },
        { name: '其他部门', badge: 3 }
      ],
      activeTab: 0,
      
      // 搜索和筛选
      searchKey: '',
      statusOptions: ['全部', '生产中', '已完成', '待品控', '已终止'],
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
        deptName: '',
        productName: '',
        productCode: '',
        quantity: '',
        price: ''
      },
      
      // 删除相关
      deletingItem: null
    }
  },
  
  methods: {
    // 获取进度样式
    getProgressClass(progress) {
      if (progress >= 90) return 'excellent'
      if (progress >= 60) return 'good'
      if (progress >= 30) return 'normal'
      return 'poor'
    },
    
    // 获取品控样式
    getQualityClass(rate) {
      if (rate >= 90) return 'excellent'
      if (rate >= 80) return 'good'
      if (rate >= 60) return 'normal'
      return 'poor'
    },
    
    // 切换部门
    switchTab(index) {
      this.activeTab = index
      this.resetList()
      this.loadData()
    },
    
    // 重置列表
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
          type: this.activeTab === 0 ? 'MF' : 'OTHER',
          keyword: this.searchKey,
          status: this.selectedStatus,
          date: this.selectedDate
        }
        
        const res = await this.$api.admin.getProductionList(params)
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
    
    // 其他方法实现...
  }
}
</script>

<style>
/* 容器基础样式 */
.production-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24rpx;
}

/* 数据概览卡片样式 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.overview-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.card-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.card-number .unit {
  font-size: 28rpx;
  margin-left: 8rpx;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.trend {
  font-size: 24rpx;
}

.trend.up {
  color: #52c41a;
}

.trend.down {
  color: #f5222d;
}

.trend.stable {
  color: #666;
}

.compare {
  font-size: 24rpx;
  color: #999;
}

.card-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon .iconfont {
  font-size: 48rpx;
  color: #fff;
}

.card-icon.production {
  background: linear-gradient(135deg, #1890ff, #096dd9);
}

.card-icon.quality {
  background: linear-gradient(135deg, #faad14, #d48806);
}

.card-icon.efficiency {
  background: linear-gradient(135deg, #52c41a, #389e0d);
}

.card-icon.rate {
  background: linear-gradient(135deg, #722ed1, #531dab);
}

/* 内容区域样式 */
.content-area {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
}

/* 其他样式... */
</style> 