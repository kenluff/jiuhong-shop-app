"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "u-time-line-item",
  props: {
    bgColor: {
      type: String,
      default: "#ffffff"
    },
    nodeTop: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    nodeStyle() {
      let style = {
        backgroundColor: this.bgColor
      };
      if (this.nodeTop != "")
        style.top = this.nodeTop + "rpx";
      return style;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.nodeStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-de18e460"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/u-time-line-item.vue"]]);
wx.createComponent(Component);
