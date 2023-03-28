"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const common_vendor = require("./common/vendor.js");
const common_appInit = require("./common/appInit.js");
require("./common/openApp.js");
const store_index = require("./store/index.js");
const lang_i18n = require("./lang/i18n.js");
const util_util = require("./util/util.js");
const util_http = require("./util/http.js");
require("./uni-starter.config.js");
require("./store/modules/user.js");
require("./store/modules/common.js");
require("./lang/en.js");
require("./lang/zh-Hans.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/shop/index.js";
  "./pages/shop/type.js";
  "./pages/shop/list.js";
  "./pages/shop/cart.js";
  "./pages/shop/goods_detail.js";
  "./pages/shop/confirm.js";
  "./pages/shop/order.js";
  "./pages/shop/order_detail.js";
  "./pages/shop/comment.js";
  "./pages/shop/comment_list.js";
  "./pages/shop/collect.js";
  "./pages/shop/coupon.js";
  "./pages/ucenter/login-page/index/index.js";
  "./pages/ucenter/ucenter.js";
  "./pages/ucenter/my_coupon.js";
  "./uni_modules/uni-upgrade-center-app/pages/upgrade-popup.js";
  "./pages/uni-agree/uni-agree.js";
  "./pages/ucenter/login-page/pwd-login/pwd-login.js";
  "./pages/ucenter/login-page/pwd-retrieve/pwd-retrieve.js";
  "./pages/ucenter/login-page/phone-code/phone-code.js";
  "./pages/ucenter/login-page/register/register.js";
  "./uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback.js";
  "./pages/ucenter/set/set.js";
  "./pages/ucenter/set/bind-mobile.js";
  "./pages/ucenter/set/deactivate.js";
  "./pages/ucenter/set/cropImage.js";
  "./pages/ucenter/wallet/center.js";
  "./pages/ucenter/wallet/money-record.js";
  "./pages/ucenter/wallet/score_record.js";
  "./pages/ucenter/wallet/set_pay_password.js";
  "./pages/ucenter/wallet/recharge.js";
  "./pages/common/address.js";
  "./pages/common/address_edit.js";
  "./pages/common/article/list.js";
  "./pages/common/article/detail.js";
  "./pages/common/webview/webview.js";
  "./pages/common/logistics.js";
  "./pages/common/agreement.js";
  "./pages/marketing/integral/center.js";
  "./pages/marketing/integral/list.js";
  "./pages/marketing/integral/detail.js";
  "./pages/marketing/integral/confirm.js";
  "./pages/marketing/integral/order.js";
  "./pages/marketing/distribution/apply.js";
  "./pages/marketing/distribution/center.js";
  "./pages/marketing/distribution/withdraw.js";
  "./pages/marketing/distribution/withdraw_log.js";
  "./pages/marketing/distribution/order.js";
  "./pages/marketing/distribution/money-record.js";
  "./pages/marketing/distribution/team.js";
}
const _sfc_main = {
  globalData: {
    searchText: "",
    appVersion: {},
    config: {},
    $i18n: {},
    $t: {}
  },
  onLaunch: function() {
    let t = this;
    console.log("App Launch");
    this.globalData.$i18n = this.$i18n;
    this.globalData.$t = (str) => this.$t(str);
    common_vendor.index.getSystemInfo({
      success(e) {
        console.log("\u7CFB\u7EDF\u4FE1\u606F", e);
        t.checkIphoneX(e);
      }
    });
    common_appInit.initApp();
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    checkIphoneX(e) {
      let iPhone = [
        "iPhone X",
        "iPhoneX",
        "iPhone 11",
        "iPhone11",
        "iPhone 12",
        "iPhone12",
        "iPhone 13",
        "iPhone13",
        "iPhone 12/13",
        "iPhone12/13"
      ];
      let flag = false;
      for (let i = 0; i < iPhone.length; i++) {
        if (e.model.indexOf(iPhone[i]) != -1) {
          flag = true;
          break;
        }
      }
      store_index.store.dispatch("common/setIPhoneX", flag);
      store_index.store.dispatch("common/setPlatform", e.platform);
    }
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/App.vue"]]);
const noneContent = () => "./components/none-content.js";
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(lang_i18n.i18n);
  app.use(store_index.store);
  app.config.globalProperties.$util = util_util.util;
  app.config.globalProperties.$request = util_http.request;
  app.component("none-content", noneContent);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
