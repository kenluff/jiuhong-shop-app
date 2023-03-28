"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
require("./http.js");
class Util {
  iPhoneX() {
    return store_index.store.state.common.iphoneX;
  }
  checkLogon(tips) {
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    let uni_id_token = common_vendor.index.getStorageSync("uni_id_token");
    if (userInfo && uni_id_token) {
      return true;
    }
    if (!tips)
      return false;
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
  verifyFiled(key, tip) {
    if (!key) {
      common_vendor.index.showToast({
        title: tip,
        icon: "error"
      });
      return false;
    }
    return true;
  }
}
const util = new Util();
exports.util = util;
