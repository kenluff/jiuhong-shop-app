"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "refund-reason",
  data() {
    return {
      reason: [
        "\u4E0D\u559C\u6B22/\u4E0D\u60F3\u8981",
        "\u672A\u6309\u7EA6\u5B9A\u7684\u65F6\u95F4\u53D1\u8D27",
        "\u6392\u9519\u4E86\uFF0C\u91CD\u65B0\u62CD",
        "\u4E03\u5929\u65E0\u7406\u7531\u9000\u8D27"
      ],
      value: ""
    };
  },
  mounted() {
  },
  methods: {
    selectReason() {
      if (!this.value) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u9000\u6B3E\u539F\u56E0"
        });
        return;
      }
      this.$emit("success", this.value);
      this.$refs.reasonPopup.close();
    },
    showReason() {
      this.$refs.reasonPopup.open();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.reason, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.value == item ? true : false,
        d: common_vendor.o(($event) => $data.value = item, index),
        e: index
      };
    }),
    b: common_vendor.o((...args) => $options.selectReason && $options.selectReason(...args)),
    c: common_vendor.sr("reasonPopup", "de165ef4-0"),
    d: common_vendor.p({
      type: "bottom"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-de165ef4"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/components/refund-reason.vue"]]);
wx.createComponent(Component);
