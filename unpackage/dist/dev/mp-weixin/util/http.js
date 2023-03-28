"use strict";
const common_vendor = require("../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const pkAppIntegral = common_vendor.Es.importObject("pk-app-integral");
const pkAppOrder = common_vendor.Es.importObject("pk-app-order");
const pkAppDistribution = common_vendor.Es.importObject("pk-app-distribution");
let modules = {
  user: pkAppUser,
  integral: pkAppIntegral,
  order: pkAppOrder,
  distribution: pkAppDistribution
};
async function request(module2, api, param = null) {
  let collection = modules[module2];
  try {
    let res = await collection[api](param);
    if (res.code) {
      if (res.code == 7e3) {
        common_vendor.index.setStorageSync("userInfo", {});
        common_vendor.index.removeStorageSync("uni_id_token");
        common_vendor.index.setStorageSync("uni_id_token_expired", 0);
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u60A8\u8FD8\u6CA1\u6709\u767B\u5F55\u54E6",
          confirmText: "\u7ACB\u5373\u767B\u5F55",
          cancelText: "\u6682\u4E0D\u767B\u5F55",
          success(tip) {
            if (tip.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/ucenter/login-page/index/index"
              });
            }
          }
        });
      }
      if (res.code == 1001) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: res.errMsg,
          showCancel: false
        });
      }
    }
    return res;
  } catch (e) {
    common_vendor.index.showModal({
      title: "\u63D0\u793A",
      content: e.errMsg,
      showCancel: false
    });
  }
}
exports.request = request;
