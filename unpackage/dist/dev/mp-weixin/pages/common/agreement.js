"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppCommon = common_vendor.Es.importObject("pk-app-common");
const uParse = () => "../../components/u-parse/u-parse.js";
const _sfc_main = {
  components: {
    uParse
  },
  data() {
    return {
      content: ""
    };
  },
  async onLoad(opt) {
    let t = this;
    let key = [];
    if (opt.type == 1)
      key = ["recharge_desc"];
    if (opt.type == 2)
      key = ["dis_rule"];
    let res = await pkAppCommon.getSet(key);
    if (res.data) {
      if (opt.type == 1) {
        t.content = res.data.recharge_desc || "";
      }
      if (opt.type == 2) {
        t.content = res.data.dis_rule || "";
      }
    }
  },
  methods: {}
};
if (!Array) {
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  _easycom_u_parse2();
}
const _easycom_u_parse = () => "../../components/u-parse/u-parse.js";
if (!Math) {
  _easycom_u_parse();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      html: $data.content
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/common/agreement.vue"]]);
wx.createPage(MiniProgramPage);
