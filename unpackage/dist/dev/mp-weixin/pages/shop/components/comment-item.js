"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "comment-item",
  props: {
    commentData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    previewImg(images, src) {
      let urls = [];
      images.forEach((item) => urls.push(item.url));
      common_vendor.index.previewImage({
        urls,
        current: src
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  (_easycom_uni_dateformat2 + _easycom_uni_rate2)();
}
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_rate = () => "../../../uni_modules/uni-rate/components/uni-rate/uni-rate.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_rate)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.commentData
  }, $props.commentData ? common_vendor.e({
    b: $props.commentData.user.avatar || "../../../static/img/default-head.png",
    c: common_vendor.t($props.commentData.user.nickname),
    d: common_vendor.p({
      date: $props.commentData.create_time,
      format: "yyyy/MM/dd"
    }),
    e: common_vendor.p({
      readonly: true,
      size: 18,
      value: $props.commentData.score
    }),
    f: common_vendor.t($props.commentData.content),
    g: $props.commentData.images
  }, $props.commentData.images ? {
    h: common_vendor.f($props.commentData.images, (val, ind, i0) => {
      return {
        a: ind,
        b: val.url,
        c: common_vendor.o(($event) => $options.previewImg($props.commentData.images, val.url), ind)
      };
    })
  } : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4da1ede1"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/components/comment-item.vue"]]);
wx.createComponent(Component);
