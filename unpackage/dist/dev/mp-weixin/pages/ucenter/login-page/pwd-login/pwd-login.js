"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_ucenter_loginPage_common_loginPage_mixin = require("../common/login-page.mixin.js");
require("../common/loginSuccess.js");
require("../../../../util/http.js");
const _sfc_main = {
  mixins: [pages_ucenter_loginPage_common_loginPage_mixin.mixin],
  data() {
    return {
      "password": "",
      "username": "",
      "agree": false,
      "captchaBase64": "",
      "captcha": ""
    };
  },
  computed: {
    canLogin() {
      return this.username.length && this.isPwd;
    },
    isPwd() {
      return /^.{6,20}$/.test(this.password);
    },
    isPhone() {
      return /^1\d{10}$/.test(this.phone);
    }
  },
  methods: {
    toRetrievePwd() {
      common_vendor.index.navigateTo({
        url: "../pwd-retrieve/pwd-retrieve?phoneNumber=" + (this.isPhone ? this.username : "") + "&phoneArea=" + this.currenPhoneArea
      });
    },
    async pwdLogin() {
      if (!this.agree) {
        return common_vendor.index.showToast({
          title: this.$t("common").noAgree,
          icon: "none"
        });
      }
      common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          action: "login",
          params: {
            "username": this.username,
            "password": this.password,
            "captcha": this.captcha
          }
        },
        success: ({ result }) => {
          console.log(result);
          if (result.code === 0) {
            this.loginSuccess(result);
          } else {
            if (result.needCaptcha) {
              common_vendor.index.showToast({
                title: result.msg || "\u5B8C\u6210",
                icon: "none"
              });
              this.createCaptcha();
            } else {
              common_vendor.index.showModal({
                title: this.$t("common").error,
                content: result.msg,
                showCancel: false,
                confirmText: this.$t("common").gotIt
              });
            }
          }
        }
      });
    },
    createCaptcha() {
      common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          action: "createCaptcha",
          params: {
            scene: "login"
          }
        },
        success: ({ result }) => {
          if (result.code === 0) {
            this.captchaBase64 = result.captchaBase64;
          } else {
            common_vendor.index.showModal({
              content: result.msg,
              showCancel: false
            });
          }
        }
      });
    },
    toRegister(e) {
      console.log(e);
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/login-page/register/register"
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
    a: common_vendor.t(_ctx.$t("pwdLogin.pwdLogin")),
    b: _ctx.$t("pwdLogin.placeholder"),
    c: $data.username,
    d: common_vendor.o(($event) => $data.username = $event.detail.value),
    e: _ctx.$t("pwdLogin.passwordPlaceholder"),
    f: $data.password,
    g: common_vendor.o(($event) => $data.password = $event.detail.value),
    h: $data.captchaBase64
  }, $data.captchaBase64 ? {
    i: common_vendor.o((...args) => $options.createCaptcha && $options.createCaptcha(...args)),
    j: $data.captchaBase64,
    k: _ctx.$t("pwdLogin.verifyCodePlaceholder"),
    l: $data.captcha,
    m: common_vendor.o(($event) => $data.captcha = $event.detail.value)
  } : {}, {
    n: common_vendor.o(($event) => $data.agree = $event),
    o: common_vendor.t(_ctx.$t("pwdLogin.login")),
    p: !$options.canLogin,
    q: common_vendor.o((...args) => $options.pwdLogin && $options.pwdLogin(...args)),
    r: common_vendor.t(_ctx.$t("pwdLogin.forgetPassword")),
    s: common_vendor.o((...args) => $options.toRetrievePwd && $options.toRetrievePwd(...args)),
    t: common_vendor.t(_ctx.$t("pwdLogin.register")),
    v: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args)),
    w: common_vendor.sr("uniQuickLogin", "53bc819d-1"),
    x: common_vendor.p({
      agree: $data.agree
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/login-page/pwd-login/pwd-login.vue"]]);
wx.createPage(MiniProgramPage);
