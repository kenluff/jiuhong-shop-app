"use strict";
const common_vendor = require("../../common/vendor.js");
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  data() {
    return {
      list: [],
      totalPrice: 0,
      checkAll: false,
      is_content: true,
      isLogin: true
    };
  },
  async onShow() {
    if (!this.$util.checkLogon(false)) {
      this.isLogin = false;
      this.is_content = false;
    }
    this.getCartList(1);
  },
  methods: {
    async getCartList(page) {
      let t = this;
      try {
        common_vendor.index.showLoading({
          title: "\u73A9\u547D\u52A0\u8F7D\u4E2D"
        });
        let res = await pkAppGoods.getCaryListBuyUser(1, 10);
        t.list = res.data;
        t.list.forEach((item) => {
          item.checked = t.checkAll;
        });
        t.is_content = t.list.length > 0;
        t.getTotalPrice();
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    async joinCart(data) {
      try {
        common_vendor.index.showLoading({
          title: "\u52A0\u8F7D\u4E2D...",
          mask: true
        });
        let res = await pkAppGoods.addGoodsCart(data.goods_id, data.count, data.sku, false);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u64CD\u4F5C\u6210\u529F"
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
    async deleteCart(id) {
      let t = this;
      try {
        let res = pkAppGoods.deleteCart(id);
        common_vendor.index.showToast({
          title: "\u5220\u9664\u6210\u529F"
        });
        t.getCartList(1);
      } catch (e) {
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    },
    checkCart(index) {
      this.list[index].checked = !this.list[index].checked;
      this.getTotalPrice();
    },
    checkAllCart() {
      let t = this;
      t.checkAll = !t.checkAll;
      t.list.forEach((item) => {
        item.checked = t.checkAll;
      });
      t.getTotalPrice();
    },
    getTotalPrice() {
      let t = this, total = 0;
      t.list.forEach((item) => {
        if (item.checked) {
          total += parseFloat(item.goodsInfo.price) * item.count;
        }
      });
      t.totalPrice = parseFloat(total).toFixed(2);
    },
    toConfirm() {
      let t = this, cartIds = [];
      t.list.forEach((item) => {
        if (item.checked) {
          cartIds.push(item._id);
        }
      });
      if (cartIds.length == 0) {
        common_vendor.index.showToast({
          title: "\u8BF7\u9009\u62E9\u8981\u7ED3\u7B97\u7684\u5546\u54C1",
          icon: "error"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "./confirm?buy_type=2&cart_ids=" + cartIds.join(",")
      });
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/login-page/index/index"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  (_easycom_uni_number_box2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _component_none_content)();
}
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
if (!Math) {
  (_easycom_uni_number_box + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.list, (val, ind, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.checkCart(ind), ind),
        b: val.checked,
        c: val.goodsInfo.put_away != 1,
        d: val.sku ? val.sku.cover : val.goods.cover,
        e: val.goodsInfo.put_away != 1
      }, val.goodsInfo.put_away != 1 ? {} : {}, {
        f: common_vendor.t(val.goods.name),
        g: val.sku
      }, val.sku ? {
        h: common_vendor.t(val.sku.name)
      } : {}, {
        i: common_vendor.t(val.goodsInfo.price),
        j: common_vendor.o(($event) => $options.joinCart(val, val.count), ind),
        k: "30925c38-2-" + i0 + "," + ("30925c38-1-" + i0),
        l: common_vendor.o(($event) => val.count = $event, ind),
        m: common_vendor.p({
          min: 1,
          max: val.goodsInfo.stock,
          modelValue: val.count
        }),
        n: common_vendor.o(($event) => $options.deleteCart(val._id), ind),
        o: ind,
        p: "30925c38-1-" + i0 + ",30925c38-0"
      });
    }),
    b: !$data.is_content
  }, !$data.is_content ? {
    c: common_vendor.p({
      top: 100
    })
  } : {}, {
    d: !$data.isLogin
  }, !$data.isLogin ? {
    e: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  } : {}, {
    f: $data.isLogin
  }, $data.isLogin ? {
    g: common_vendor.o((...args) => $options.checkAllCart && $options.checkAllCart(...args)),
    h: $data.checkAll,
    i: common_vendor.t($data.totalPrice),
    j: common_vendor.o((...args) => $options.toConfirm && $options.toConfirm(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/cart.vue"]]);
wx.createPage(MiniProgramPage);
