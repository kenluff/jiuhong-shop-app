"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "pk-share",
  props: {
    path: {
      type: String
    },
    fontSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    async toShare() {
      let t = this;
      let disUser = await t.$request("distribution", "getDisUser");
      let path = "/pages/shop/goods_detail?goods_id=6264ece4c016f40001d2e1d7";
      if (disUser.data && disUser.data.share_code) {
        path += "&share_code=" + disUser.data.share_code;
      }
      common_vendor.index.setClipboardData({
        data: path,
        success() {
          common_vendor.index.showToast({
            title: "\u5DF2\u590D\u5236"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.fontSize + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e7afd8f2"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/components/pk-share.vue"]]);
wx.createComponent(Component);
