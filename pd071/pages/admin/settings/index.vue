<template>
  <view class="settings-container">
    <!-- 设置分组 -->
    <view class="settings-group">
      <view class="group-title">基本设置</view>
      
      <!-- 系统名称 -->
      <view class="setting-item">
        <text class="item-label">系统名称</text>
        <input 
          class="item-input"
          v-model="settings.systemName"
          placeholder="请输入系统名称"
        />
      </view>
      
      <!-- 系统Logo -->
      <view class="setting-item">
        <text class="item-label">系统Logo</text>
        <view class="logo-upload" @tap="uploadLogo">
          <image 
            v-if="settings.logo"
            class="logo-image"
            :src="settings.logo"
            mode="aspectFit"
          ></image>
          <text class="upload-text" v-else>点击上传</text>
        </view>
      </view>
    </view>

    <view class="settings-group">
      <view class="group-title">安全设置</view>
      
      <!-- 密码策略 -->
      <view class="setting-item">
        <text class="item-label">密码最小长度</text>
        <input 
          class="item-input"
          type="number"
          v-model="settings.passwordMinLength"
          placeholder="请输入最小长度"
        />
      </view>
      
      <!-- 登录策略 -->
      <view class="setting-item">
        <text class="item-label">登录失败次数限制</text>
        <input 
          class="item-input"
          type="number"
          v-model="settings.loginFailLimit"
          placeholder="请输入次数限制"
        />
      </view>
      
      <!-- 会话超时 -->
      <view class="setting-item">
        <text class="item-label">会话超时时间(分钟)</text>
        <input 
          class="item-input"
          type="number"
          v-model="settings.sessionTimeout"
          placeholder="请输入超时时间"
        />
      </view>
    </view>

    <view class="settings-group">
      <view class="group-title">数据设置</view>
      
      <!-- 数据备份 -->
      <view class="setting-item">
        <text class="item-label">自动备份</text>
        <switch 
          :checked="settings.autoBackup"
          @change="onBackupChange"
        />
      </view>
      
      <!-- 备份周期 -->
      <view class="setting-item" v-if="settings.autoBackup">
        <text class="item-label">备份周期</text>
        <picker 
          mode="selector"
          :range="backupCycles"
          @change="onCycleChange"
        >
          <view class="picker-value">
            {{settings.backupCycle || '请选择备份周期'}}
          </view>
        </picker>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="footer">
      <button 
        class="save-btn"
        @tap="saveSettings"
      >保存设置</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      settings: {
        systemName: '',
        logo: '',
        passwordMinLength: 8,
        loginFailLimit: 5,
        sessionTimeout: 30,
        autoBackup: false,
        backupCycle: ''
      },
      backupCycles: ['每天', '每周', '每月']
    }
  },
  
  methods: {
    // 上传Logo
    uploadLogo() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          // TODO: 上传图片到服务器
          this.settings.logo = tempFilePath
        }
      })
    },
    
    // 备份设置变更
    onBackupChange(e) {
      this.settings.autoBackup = e.detail.value
    },
    
    // 备份周期变更
    onCycleChange(e) {
      const index = e.detail.value
      this.settings.backupCycle = this.backupCycles[index]
    },
    
    // 保存设置
    async saveSettings() {
      try {
        const res = await this.$api.admin.updateSettings(this.settings)
        if(res.success) {
          uni.showToast({
            title: '保存成功'
          })
        }
      } catch(e) {
        uni.showToast({
          title: '保存失败',
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