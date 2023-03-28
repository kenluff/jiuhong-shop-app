"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_ucenter_loginPage_common_loginPage_mixin = require("../common/login-page.mixin.js");
require("../common/loginSuccess.js");
require("../../../../util/http.js");
const _sfc_main = {
  mixins: [pages_ucenter_loginPage_common_loginPage_mixin.mixin],
  data() {
    return {
      code: "",
      phone: ""
    };
  },
  computed: {
    tipText() {
      return this.$t("common.verifyCodeSend") + `${this.phone}\u3002`;
    },
    canSubmit() {
      return this.code.length == 6;
    }
  },
  onLoad({ phoneNumber, phoneArea }) {
    this.phone = phoneNumber;
  },
  onReady() {
    if (this.phone.length == 11) {
      this.$refs.sendSmsCode.start();
    }
  },
  methods: {
    submit() {
      common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          action: "loginBySms",
          params: {
            "mobile": this.phone,
            "code": this.code
          }
        },
        success: ({ result }) => {
          if (result.code === 0) {
            this.loginSuccess(result);
          } else {
            common_vendor.index.showModal({
              content: result.msg,
              showCancel: false
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_send_sms_code2 = common_vendor.resolveComponent("uni-send-sms-code");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_quick_login2 = common_vendor.resolveComponent("uni-quick-login");
  (_easycom_uni_send_sms_code2 + _easycom_uni_easyinput2 + _easycom_uni_forms2 + _easycom_uni_quick_login2)();
}
const _easycom_uni_send_sms_code = () => "../../../../components/uni-send-sms-code/uni-send-sms-code.js";
const _easycom_uni_easyinput = () => "../../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms = () => "../../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_quick_login = () => "../../../../components/uni-quick-login/uni-quick-login.js";
if (!Math) {
  (_easycom_uni_send_sms_code + _easycom_uni_easyinput + _easycom_uni_forms + _easycom_uni_quick_login)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.$t("common.verifyCodePlaceholder")),
    b: common_vendor.t($options.tipText),
    c: common_vendor.sr("sendSmsCode", "e463042e-2,e463042e-1"),
    d: common_vendor.p({
      phone: $data.phone
    }),
    e: common_vendor.o(($event) => $data.code = $event),
    f: common_vendor.p({
      type: "number",
      inputBorder: false,
      maxlength: "6",
      placeholder: _ctx.$t("common.verifyCodePlaceholder"),
      modelValue: $data.code
    }),
    g: common_vendor.t(_ctx.$t("common.login")),
    h: !$options.canSubmit,
    i: $options.canSubmit ? "primary" : "default",
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: common_vendor.p({
      agree: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/login-page/phone-code/phone-code.vue"]]);
wx.createPage(MiniProgramPage);
