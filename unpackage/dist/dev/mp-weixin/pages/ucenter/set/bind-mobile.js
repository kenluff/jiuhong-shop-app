"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currenPhoneArea: "",
      formData: {
        phone: "",
        code: ""
      }
    };
  },
  computed: {
    tipText() {
      return this.$t("common.verifyCodeSend") + `${this.currenPhoneArea} ${this.formData.phone}\u3002` + this.$t("common.passwordDigits");
    },
    canSubmit() {
      return true;
    }
  },
  onLoad(event) {
    common_vendor.index.setNavigationBarTitle({
      title: this.$t("bindMobile.navigationBarTitle")
    });
  },
  onReady() {
  },
  methods: {
    ...common_vendor.mapMutations({
      setUserInfo: "user/login"
    }),
    submit() {
      console.log(this.formData);
      common_vendor.Es.callFunction({
        name: "uni-id-cf",
        data: {
          action: "bindMobileBySms",
          params: {
            "mobile": this.formData.phone,
            "code": this.formData.code
          }
        },
        success: ({ result }) => {
          console.log(result);
          this.setUserInfo({ "mobile": result.mobile });
          common_vendor.index.showToast({
            title: result.msg || "\u5B8C\u6210",
            icon: "none"
          });
          if (result.code === 0) {
            common_vendor.index.navigateBack();
          }
        }
      });
    },
    isPhone() {
      let reg_phone = /^1\d{10}$/;
      let isPhone = reg_phone.test(this.formData.phone);
      return isPhone;
    },
    isCode() {
      let reg_code = /^\d{6}$/;
      let isCode = reg_code.test(this.formData.code);
      return isCode;
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_send_sms_code2 = common_vendor.resolveComponent("uni-send-sms-code");
  (_easycom_uni_easyinput2 + _easycom_uni_send_sms_code2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_send_sms_code = () => "../../../components/uni-send-sms-code/uni-send-sms-code.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_send_sms_code)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.phone = $event),
    b: common_vendor.p({
      clearable: true,
      focus: true,
      type: "number",
      inputBorder: false,
      maxlength: "11",
      placeholder: _ctx.$t("common.phonePlaceholder"),
      modelValue: $data.formData.phone
    }),
    c: common_vendor.sr("shortCode", "938bb642-2,938bb642-1"),
    d: common_vendor.p({
      ["code-type"]: "bind",
      phone: $data.formData.phone
    }),
    e: common_vendor.o(($event) => $data.formData.code = $event),
    f: common_vendor.p({
      clearable: true,
      type: "number",
      inputBorder: false,
      maxlength: "6",
      placeholder: _ctx.$t("common.verifyCodePlaceholder"),
      modelValue: $data.formData.code
    }),
    g: common_vendor.t(_ctx.$t("common.submit")),
    h: !$options.canSubmit,
    i: $options.canSubmit ? "primary" : "default",
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/set/bind-mobile.vue"]]);
wx.createPage(MiniProgramPage);
