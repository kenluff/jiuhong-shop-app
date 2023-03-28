"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  data() {
    return {
      order_id: "",
      info: null,
      form: [],
      saving: false
    };
  },
  onLoad(opt) {
    this.order_id = opt.order_id;
    this.getOrderDetail();
  },
  methods: {
    async getOrderDetail() {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppGoods.getOrderDetail(t.order_id);
        t.info = res.data;
        t.info.goods_detail.forEach((item) => {
          t.form.push({
            cover: item.cover,
            name: item.name,
            goods_id: item.goods_id,
            sku: item.sku,
            score: 5,
            content: "",
            images: []
          });
        });
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    async pulishComment() {
      let t = this;
      let form = JSON.parse(JSON.stringify(this.form));
      form.forEach((item) => {
        if (item.images.length > 0) {
          let imgArr = [];
          item.images.forEach((val) => {
            imgArr.push({ name: val.name, extname: val.extname, url: val.url });
          });
          item.images = imgArr;
        }
      });
      try {
        t.saving = true;
        common_vendor.index.showToast({
          title: "\u6B63\u5728\u53D1\u5E03..."
        });
        let res = await pkAppGoods.goodsComment(t.order_id, form);
        common_vendor.index.hideLoading();
        t.saving = false;
        common_vendor.index.showToast({
          title: "\u53D1\u5E03\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 1e3);
          }
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        t.saving = false;
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    success(e) {
      console.log(e);
    }
  }
};
if (!Array) {
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  (_easycom_uni_rate2 + _easycom_uni_file_picker2)();
}
const _easycom_uni_rate = () => "../../uni_modules/uni-rate/components/uni-rate/uni-rate.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
if (!Math) {
  (_easycom_uni_rate + _easycom_uni_file_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.form, (item, index, i0) => {
      return common_vendor.e({
        a: item.cover,
        b: common_vendor.t(item.name),
        c: item.sku
      }, item.sku ? {
        d: common_vendor.t(item.sku.name)
      } : {}, {
        e: "a823a886-0-" + i0,
        f: common_vendor.o(($event) => item.score = $event, index),
        g: common_vendor.p({
          size: 28,
          modelValue: item.score
        }),
        h: item.content,
        i: common_vendor.o(($event) => item.content = $event.detail.value, index),
        j: common_vendor.o($options.success, index),
        k: "a823a886-1-" + i0,
        l: common_vendor.o(($event) => item.images = $event, index),
        m: common_vendor.p({
          fileMediatype: "image",
          mode: "grid",
          ["image-styles"]: {
            "height": 100,
            "width": 100
          },
          modelValue: item.images
        }),
        n: index
      });
    }),
    b: $data.saving,
    c: common_vendor.o((...args) => $options.pulishComment && $options.pulishComment(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a823a886"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/comment.vue"]]);
wx.createPage(MiniProgramPage);
