"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "goods-coupon",
  props: {
    couponData: {
      type: Array
    }
  },
  data() {
    return {
      select_index: 0
    };
  },
  mounted() {
    if (this.couponData.length > 0) {
      this.selectSuccess();
    }
  },
  methods: {
    openSelect() {
      this.$refs.popup.open();
    },
    closePopup() {
      this.$refs.popup.close();
    },
    selectSuccess() {
      if (this.select_index >= 0) {
        this.$emit("success", this.couponData[this.select_index]);
      } else {
        this.$emit("success", null);
      }
      this.closePopup();
    },
    selectCouponItem(index) {
      this.select_index = index;
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_dateformat2 + _easycom_uni_popup2)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.couponData.length > 0
  }, $props.couponData.length > 0 ? common_vendor.e({
    b: $data.select_index >= 0
  }, $data.select_index >= 0 ? {
    c: common_vendor.t($props.couponData[$data.select_index].coupon_info.coupon_price)
  } : {}, {
    d: common_vendor.o((...args) => $options.openSelect && $options.openSelect(...args))
  }) : {}, {
    e: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    f: common_vendor.f($props.couponData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.coupon_info.coupon_price),
        b: common_vendor.t(item.coupon_info.low_price),
        c: common_vendor.t(item.coupon_info.name),
        d: "abb8e091-1-" + i0 + ",abb8e091-0",
        e: common_vendor.p({
          date: item.coupon_info.start_time,
          format: "MM/dd hh:mm"
        }),
        f: "abb8e091-2-" + i0 + ",abb8e091-0",
        g: common_vendor.p({
          date: item.coupon_info.end_time,
          format: "MM/dd hh:mm"
        }),
        h: $data.select_index == index,
        i: index,
        j: common_vendor.o(($event) => $options.selectCouponItem(index), index)
      };
    }),
    g: $data.select_index == -1,
    h: common_vendor.o(($event) => $options.selectCouponItem(-1)),
    i: common_vendor.o((...args) => $options.selectSuccess && $options.selectSuccess(...args)),
    j: common_vendor.sr("popup", "abb8e091-0"),
    k: common_vendor.p({
      type: "bottom",
      radius: "12px 12px 0 0"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-abb8e091"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/components/goods-coupon.vue"]]);
wx.createComponent(Component);
