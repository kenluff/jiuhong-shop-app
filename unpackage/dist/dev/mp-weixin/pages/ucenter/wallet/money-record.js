"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  data() {
    return {
      page: 1,
      list: [],
      is_content: true
    };
  },
  onLoad() {
    this.getMoneyLog(1);
  },
  onReachBottom() {
    this.getMoneyLog(this.page + 1);
  },
  methods: {
    async getMoneyLog(page) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppUser.getMoneyLog(page, 16);
        t.page = page;
        t.list = t.list.concat(res.data);
        t.is_content = t.list.length > 0;
        common_vendor.index.hideLoading();
      } catch (e) {
      }
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
        a: common_vendor.t(item.remark),
        b: "c6f057e6-0-" + i0,
        c: common_vendor.p({
          date: item.create_time,
          format: "yyyy-MM-dd hh:mm:ss"
        }),
        d: item.type == 1
      }, item.type == 1 ? {
        e: common_vendor.t(item.count)
      } : {
        f: common_vendor.t(item.count)
      }, {
        g: index
      });
    }),
    b: !$data.is_content
  }, !$data.is_content ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c6f057e6"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/wallet/money-record.vue"]]);
wx.createPage(MiniProgramPage);
