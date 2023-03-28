"use strict";
const common_vendor = require("../../../common/vendor.js");
const uTabs = () => "../../../components/u-tabs.js";
const _sfc_main = {
  components: {
    uTabs
  },
  data() {
    return {
      info: {
        page: 1,
        limit: 10,
        list: []
      },
      current: 0,
      is_content: true,
      nav: [
        { name: "\u5168\u90E8", status: -1 },
        { name: "\u5F85\u7ED3\u7B97", status: 0 },
        { name: "\u5DF2\u7ED3\u7B97", status: 1 }
      ]
    };
  },
  onLoad() {
    this.getDisOrder(1, 10);
  },
  onReachBottom() {
    this.getDisOrder(this.info.page + 1, this.info.limit);
  },
  methods: {
    async getDisOrder(page, limit) {
      let t = this;
      let res = await t.$request("distribution", "getDisOrderByUser", {
        page,
        limit,
        status: t.nav[t.current].status
      });
      t.info.list = page == 1 ? res.data : t.info.list.concat(res.data);
      t.info.page = page;
      t.is_content = t.info.list.length > 0;
    },
    changeOrder(e) {
      this.current = e;
      this.getDisOrder(1, 10);
    }
  }
};
if (!Array) {
  const _component_u_tabs = common_vendor.resolveComponent("u-tabs");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  (_component_u_tabs + _component_none_content)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeOrder),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.current,
      itemWidth: "33.3%"
    }),
    c: common_vendor.f($data.info.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.userInfo.nickname),
        b: common_vendor.t(item.order_number),
        c: item.dis_grant == 1
      }, item.dis_grant == 1 ? {} : {}, {
        d: item.dis_grant == 0
      }, item.dis_grant == 0 ? {} : {}, {
        e: common_vendor.t(item.total_price),
        f: common_vendor.t(item.disPirce),
        g: index
      });
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: 150
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e8df2236"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/marketing/distribution/order.vue"]]);
wx.createPage(MiniProgramPage);
