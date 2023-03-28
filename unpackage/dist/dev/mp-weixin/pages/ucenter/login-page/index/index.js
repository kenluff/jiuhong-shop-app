"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      type: "",
      phone: "",
      agree: false
    };
  },
  computed: {
    loginConfig() {
      return getApp().globalData.config.router.login;
    },
    isPhone() {
      return /^1\d{10}$/.test(this.phone);
    }
  },
  onLoad(e) {
    this.type = e.type;
    common_vendor.index.$on("setLoginType", (type) => {
      this.type = type;
    });
  },
  onUnload() {
    common_vendor.index.$off("setLoginType");
  },
  onReady() {
  },
  methods: {
    quickLogin() {
      this.$refs.uniQuickLogin.login_before(this.type);
    },
    sendShortMsg() {
      if (!this.agree) {
        return common_vendor.index.showToast({
          title: this.$t("common").noAgree,
          icon: "none"
        });
      }
      common_vendor.index.showLoading();
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/login-page/phone-code/phone-code?phoneNumber=" + this.phone,
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    toPwdLogin() {
      common_vendor.index.navigateTo({
        url: "../pwd-login/pwd-login"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_agreements2 = common_vendor.resolveComponent("uni-agreements");
  const _easycom_uni_quick_login2 = common_vendor.resolveComponent("uni-quick-login");
  (_easycom_uni_agreements2 + _easycom_uni_quick_login2)();
}
const _easycom_uni_agreements = () => "../../../../components/uni-agreements/uni-agreements.js";
const _easycom_uni_quick_login = () => "../../../../components/uni-quick-login/uni-quick-login.js";
if (!Math) {
  (_easycom_uni_agreements + _easycom_uni_quick_login)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("login.phoneLogin")),
    b: ["apple", "weixin"].includes($data.type)
  }, ["apple", "weixin"].includes($data.type) ? common_vendor.e({
    c: $data.type == "weixin"
  }, $data.type == "weixin" ? {
    d: common_vendor.o((...args) => $options.quickLogin && $options.quickLogin(...args))
  } : {}, {
    e: $data.type == "apple"
  }, $data.type == "apple" ? {
    f: common_vendor.o((...args) => $options.quickLogin && $options.quickLogin(...args))
  } : {}, {
    g: common_vendor.o(($event) => $data.agree = $event)
  }) : {
    h: _ctx.$t("common.phonePlaceholder"),
    i: $data.phone,
    j: common_vendor.o(($event) => $data.phone = $event.detail.value),
    k: common_vendor.o(($event) => $data.agree = $event),
    l: common_vendor.t(_ctx.$t("login.getVerifyCode")),
    m: !$options.isPhone,
    n: $options.isPhone ? "primary" : "default",
    o: common_vendor.o((...args) => $options.sendShortMsg && $options.sendShortMsg(...args)),
    p: common_vendor.t(_ctx.$t("login.phoneLoginTip"))
  }, {
    q: common_vendor.sr("uniQuickLogin", "20b5d8cf-2"),
    r: common_vendor.p({
      agree: $data.agree
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/login-page/index/index.vue"]]);
wx.createPage(MiniProgramPage);
