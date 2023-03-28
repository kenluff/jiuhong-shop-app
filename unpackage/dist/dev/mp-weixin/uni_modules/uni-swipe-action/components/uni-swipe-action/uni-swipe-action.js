"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uniSwipeAction",
  data() {
    return {};
  },
  created() {
    this.children = [];
  },
  methods: {
    resize() {
    },
    closeAll() {
      this.children.forEach((vm) => {
        vm.is_show = "none";
      });
    },
    closeOther(vm) {
      if (this.openItem && this.openItem !== vm) {
        this.openItem.is_show = "none";
      }
      this.openItem = vm;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue"]]);
wx.createComponent(Component);
