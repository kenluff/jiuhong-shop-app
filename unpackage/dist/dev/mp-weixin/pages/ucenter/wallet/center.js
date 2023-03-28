"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  data() {
    return {
      accountInfo: null,
      recharge_open: 0
    };
  },
  async onLoad() {
    let t = this;
    let res = await pkAppCommon.getSet(["recharge_open"]);
    if (res.data) {
      t.recharge_open = res.data.recharge_open || 0;
    }
  },
  onShow() {
    common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
    this.getUserAccountTotal();
    common_vendor.index.hideLoading();
  },
  methods: {
    async getUserAccountTotal() {
      let t = this;
      let res = await pkAppUser.getUserAccountTotal();
      t.accountInfo = res.data;
    },
    toMoneyRecord() {
      common_vendor.index.navigateTo({
        url: "./money-record"
      });
    },
    toSetPassword() {
      common_vendor.index.navigateTo({
        url: "./set_pay_password"
      });
    },
    toRecharge() {
      common_vendor.index.navigateTo({
        url: "./recharge"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.accountInfo ? $data.accountInfo.money : "0.00"),
    b: common_vendor.o((...args) => $options.toMoneyRecord && $options.toMoneyRecord(...args)),
    c: $data.recharge_open == 1
  }, $data.recharge_open == 1 ? {
    d: common_vendor.o((...args) => $options.toRecharge && $options.toRecharge(...args))
  } : {}, {
    e: common_vendor.o((...args) => $options.toSetPassword && $options.toSetPassword(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cad59158"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/wallet/center.vue"]]);
wx.createPage(MiniProgramPage);
