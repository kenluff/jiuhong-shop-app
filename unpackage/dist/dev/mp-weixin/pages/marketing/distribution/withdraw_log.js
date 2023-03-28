"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      list: [],
      page: 1,
      limit: 10,
      is_content: true
    };
  },
  onLoad() {
    let t = this;
    t.getMoneyLog(1, 16);
  },
  onReachBottom() {
    this.getMoneyLog(this.page + 1, 16);
  },
  methods: {
    async getMoneyLog(page, limit) {
      let t = this;
      let res = await t.$request("distribution", "getDisUserWithdrawLog", { page, limit });
      t.list = page == 1 ? res.data : t.list.concat(res.data);
      t.is_content = t.list.length > 0;
      t.page = page;
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  (_easycom_uni_dateformat2 + _component_none_content)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: item.method == "wx"
      }, item.method == "wx" ? {} : {}, {
        b: item.method == "alipay"
      }, item.method == "alipay" ? {} : {}, {
        c: item.method == "bank"
      }, item.method == "bank" ? {} : {}, {
        d: item.method == "balance"
      }, item.method == "balance" ? {} : {}, {
        e: item.status == 0
      }, item.status == 0 ? {} : {}, {
        f: item.status == 1
      }, item.status == 1 ? {} : {}, {
        g: item.status == 2
      }, item.status == 2 ? {} : {}, {
        h: item.account
      }, item.account ? common_vendor.e({
        i: item.method == "wx"
      }, item.method == "wx" ? {
        j: common_vendor.t(item.account.account)
      } : {}, {
        k: item.method == "alipay"
      }, item.method == "alipay" ? {
        l: common_vendor.t(item.account.account)
      } : {}, {
        m: item.method == "bank"
      }, item.method == "bank" ? {
        n: common_vendor.t(item.account.account)
      } : {}) : {}, {
        o: common_vendor.t(item.count),
        p: "3733ac34-0-" + i0,
        q: common_vendor.p({
          date: item.create_time
        }),
        r: common_vendor.t(item.service_price || " 0.00"),
        s: item.status == 2
      }, item.status == 2 ? {
        t: common_vendor.t(item.reason)
      } : {}, {
        v: index
      });
    }),
    b: !$data.is_content
  }, !$data.is_content ? {
    c: common_vendor.p({
      top: 150
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3733ac34"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/withdraw_log.vue"]]);
wx.createPage(MiniProgramPage);
