<template>
  <view class="users-container">
    <!-- 角色类型切换 -->
    <view class="role-tabs">
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

    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input"
          v-model="searchKey"
          placeholder="搜索用户名/手机号"
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
            <text>用户状态</text>
            <text class="arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 用户列表 -->
    <scroll-view 
      class="user-list"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="user-item"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <view class="user-info">
          <image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
          <view class="info-content">
            <view class="name-row">
              <text class="username">{{item.username}}</text>
              <text class="role-tag" :class="item.role">{{item.roleText}}</text>
            </view>
            <view class="contact-info">
              <text class="phone">{{item.phone}}</text>
              <text class="department" v-if="item.department">{{item.department}}</text>
            </view>
            <view class="extra-info">
              <text class="create-time">创建时间: {{item.createTime}}</text>
              <text class="last-login" v-if="item.lastLoginTime">上次登录: {{item.lastLoginTime}}</text>
            </view>
          </view>
          <text class="status" :class="item.status">{{item.statusText}}</text>
        </view>
        
        <!-- 操作按钮 -->
        <view class="item-actions">
          <button 
            class="action-btn edit"
            @tap="editUser(item)"
          >
            <text class="iconfont icon-edit"></text>
            <text>编辑</text>
          </button>
          <button 
            class="action-btn reset"
            @tap="resetPassword(item)"
          >
            <text class="iconfont icon-reset"></text>
            <text>重置密码</text>
          </button>
          <button 
            class="action-btn"
            :class="item.status === 'active' ? 'disable' : 'enable'"
            @tap="toggleStatus(item)"
          >
            <text class="iconfont" :class="item.status === 'active' ? 'icon-disable' : 'icon-enable'"></text>
            <text>{{item.status === 'active' ? '禁用' : '启用'}}</text>
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
          <text class="modal-title">{{editingUser ? '编辑用户' : '新增用户'}}</text>
          <text class="close-btn" @tap="closeEditModal">×</text>
        </view>
        
        <view class="modal-content">
          <view class="form-group">
            <view class="form-item">
              <text class="form-label required">用户名</text>
              <input 
                class="form-input"
                v-model="formData.username"
                placeholder="请输入用户名"
              />
            </view>
            
            <view class="form-item">
              <text class="form-label required">手机号</text>
              <input 
                class="form-input"
                type="number"
                v-model="formData.phone"
                placeholder="请输入手机号"
              />
            </view>
          </view>
          
          <view class="form-group">
            <view class="form-item">
              <text class="form-label required">角色</text>
              <picker 
                mode="selector"
                :range="roleOptions"
                @change="onRoleChange"
              >
                <view class="picker-value">
                  {{formData.roleText || '请选择角色'}}
                  <text class="arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="form-item">
              <text class="form-label">所属部门</text>
              <input 
                class="form-input"
                v-model="formData.department"
                placeholder="请输入所属部门"
              />
            </view>
          </view>
          
          <view class="form-item" v-if="!editingUser">
            <text class="form-label required">初始密码</text>
            <input 
              class="form-input"
              type="password"
              v-model="formData.password"
              placeholder="请输入初始密码"
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
      // 用户类型
      tabs: [
        { name: '全部', badge: 0 },
        { name: '供应商', badge: 0 },
        { name: '生产部门', badge: 0 },
        { name: '品控部门', badge: 0 },
        { name: '管理员', badge: 0 }
      ],
      activeTab: 0,
      
      // 搜索
      searchKey: '',
      
      // 数据列表
      dataList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      
      // 编辑相关
      editingUser: null,
      formData: {
        username: '',
        phone: '',
        role: '',
        roleText: '',
        password: '',
        department: ''
      },
      roleOptions: ['供应商', '生产部门', '品控部门', '管理员'],
      statusOptions: ['active', 'disabled']
    }
  },
  
  methods: {
    // ... 实现相关方法
  }
}
</script>

<style lang="scss">
.users-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

/* 角色选项卡样式 */
.role-tabs {
  display: flex;
  background: #fff;
  padding: 4rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  overflow-x: auto;
  white-space: nowrap;
  
  .tab-item {
    flex: 1;
    min-width: 160rpx;
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

/* 搜索区域样式 */
.search-section {
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
}

/* 用户列表项样式 */
.user-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .user-info {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
    
    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .info-content {
      flex: 1;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        
        .username {
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
        }
        
        .role-tag {
          margin-left: 16rpx;
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
          font-size: 24rpx;
          
          &.supplier {
            background: #e6f7ff;
            color: #1890ff;
          }
          
          &.production {
            background: #f6ffed;
            color: #52c41a;
          }
          
          &.quality {
            background: #fff7e6;
            color: #faad14;
          }
          
          &.admin {
            background: #f5f5f5;
            color: #666;
          }
        }
      }
      
      .contact-info {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 8rpx;
        
        .department {
          margin-left: 16rpx;
          color: #999;
        }
      }
      
      .extra-info {
        font-size: 24rpx;
        color: #999;
        
        .last-login {
          margin-left: 16rpx;
        }
      }
    }
    
    .status {
      padding: 4rpx 16rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      
      &.active {
        background: #f6ffed;
        color: #52c41a;
      }
      
      &.disabled {
        background: #fff1f0;
        color: #f5222d;
      }
    }
  }
}

/* 操作按钮样式 */
.item-actions {
  display: flex;
  gap: 20rpx;
  
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
    
    &.edit {
      background: #e6f7ff;
      color: #1890ff;
    }
    
    &.reset {
      background: #fff7e6;
      color: #faad14;
    }
    
    &.disable {
      background: #fff1f0;
      color: #f5222d;
    }
    
    &.enable {
      background: #f6ffed;
      color: #52c41a;
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
}
</style> 