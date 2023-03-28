"use strict";
const common_vendor = require("../../../common/vendor.js");
const db = common_vendor.Es.database();
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  name: "goods-sku",
  props: {
    goodsData: {
      type: Object
    },
    buyType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      selectSpec: null,
      skuData: [],
      form: {
        count: 1
      },
      joinLoading: false,
      goods: null
    };
  },
  methods: {
    async openOrCloseSpec(type) {
      let t = this;
      if (type) {
        console.log(t.goodsData);
        if (t.goodsData) {
          console.log("111");
          t.goods = JSON.parse(JSON.stringify(t.goodsData));
          console.log(t.goods);
          if (t.goodsData.is_open_sku == 1) {
            t.goods.spec.forEach((item) => {
              if (item.specValue.length > 0) {
                item.checked = item.specValue[0];
              }
            });
            let skuRes = await db.collection("pk-goods-sku").where({ goods_id: t.goodsData._id }).get();
            t.skuData = skuRes.result.data;
            t.getSpec();
          }
        }
        t.$refs.specPopup.open();
      } else {
        this.$refs.specPopup.close();
      }
    },
    checkSpecValue(index, name) {
      this.goods.spec[index].checked = name;
      this.getSpec();
    },
    async getSpec() {
      let t = this, { goods } = t, sku_name_arr = [];
      goods.spec.forEach((item) => {
        sku_name_arr.push(item.checked);
      });
      for (let i = 0; i < t.skuData.length; i++) {
        if (t.skuData[i].name == sku_name_arr.join("-")) {
          t.selectSpec = t.skuData[i];
        }
      }
    },
    async sureBuy() {
      let t = this;
      try {
        if (t.buyType == 1) {
          t.joinLoading = true;
          let res = await pkAppGoods.addGoodsCart(t.goods._id, t.form.count, t.selectSpec);
          common_vendor.index.showToast({ title: "\u5DF2\u52A0\u5165\u8D2D\u7269\u8F66" });
          t.openOrCloseSpec(false);
          t.joinLoading = false;
        }
        if (t.buyType == 2) {
          let url = `/pages/shop/confirm?buy_type=1&goods_id=${t.goods._id}&count=${t.form.count}`;
          if (t.selectSpec) {
            url += `&sku_id=${t.selectSpec._id}`;
          }
          common_vendor.index.navigateTo({
            url
          });
        }
      } catch (e) {
        t.joinLoading = false;
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
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_number_box2 + _easycom_uni_popup2)();
}
const _easycom_uni_number_box = () => "../../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_number_box + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.goods
  }, $data.goods ? common_vendor.e({
    b: common_vendor.o(($event) => $options.openOrCloseSpec(false)),
    c: $data.selectSpec ? $data.selectSpec.cover : $data.goods.cover,
    d: common_vendor.t($data.selectSpec ? $data.selectSpec.price : $data.goods.price),
    e: common_vendor.t($data.goods.old_price),
    f: common_vendor.t($data.selectSpec ? $data.selectSpec.stock : $data.goods.stock),
    g: $data.selectSpec
  }, $data.selectSpec ? {
    h: common_vendor.t($data.selectSpec.name)
  } : {}, {
    i: common_vendor.o(($event) => $data.form.count = $event),
    j: common_vendor.p({
      modelValue: $data.form.count
    }),
    k: common_vendor.f($data.goods.spec, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.f(item.specValue, (val, ind, i1) => {
          return {
            a: common_vendor.t(val),
            b: common_vendor.n(item.checked == val ? "active" : ""),
            c: common_vendor.o(($event) => $options.checkSpecValue(index, val))
          };
        }),
        c: index
      };
    }),
    l: common_vendor.o((...args) => $options.sureBuy && $options.sureBuy(...args)),
    m: $data.joinLoading
  }) : {}, {
    n: common_vendor.sr("specPopup", "a70dcf63-0"),
    o: common_vendor.p({
      type: "bottom",
      safeArea: false,
      ["mask-click"]: false
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a70dcf63"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/components/goods-sku.vue"]]);
wx.createComponent(Component);
