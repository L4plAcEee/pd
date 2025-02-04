"use strict";
const common_vendor = require("../common/vendor.js");
class LoadingManager {
  constructor() {
    this.count = 0;
    this.lastTimer = null;
  }
  // 显示加载
  show(title = "加载中...") {
    this.count++;
    if (this.lastTimer) {
      clearTimeout(this.lastTimer);
      this.lastTimer = null;
    }
    try {
      common_vendor.index.showLoading({
        title,
        mask: true
      });
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/loading.js:23", "显示loading失败:", e);
    }
  }
  // 隐藏加载
  hide() {
    this.count--;
    if (this.count <= 0) {
      this.count = 0;
      this.lastTimer = setTimeout(() => {
        try {
          common_vendor.index.hideLoading();
        } catch (e) {
          common_vendor.index.__f__("warn", "at utils/loading.js:41", "隐藏loading失败:", e);
        }
        this.lastTimer = null;
      }, 100);
    }
  }
  // 强制隐藏所有loading
  hideAll() {
    this.count = 0;
    try {
      common_vendor.index.hideLoading();
    } catch (e) {
      common_vendor.index.__f__("warn", "at utils/loading.js:54", "强制隐藏loading失败:", e);
    }
  }
}
const loading = new LoadingManager();
exports.loading = loading;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/loading.js.map
