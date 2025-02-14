<template>
  <view class="users-container">
    <!-- 角色类型切换 -->
    <scroll-view 
      class="role-tabs" 
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
      
      <button class="add-btn" @tap="showAddModal">
        <text class="iconfont icon-add"></text>
        <text>新增用户</text>
      </button>
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
        v-for="(item, index) in userList"
        :key="index"
      >
        <view class="user-info">
          <view class="info-content">
            <view class="name-row">
              <text class="nickname">{{item.nickname}}</text>
              <text class="status" :class="item.status">{{item.statusText}}</text>
            </view>
            <view class="detail-row">
              <text class="real-name">{{item.realName}}</text>
              <text class="phone">{{item.phone}}</text>
            </view>
            <view class="company-row" v-if="activeTab === 0">
              <text class="company">{{item.company}}</text>
            </view>
            <view class="dept-row" v-if="activeTab === 1 || activeTab === 2">
              <text class="dept">{{item.department}}</text>
            </view>
          </view>
        </view>
        
        <view class="action-buttons">
          <button 
            class="action-btn"
            :class="item.status === 'active' ? 'disable' : 'enable'"
            @tap="toggleStatus(item)"
          >
            {{item.status === 'active' ? '禁用' : '启用'}}
          </button>
          <button class="action-btn edit" @tap="editUser(item)">
            编辑
          </button>
          <button class="action-btn delete" @tap="deleteUser(item)">
            删除
          </button>
        </view>
      </view>
    </scroll-view>

    <!-- 新增/编辑弹窗 -->
    <uni-popup ref="formPopup" type="center">
      <view class="form-modal">
        <view class="modal-header">
          <text class="modal-title">{{editingUser ? '编辑用户' : '新增用户'}}</text>
          <text class="close-btn" @tap="closeFormPopup">×</text>
        </view>
        
        <view class="modal-content">
          <!-- 微信授权按钮 -->
          <button 
            class="wechat-auth"
            v-if="!formData.openid"
            @tap="getWechatAuth"
          >
            <text class="iconfont icon-wechat"></text>
            <text>微信授权</text>
          </button>
          
          <view class="auth-info" v-else>
            <image class="avatar" :src="formData.avatarUrl" mode="aspectFill"></image>
            <view class="auth-content">
              <text class="nickname">{{formData.nickname}}</text>
              <text class="openid">{{formData.openid}}</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label required">真实姓名</text>
            <input 
              class="form-input"
              v-model="formData.realName"
              placeholder="请输入真实姓名"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label required">手机号码</text>
            <input 
              class="form-input"
              type="number"
              v-model="formData.phone"
              placeholder="请输入手机号码"
            />
          </view>
          
          <template v-if="activeTab === 0">
            <view class="form-item">
              <text class="form-label required">供应商企业</text>
              <input 
                class="form-input"
                v-model="formData.company"
                placeholder="请输入供应商企业名称"
              />
            </view>
          </template>
          
          <template v-if="activeTab === 1 || activeTab === 2">
            <view class="form-item">
              <text class="form-label required">所属部门</text>
              <picker 
                mode="selector"
                :range="departmentOptions"
                @change="onDepartmentChange"
              >
                <view class="picker-value">
                  {{formData.department || '请选择所属部门'}}
                  <text class="arrow">▼</text>
                </view>
              </picker>
            </view>
          </template>
          
          <view class="form-item">
            <text class="form-label">备注说明</text>
            <textarea
              class="form-textarea"
              v-model="formData.remark"
              placeholder="请输入备注说明"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel" @tap="closeFormPopup">取消</button>
          <button class="modal-btn confirm" @tap="submitForm">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 角色选项卡
      tabs: [
        { name: '供应商用户', badge: 0 },
        { name: '生产部门用户', badge: 0 },
        { name: '品控部门用户', badge: 0 },
        { name: '管理员用户', badge: 0 }
      ],
      activeTab: 0,
      
      // 列表数据
      userList: [],
      searchKey: '',
      refreshing: false,
      
      // 表单数据
      editingUser: null,
      formData: {
        openid: '',
        avatarUrl: '',
        nickname: '',
        realName: '',
        phone: '',
        company: '',
        department: '',
        remark: ''
      },
      
      // 部门选项
      departmentOptions: ['磨房一部', '磨房二部', '包装部', '仓储部']
    }
  },
  
  mounted() {
    this.loadData()
  },
  
  methods: {
    // 切换角色类型
    switchTab(index) {
      this.activeTab = index
      this.resetList()
      this.loadData()
    },

    // 加载用户列表
    async loadData() {
      try {
        const params = {
          type: ['supplier', 'production', 'quality', 'admin'][this.activeTab],
          keyword: this.searchKey
        }
        const res = await this.$api.admin.getUserList(params)
        this.userList = res.data.list
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
      this.userList = []
      this.searchKey = ''
    },

    // 搜索
    onSearch() {
      this.resetList()
      this.loadData()
    },

    // 显示新增弹窗
    showAddModal() {
      this.editingUser = null
      this.formData = {
        openid: '',
        avatarUrl: '',
        nickname: '',
        realName: '',
        phone: '',
        company: '',
        department: '',
        remark: ''
      }
      this.$refs.formPopup.open()
    },

    // 关闭表单弹窗
    closeFormPopup() {
      this.$refs.formPopup.close()
      this.editingUser = null
      this.formData = {}
    },

    // 获取微信授权
    async getWechatAuth() {
      try {
        // 调用微信登录
        const loginRes = await uni.login()
        // 获取用户信息
        const userInfoRes = await uni.getUserProfile({
          desc: '用于完善用户资料'
        })
        
        this.formData.openid = loginRes.code // 实际应该通过后端换取openid
        this.formData.avatarUrl = userInfoRes.userInfo.avatarUrl
        this.formData.nickname = userInfoRes.userInfo.nickName
      } catch(e) {
        console.error(e)
        uni.showToast({
          title: '授权失败',
          icon: 'none'
        })
      }
    },

    // 部门选择
    onDepartmentChange(e) {
      const index = e.detail.value
      this.formData.department = this.departmentOptions[index]
    },

    // 提交表单
    async submitForm() {
      // 表单验证
      if (!this.formData.openid) {
        uni.showToast({
          title: '请先进行微信授权',
          icon: 'none'
        })
        return
      }
      if (!this.formData.realName) {
        uni.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        })
        return
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
        return
      }
      if (this.activeTab === 0 && !this.formData.company) {
        uni.showToast({
          title: '请输入供应商企业',
          icon: 'none'
        })
        return
      }
      if ((this.activeTab === 1 || this.activeTab === 2) && !this.formData.department) {
        uni.showToast({
          title: '请选择所属部门',
          icon: 'none'
        })
        return
      }
      
      try {
        if (this.editingUser) {
          await this.$api.admin.updateUser({
            id: this.editingUser.id,
            ...this.formData
          })
        } else {
          await this.$api.admin.addUser(this.formData)
        }
        
        uni.showToast({
          title: this.editingUser ? '更新成功' : '添加成功'
        })
        this.closeFormPopup()
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: this.editingUser ? '更新失败' : '添加失败',
          icon: 'none'
        })
      }
    },

    // 编辑用户
    editUser(item) {
      this.editingUser = item
      this.formData = { ...item }
      this.$refs.formPopup.open()
    },

    // 删除用户
    deleteUser(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该用户吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.$api.admin.deleteUser(item.id)
              uni.showToast({
                title: '删除成功'
              })
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

    // 切换用户状态
    async toggleStatus(item) {
      try {
        await this.$api.admin.toggleUserStatus(item.id)
        uni.showToast({
          title: '操作成功'
        })
        this.loadData()
      } catch(e) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 下拉刷新
    async refresh() {
      this.refreshing = true
      await this.loadData()
      this.refreshing = false
    },

    // 加载更多
    loadMore() {
      // TODO: 实现分页加载
    },

    // 处理图片加载错误
    handleImageError(e) {
      const item = this.userList.find(user => user.avatarUrl === e.target.dataset.src)
      if (item) {
        item.avatarUrl = '/static/default-avatar.png'
      }
    }
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
  background: #fff;
  padding: 4rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  width: 100%;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
  
  .tab-item {
    display: inline-block;
    width: 200rpx;
    text-align: center;
    padding: 20rpx;
    position: relative;
    transition: all 0.3s;
    
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      transform: scale(0.8);
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
    
    .info-content {
      flex: 1;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        
        .nickname {
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
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
      
      .detail-row {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 8rpx;
        
        .real-name {
          margin-right: 16rpx;
        }
      }
      
      .company-row, .dept-row {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

/* 操作按钮样式 */
.action-buttons {
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
    
    &.edit {
      background: #e6f7ff;
      color: #1890ff;
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
.form-modal {
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