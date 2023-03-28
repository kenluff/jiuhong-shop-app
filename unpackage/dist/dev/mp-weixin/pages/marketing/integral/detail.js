"use strict";
const common_vendor = require("../../../common/vendor.js");
const uParse = () => "../../../components/u-parse/u-parse.js";
const fixFooter = () => "../../../components/fix-footer.js";
const _sfc_main = {
  components: {
    uParse,
    fixFooter
  },
  data() {
    return {
      id: "",
      info: null
    };
  },
  onLoad(opt) {
    let t = this;
    t.id = opt.id;
    t.getGoodsDetail();
  },
  methods: {
    async getGoodsDetail() {
      let t = this;
      let res = await t.$request("integral", "getIntegralGoodsDetail", t.id);
      t.info = res.data;
    },
    async toExchange() {
      let t = this;
      if (t.info.type == 1) {
        common_vendor.index.navigateTo({
          url: "./confirm?id=" + this.id
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u5151\u6362..."
      });
      let res = await t.$request("integral", "exchangeGoods", { goods_id: t.id, count: 1 });
      common_vendor.index.hideLoading();
      if (res.errCode == 0 && !res.code) {
        common_vendor.index.showToast({
          title: "\u5151\u6362\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.redirectTo({
                url: "./order"
              });
            }, 1e3);
          }
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_u_parse2 = common_vendor.resolveComponent("u-parse");
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  (_easycom_u_parse2 + _component_fix_footer)();
}
const _easycom_u_parse = () => "../../../components/u-parse/u-parse.js";
if (!Math) {
  _easycom_u_parse();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.info
  }, $data.info ? {
    b: common_vendor.f($data.info.slide, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    c: common_vendor.t($data.info.name),
    d: common_vendor.t($data.info.simple_desc),
    e: common_vendor.t($data.info.score),
    f: common_vendor.t($data.info.old_price),
    g: common_vendor.t($data.info.sale_count),
    h: common_vendor.p({
      html: $data.info.detail
    }),
    i: common_vendor.o((...args) => $options.toExchange && $options.toExchange(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-786b3a14"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/integral/detail.vue"]]);
wx.createPage(MiniProgramPage);
