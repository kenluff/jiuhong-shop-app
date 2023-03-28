"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppCoupon = common_vendor.Es.importObject("pk-app-coupon");
const _sfc_main = {
  data() {
    return {
      list: [],
      page: 1
    };
  },
  onLoad() {
    this.getCoupon(1);
  },
  onReachBottom() {
    this.getCoupon(this.page + 1);
  },
  methods: {
    async getCoupon(page) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppCoupon.getCouponList(page, 10);
        t.page = page;
        if (page == 1) {
          t.list = res.data;
        } else {
          t.list = t.list.concat(res.data);
        }
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    async receiveCoupon(id) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u9886\u53D6\u4E2D..." });
        let res = await pkAppCoupon.receiveCoupon(id);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u9886\u53D6\u6210\u529F",
          success() {
            setTimeout(function() {
              t.getCoupon(1);
            }, 1e3);
          }
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  _easycom_uni_dateformat2();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.coupon_price),
        b: common_vendor.t(item.low_price),
        c: common_vendor.t(item.name),
        d: "1427bdb0-0-" + i0,
        e: common_vendor.p({
          date: item.end_time,
          format: "yyyy/MM/dd hh:mm"
        }),
        f: item.isGet == 0
      }, item.isGet == 0 ? {
        g: common_vendor.o(($event) => $options.receiveCoupon(item._id), index)
      } : {}, {
        h: item.isGet == 1
      }, item.isGet == 1 ? {} : {}, {
        i: common_vendor.f(7, (val, ind, i1) => {
          return {
            a: ind
          };
        }),
        j: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1427bdb0"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/coupon.vue"]]);
wx.createPage(MiniProgramPage);
