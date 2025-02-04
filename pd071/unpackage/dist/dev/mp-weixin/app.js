"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_logger = require("./utils/logger.js");
const api_index = require("./api/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/message/message.js";
  "./pages/user/user.js";
  "./pages/supplier/index.js";
  "./pages/production/index.js";
  "./pages/quality/index.js";
  "./pages/admin/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    const _this = this;
    common_vendor.index.onError(function(err) {
      if (err.includes("interstitialAdExtInfo.txt") || // 广告文件
      err.includes("miniprogramLog") || // 日志文件
      err.includes("wxfile://usr") || // 用户目录
      err.includes("wxfile://ad")) {
        return;
      }
      utils_logger.logger.error("App Error:", err);
      _this.reportError(err);
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:28", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:31", "App Hide");
  },
  methods: {
    // 错误上报方法
    reportError(error) {
      {
        utils_logger.logger.warn("Error reported:", error);
      }
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$api = api_index.api;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
