"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "none-content",
  props: {
    top: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  onLoad() {
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.top + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4bc4a3ec"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/none-content.vue"]]);
wx.createComponent(Component);
