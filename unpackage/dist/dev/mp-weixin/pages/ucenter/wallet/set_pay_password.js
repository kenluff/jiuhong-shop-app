"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  data() {
    return {
      form: {
        password: "",
        re_password: ""
      },
      loading: false
    };
  },
  onLoad() {
  },
  methods: {
    async savePayPassword() {
      let t = this;
      if (t.form.password == "") {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u652F\u4ED8\u5BC6\u7801",
          icon: "error"
        });
        return;
      }
      if (t.form.password.length != 6) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u51656\u4F4D\u6570\u7684\u652F\u4ED8\u5BC6\u7801",
          icon: "error"
        });
        return;
      }
      if (t.form.re_password == "") {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u652F\u4ED8\u5BC6\u7801",
          icon: "error"
        });
        return;
      }
      if (t.form.re_password != t.form.password) {
        common_vendor.index.showToast({
          title: "\u4E24\u6B21\u5BC6\u7801\u8F93\u5165\u4E0D\u4E00\u81F4",
          icon: "error"
        });
        return;
      }
      try {
        t.loading = true;
        let param = {
          password: common_vendor.md5(t.form.password),
          re_password: common_vendor.md5(t.form.re_password)
        };
        let res = await pkAppUser.setPayPassword(param);
        t.loading = false;
        common_vendor.index.showToast({
          title: "\u5BC6\u7801\u4FEE\u6539\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 1e3);
          }
        });
      } catch (e) {
        t.loading = false;
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.password,
    b: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    c: $data.form.re_password,
    d: common_vendor.o(($event) => $data.form.re_password = $event.detail.value),
    e: $data.loading,
    f: common_vendor.o((...args) => $options.savePayPassword && $options.savePayPassword(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-644f36d6"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/wallet/set_pay_password.vue"]]);
wx.createPage(MiniProgramPage);
