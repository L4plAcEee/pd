<template>
  <view class="user-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-box">
        <image class="avatar" :src="userInfo.avatarUrl || '/static/default-avatar.png'" mode="aspectFill"></image>
      </view>
      <view class="info-box">
        <text class="nickname">{{userInfo.nickname || '未登录'}}</text>
        <text class="company">{{userInfo.company || '暂无企业信息'}}</text>
      </view>
    </view>
    
    <!-- 基本信息 -->
    <view class="info-section">
      <view class="section-title">基本信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">真实姓名</text>
          <text class="value">{{userInfo.realName || '-'}}</text>
        </view>
        <view class="info-item">
          <text class="label">手机号码</text>
          <text class="value">{{userInfo.phone || '-'}}</text>
        </view>
        <view class="info-item">
          <text class="label">所属部门</text>
          <text class="value">{{userInfo.department || '-'}}</text>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import userApi from '@/api/user.js'

export default {
  data() {
    return {
      userInfo: {
        avatarUrl: '',
        nickname: '',
        realName: '',
        phone: '',
        company: '',
        department: ''
      }
    }
  },
  
  onShow() {
    this.loadUserInfo()
  },
  
  methods: {
    // 加载用户信息
    loadUserInfo() {
      // 使用模拟数据
      this.userInfo = userApi.mockUserInfo
    },
    
    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if(res.confirm) {
            // 跳转到登录页
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.user-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 30rpx;
}

.user-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .avatar-box {
    margin-right: 30rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
      box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
    }
  }
  
  .info-box {
    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .company {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.info-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #1890ff;
  }
  
  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
      
      .value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.logout-section {
  margin-top: 60rpx;
  
  .logout-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #ff4d4f;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    
    &:active {
      opacity: 0.9;
    }
  }
}
</style> 