"use strict";
const common_vendor = require("../../common/vendor.js");
const uTabs = () => "../../components/u-tabs.js";
const pkAppCoupon = common_vendor.Es.importObject("pk-app-coupon");
const _sfc_main = {
  components: {
    uTabs
  },
  data() {
    return {
      nav: [
        { name: "\u672A\u4F7F\u7528", status: 0 },
        { name: "\u5DF2\u4F7F\u7528", status: 1 },
        { name: "\u5DF2\u8FC7\u671F", status: 2 }
      ],
      list: [],
      page: 1,
      nav_current: 0,
      is_content: true
    };
  },
  onLoad() {
    this.getMyCoponList(1);
  },
  methods: {
    async getMyCoponList(page) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppCoupon.getMyCoupon(page, 10, { status: t.nav_current });
        t.page = page;
        if (page == 1) {
          t.list = res.data;
        } else {
          t.list = t.list.concat(res.data);
        }
        t.is_content = t.list.length != 0;
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    changeNav(e) {
      this.nav_current = e;
      this.getMyCoponList(1);
    }
  }
};
if (!Array) {
  const _component_u_tabs = common_vendor.resolveComponent("u-tabs");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  (_component_u_tabs + _easycom_uni_dateformat2 + _component_none_content)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeNav),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.nav_current,
      itemWidth: "33.3%"
    }),
    c: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.coupon_info.coupon_price),
        b: common_vendor.t(item.coupon_info.low_price),
        c: common_vendor.t(item.coupon_info.coupon_price),
        d: common_vendor.n(item.is_use == 1 || item.is_expire ? "coupon-use" : ""),
        e: common_vendor.t(item.coupon_info.name),
        f: item.is_expire
      }, item.is_expire ? {} : common_vendor.e({
        g: item.is_use == 0
      }, item.is_use == 0 ? {} : {}, {
        h: item.is_use == 1
      }, item.is_use == 1 ? {} : {}), {
        i: "e01f4a9a-1-" + i0,
        j: common_vendor.p({
          date: item.coupon_info.start_time,
          format: "yy/MM/dd hh:mm"
        }),
        k: "e01f4a9a-2-" + i0,
        l: common_vendor.p({
          date: item.coupon_info.end_time,
          format: "yy/MM/dd hh:mm"
        }),
        m: index
      });
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: "150"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e01f4a9a"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/ucenter/my_coupon.vue"]]);
wx.createPage(MiniProgramPage);
