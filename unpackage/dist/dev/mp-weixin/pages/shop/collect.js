"use strict";
const common_vendor = require("../../common/vendor.js");
const goodsSku = () => "./components/goods-sku.js";
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  components: {
    goodsSku
  },
  data() {
    return {
      list: [],
      page: 1,
      skuData: null
    };
  },
  onLoad() {
    this.getCollectGoods(1, 10);
  },
  onReachBottom() {
    this.getCollectGoods(this.page + 1, 10);
  },
  methods: {
    async getCollectGoods(page, limit) {
      let t = this;
      try {
        t.page = page;
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppGoods.getCollectGoods(page, limit);
        common_vendor.index.hideLoading();
        if (page == 1) {
          t.list = res.data;
        } else {
          t.list = t.list.concat(res.data);
        }
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    async deleteCollect(goods_id) {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u6B63\u5728\u53D6\u6D88" });
        let res = await pkAppGoods.collectGoods(goods_id);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: res.errMsg,
          success() {
            setTimeout(function() {
              t.getCollectGoods(1, 10);
            }, 1e3);
          }
        });
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    async showSku(data) {
      let t = this;
      t.skuData = data;
      common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
      if (data.is_open_sku == 1) {
        setTimeout(function() {
          t.$refs.sku.openOrCloseSpec(true);
          common_vendor.index.hideLoading();
        }, 500);
        return;
      }
      await pkAppGoods.addGoodsCart(data._id, 1, null);
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({ title: "\u5DF2\u52A0\u5165\u8D2D\u7269\u8F66" });
    },
    toGoodsDetail(goods_id) {
      common_vendor.index.navigateTo({
        url: "./goods_detail?goods_id=" + goods_id
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _component_goods_sku = common_vendor.resolveComponent("goods-sku");
  (_easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _component_goods_sku)();
}
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
if (!Math) {
  (_easycom_uni_swipe_action_item + _easycom_uni_swipe_action)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.list, (item, index, i0) => {
      return {
        a: item.goods.cover,
        b: common_vendor.t(item.goodsInfo.price),
        c: common_vendor.t(item.goodsInfo.old_price),
        d: common_vendor.t(item.goods.name),
        e: common_vendor.o(($event) => $options.showSku(item.goodsInfo), index),
        f: common_vendor.o(($event) => $options.toGoodsDetail(item.goods_id), index),
        g: common_vendor.o(($event) => $options.deleteCollect(item.goods_id), index),
        h: index,
        i: "29373a35-1-" + i0 + ",29373a35-0"
      };
    }),
    b: common_vendor.sr("sku", "29373a35-2"),
    c: common_vendor.p({
      goodsData: $data.skuData,
      buyType: 1
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29373a35"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/collect.vue"]]);
wx.createPage(MiniProgramPage);
