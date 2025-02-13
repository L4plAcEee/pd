<template>
  <view class="quality-container">
    <!-- 状态切换 -->
    <view class="status-tabs">
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
        <input 
          class="search-input"
          v-model="searchKey"
          placeholder="搜索产品名称/编号"
          @input="onSearch"
        />
      </view>
      
      <!-- 筛选条件 -->
      <view class="filter-options">
        <picker 
          mode="selector" 
          :range="qualityStatus" 
          @change="onStatusChange"
        >
          <view class="filter-item">
            <text>品控状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
        
        <picker 
          mode="date" 
          @change="onDateChange"
        >
          <view class="filter-item">
            <text>日期筛选</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
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
      <view 
        class="data-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="item-header">
          <text class="order-id">{{item.orderId}}</text>
          <text class="status" :class="item.qualityStatus">{{item.qualityStatusText}}</text>
        </view>
        
        <view class="item-content">
          <view class="info-row">
            <text class="label">产品名称：</text>
            <text class="value">{{item.productName}}</text>
          </view>
          <view class="info-row">
            <text class="label">产品编号：</text>
            <text class="value">{{item.productCode}}</text>
          </view>
          <view class="info-row">
            <text class="label">提交数量：</text>
            <text class="value">{{item.quantity}}{{item.unit}}</text>
          </view>
          <view class="info-row">
            <text class="label">合格数量：</text>
            <text class="value">{{item.passQuantity}}{{item.unit}}</text>
          </view>
          <view class="info-row" v-if="item.rejectReason">
            <text class="label">不合格原因：</text>
            <text class="value">{{item.rejectReason}}</text>
          </view>
          <view class="info-row">
            <text class="label">检验时间：</text>
            <text class="value">{{item.inspectionTime}}</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="item-actions">
          <button 
            class="action-btn view"
            @tap="viewDetail(item)"
          >查看</button>
          <button 
            class="action-btn edit"
            @tap="editItem(item)"
            v-if="item.canEdit"
          >修改</button>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">加载中...</view>
      <view class="no-more" v-if="!hasMore">没有更多数据了</view>
    </scroll-view>

    <!-- 编辑弹窗 -->
    <uni-popup ref="editPopup" type="center">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">修改品控结果</text>
          <text class="close-btn" @tap="closeEditModal">×</text>
        </view>
        
        <view class="modal-content">
          <!-- 表单内容 -->
          <view class="form-item">
            <text class="form-label">合格数量</text>
            <input 
              class="form-input"
              type="number"
              v-model="formData.passQuantity"
              :max="formData.quantity"
              placeholder="请输入合格数量"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">不合格原因</text>
            <textarea
              class="form-textarea"
              v-model="formData.rejectReason"
              placeholder="请输入不合格原因"
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 状态切换
      tabs: [
        { name: '待品控', badge: 5 },
        { name: '已品控', badge: 0 }
      ],
      activeTab: 0,
      
      // 搜索和筛选
      searchKey: '',
      qualityStatus: ['全部', '合格', '部分合格', '不合格'],
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
        passQuantity: '',
        rejectReason: ''
      }
    }
  },
  
  methods: {
    // 切换状态
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
          status: this.activeTab === 0 ? 'pending' : 'finished',
          keyword: this.searchKey,
          qualityStatus: this.selectedStatus,
          date: this.selectedDate
        }
        
        const res = await this.$api.admin.getQualityList(params)
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
    
    // 查看详情
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/admin/quality/detail?id=${item.id}`
      })
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
    }
  }
}
</script>

<style>
/* ... 添加相应样式 ... */
</style> 