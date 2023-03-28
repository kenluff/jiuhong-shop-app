"use strict";
const common_vendor = require("../../../common/vendor.js");
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const _sfc_main = {
  data() {
    return {
      info: null
    };
  },
  async onLoad(opt) {
    let t = this, db = common_vendor.Es.database();
    let res = await db.collection("pk-article").where({ _id: opt.id }).get();
    console.log(res);
    t.info = res.result.data[0];
    try {
      let res2 = await pkAppCommon.readArticle(opt.id);
    } catch (e) {
    }
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  (_easycom_uni_dateformat2 + _easycom_u_parse2)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_u_parse = () => "../../../components/u-parse/u-parse.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_u_parse)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.info
  }, $data.info ? {
    b: common_vendor.t($data.info.title),
    c: common_vendor.p({
      date: $data.info.update_time,
      format: "yy/MM/dd hh:mm"
    }),
    d: common_vendor.t($data.info.view_count || 0),
    e: common_vendor.p({
      html: $data.info.content
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/article/detail.vue"]]);
wx.createPage(MiniProgramPage);
