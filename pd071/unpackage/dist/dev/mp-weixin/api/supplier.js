"use strict";
const utils_loading = require("../utils/loading.js");
const supplier = {
  // 提交原料订单
  submitOrder(data) {
    return new Promise((resolve) => {
      utils_loading.loading.show("提交订单...");
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Date.now(),
            ...data
          }
        });
        utils_loading.loading.hide();
      }, 500);
    });
  },
  // 获取历史订单
  getHistory(params = {}) {
    return new Promise((resolve) => {
      utils_loading.loading.show("加载历史记录...");
      setTimeout(() => {
        resolve({
          data: {
            total: 30,
            list: [
              {
                id: "1",
                productName: "原料A",
                quantity: 500,
                price: 12.5,
                totalAmount: 6250,
                createTime: "2024-01-15 14:20:00",
                status: "finished"
              }
              // ... 其他历史记录
            ]
          }
        });
        utils_loading.loading.hide();
      }, 500);
    });
  },
  // 获取价格参考
  getPriceReference(productName) {
    return new Promise((resolve) => {
      utils_loading.loading.show("获取价格参考...");
      setTimeout(() => {
        resolve({
          data: {
            avgPrice: 12.8,
            // 历史均价
            lastPrice: 12.5,
            // 上次价格
            minPrice: 10
            // 最低限价
          }
        });
        utils_loading.loading.hide();
      }, 500);
    });
  }
};
exports.supplier = supplier;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/supplier.js.map
