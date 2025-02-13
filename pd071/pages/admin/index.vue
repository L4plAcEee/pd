<template>
  <view class="admin-container">
    <!-- 顶部统计卡片 -->
    <view class="stat-cards">
      <view class="stat-card" v-for="(stat, index) in stats" :key="index">
        <text class="stat-value">{{stat.value}}</text>
        <text class="stat-label">{{stat.label}}</text>
      </view>
    </view>

    <!-- 功能模块入口 -->
    <view class="module-grid">
      <view 
        class="module-item"
        v-for="(module, index) in modules"
        :key="index"
        @tap="navigateTo(module.path)"
      >
        <text class="module-icon">{{module.icon}}</text>
        <text class="module-name">{{module.name}}</text>
        <text class="badge" v-if="module.badge">{{module.badge}}</text>
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="data-overview">
      <view class="section-title">
        <text>数据概览</text>
        <text class="more" @tap="navigateTo('/pages/admin/statistics')">查看更多</text>
      </view>
      
      <!-- 图表区域 -->
      <view class="charts">
        <!-- 待接入图表组件 -->
      </view>
    </view>

    <!-- 待处理事项 -->
    <view class="pending-tasks">
      <view class="section-title">
        <text>待处理事项</text>
        <text class="more" @tap="navigateTo('/pages/admin/tasks')">全部</text>
      </view>
      
      <view class="task-list">
        <view 
          class="task-item"
          v-for="(task, index) in pendingTasks"
          :key="index"
          @tap="handleTask(task)"
        >
          <view class="task-info">
            <text class="task-type" :class="task.type">{{task.typeText}}</text>
            <text class="task-title">{{task.title}}</text>
          </view>
          <text class="task-time">{{task.time}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 统计数据
      stats: [
        { label: '今日订单', value: 128 },
        { label: '待审核', value: 15 },
        { label: '库存预警', value: 3 }
      ],
      
      // 功能模块
      modules: [
        { name: '供应商管理', icon: '🏭', path: '/pages/admin/supplier/index' },
        { name: '生产管理', icon: '⚙️', path: '/pages/admin/production/index' },
        { name: '品控管理', icon: '✅', path: '/pages/admin/quality/index' },
        { name: '仓库管理', icon: '📦', path: '/pages/admin/warehouse/index' },
        { name: '用户管理', icon: '👥', path: '/pages/admin/users/index' },
        { name: '系统设置', icon: '⚙️', path: '/pages/admin/settings/index' }
      ],
      
      // 待处理任务
      pendingTasks: [
        {
          type: 'quality',
          typeText: '品控',
          title: '新增5个待检验订单',
          time: '10分钟前'
        },
        {
          type: 'warehouse',
          typeText: '仓库',
          title: '3个产品库存不足',
          time: '30分钟前'
        }
      ]
    }
  },
  
  methods: {
    // 页面导航
    navigateTo(path) {
      // 判断是否是 tabBar 页面
      const tabBarPages = ['/pages/index/index', '/pages/message/message', '/pages/user/user']
      if (tabBarPages.includes(path)) {
        uni.switchTab({ url: path })
      } else {
        uni.navigateTo({ url: path })
      }
    },
    
    // 处理任务
    handleTask(task) {
      // 根据任务类型跳转到对应页面
      const pathMap = {
        quality: '/pages/admin/quality/index',
        warehouse: '/pages/admin/warehouse/index'
      }
      
      if(pathMap[task.type]) {
        this.navigateTo(pathMap[task.type])
      }
    }
  }
}
</script>

<style>
.admin-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

/* 统计卡片 */
.stat-cards {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

/* 功能模块 */
.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.module-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.module-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.module-name {
  font-size: 28rpx;
  color: #333;
}

.badge {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

/* 数据概览 */
.data-overview {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

/* 待处理事项 */
.pending-tasks {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more {
  font-size: 28rpx;
  color: #1890ff;
  font-weight: normal;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.task-item:last-child {
  border-bottom: none;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.task-type {
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
}

.task-type.quality {
  background: #e6f7ff;
  color: #1890ff;
}

.task-type.warehouse {
  background: #fff7e6;
  color: #faad14;
}

.task-title {
  font-size: 28rpx;
  color: #333;
}

.task-time {
  font-size: 24rpx;
  color: #999;
}
</style> 