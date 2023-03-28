"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  mounted() {
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.$util.iPhoneX() ? "200rpx" : "140rpx",
    b: common_vendor.n(_ctx.$util.iPhoneX() ? "fixed-footer-iphone" : "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-68a82141"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/fix-footer.vue"]]);
wx.createComponent(Component);
