App({
  onLaunch() {
    // 检查是否已登录
    const token = uni.getStorageSync('token')
    if (!token) {
      // 未登录时跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      })
    } else {
      // 已登录时跳转到主页
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
}) 