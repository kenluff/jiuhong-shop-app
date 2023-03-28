"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: null
    };
  },
  onShow() {
    this.getDisInfo();
  },
  methods: {
    async getDisInfo() {
      let t = this;
      let res = await t.$request("distribution", "getDisUserbyUser");
      if (res.data) {
        t.userInfo = res.data;
      } else {
        common_vendor.index.redirectTo({
          url: "./apply"
        });
      }
    },
    toWithdraw() {
      common_vendor.index.navigateTo({
        url: "./withdraw"
      });
    },
    toDisOrder() {
      common_vendor.index.navigateTo({
        url: "./order"
      });
    },
    toMoneyLog() {
      common_vendor.index.navigateTo({
        url: "./money-record"
      });
    },
    toTeam() {
      common_vendor.index.navigateTo({
        url: "./team"
      });
    },
    toAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/common/agreement?type=" + 2
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo
  }, $data.userInfo ? common_vendor.e({
    b: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    c: $data.userInfo.avatar
  } : {}, {
    d: common_vendor.t($data.userInfo.nickname),
    e: common_vendor.t($data.userInfo.disUser.share_code),
    f: common_vendor.t($data.userInfo.disUser.money),
    g: common_vendor.o((...args) => $options.toWithdraw && $options.toWithdraw(...args)),
    h: common_vendor.t($data.userInfo.disUser.frozen_money),
    i: common_vendor.t($data.userInfo.disUser.total_order || 0),
    j: common_vendor.o((...args) => $options.toDisOrder && $options.toDisOrder(...args)),
    k: common_vendor.t($data.userInfo.disUser.total_user || 0),
    l: common_vendor.o((...args) => $options.toTeam && $options.toTeam(...args)),
    m: common_vendor.o((...args) => $options.toWithdraw && $options.toWithdraw(...args)),
    n: common_vendor.o((...args) => $options.toMoneyLog && $options.toMoneyLog(...args)),
    o: common_vendor.o((...args) => $options.toTeam && $options.toTeam(...args)),
    p: common_vendor.o((...args) => $options.toAgreement && $options.toAgreement(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c6731e8d"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/center.vue"]]);
wx.createPage(MiniProgramPage);
