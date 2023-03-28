"use strict";
const common_vendor = require("../../../common/vendor.js");
const uTabs = () => "../../../components/u-tabs.js";
const _sfc_main = {
  components: {
    uTabs
  },
  data() {
    return {
      nav: [
        { name: "\u5B9E\u7269\u5546\u54C1", status: 1 },
        { name: "\u4F18\u60E0\u5238", status: 2 }
      ],
      nav_index: 0,
      goodsList: [],
      page: 1
    };
  },
  onLoad() {
    this.getIntegralGoods(1);
  },
  onReachBottom() {
    this.getIntegralGoods(this.page + 1);
  },
  methods: {
    async getIntegralGoods(page) {
      let t = this;
      let _w = {
        type: t.nav[t.nav_index].status
      };
      let res = await t.$request("integral", "getIntegralGoods", { page, limit: 12, search: _w });
      if (page == 1) {
        t.goodsList = res.data;
      } else {
        t.goodsList = t.goodsList.concat(res.data);
      }
      t.page = page;
    },
    changeGoods(e) {
      this.nav_index = e;
      this.getIntegralGoods(1);
    },
    toGoodsDetail(id) {
      common_vendor.index.navigateTo({
        url: "./detail?id=" + id
      });
    }
  }
};
if (!Array) {
  const _component_u_tabs = common_vendor.resolveComponent("u-tabs");
  _component_u_tabs();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.changeGoods),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.nav_index,
      itemWidth: "50%"
    }),
    c: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.simple_desc),
        d: common_vendor.t(item.score),
        e: common_vendor.t(item.old_price),
        f: index,
        g: common_vendor.o(($event) => $options.toGoodsDetail(item._id), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4bd46177"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/integral/list.vue"]]);
wx.createPage(MiniProgramPage);
