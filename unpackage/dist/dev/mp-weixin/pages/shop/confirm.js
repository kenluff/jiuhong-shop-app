"use strict";
const common_vendor = require("../../common/vendor.js");
const fixFooter = () => "../../components/fix-footer.js";
const payMethod = () => "../../components/pay-method.js";
const goodsCoupon = () => "./components/goods-coupon.js";
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const pkAppUser = common_vendor.Es.importObject("pk-app-user");
const _sfc_main = {
  components: {
    fixFooter,
    payMethod,
    goodsCoupon
  },
  data() {
    return {
      form: {
        address: null,
        buy_type: 1,
        goods_id: "",
        count: 0,
        sku_id: "",
        remark: "",
        total_price: 0,
        pay_method: "",
        order_id: "",
        cart_id: [],
        coupon_id: 0,
        final_price: 0
      },
      list: [],
      payLoading: false,
      couponData: []
    };
  },
  async onLoad(opt) {
    let t = this;
    t.form.buy_type = opt.buy_type;
    if (opt.buy_type == 1) {
      t.form.goods_id = opt.goods_id;
      t.form.count = opt.count;
      t.form.sku_id = opt.sku_id;
      t.getPreviewOrder();
    }
    if (opt.buy_type == 2) {
      t.form.cart_id = opt.cart_ids.split(",");
      t.getPreviewOrderByCart();
    }
    let res = await pkAppUser.getAddressDetail({ is_default: 1 });
    if (res.data) {
      let { provice, city, area, address } = res.data;
      t.form.address = {
        provice,
        city,
        area,
        name: res.data.name,
        mobile: res.data.mobile,
        address: provice + " " + city + " " + area + " " + address,
        latlng: res.data.latlng
      };
    }
  },
  onShow() {
    let t = this;
    if (common_vendor.index.getStorageSync("__selectAddress__")) {
      let _d = common_vendor.index.getStorageSync("__selectAddress__");
      common_vendor.index.removeStorageSync("__selectAddress__");
      t.form.address = {
        name: _d.name,
        mobile: _d.mobile,
        address: _d.provice + " " + _d.city + " " + _d.area + " " + _d.address,
        latlng: _d.latlng
      };
    }
  },
  methods: {
    async getPreviewOrder() {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        let param = {
          goods_id: t.form.goods_id,
          count: t.form.count,
          sku_id: t.form.sku_id,
          buy_type: t.form.buy_type
        };
        let res = await pkAppGoods.getPreviewOrder(param);
        t.form.total_price = res.data.total_price;
        t.form.final_price = res.data.total_price;
        t.list = res.data.preOrder;
        t.couponData = res.data.coupon;
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    },
    async getPreviewOrderByCart() {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppGoods.getPreviewOrder({ cart_id: t.form.cart_id, buy_type: t.form.buy_type });
        t.form.total_price = res.data.total_price;
        t.form.final_price = res.data.total_price;
        t.list = res.data.preOrder;
        t.couponData = res.data.coupon;
        console.log(t.couponData);
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: e.errMsg,
          icon: "error"
        });
      }
    },
    async createOrder() {
      let t = this;
      let pay_method = t.$refs.pay.getMethod();
      t.form.pay_method = pay_method;
      if (t.form.order_id) {
        if (pay_method == "balance_pay") {
          t.$refs.pay.showPasswordPopup();
        } else {
          let payRes = await pkAppGoods.orderPay(t.form.order_id, pay_method);
          t.wxPay(payRes.data);
        }
        return;
      }
      try {
        t.payLoading = true;
        let res = null;
        if (t.form.buy_type == 1) {
          res = await pkAppGoods.createOrder({
            goods_id: t.form.goods_id,
            count: t.form.count,
            address: t.form.address,
            buy_type: t.form.buy_type,
            sku_id: t.form.sku_id,
            remark: t.form.remark,
            coupon_id: t.form.coupon_id
          });
        }
        if (t.form.buy_type == 2) {
          res = await pkAppGoods.createOrder({
            address: t.form.address,
            buy_type: t.form.buy_type,
            remark: t.form.remark,
            cart_id: t.form.cart_id,
            coupon_id: t.form.coupon_id
          });
        }
        if (res.data) {
          t.form.order_id = res.data;
          if (pay_method == "balance_pay") {
            t.$refs.pay.showPasswordPopup();
          } else {
            let payRes = await pkAppGoods.orderPay(t.form.order_id, pay_method);
            t.wxPay(payRes.data);
          }
        }
        t.payLoading = false;
      } catch (e) {
        t.payLoading = false;
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    async getPwd(e) {
      let t = this;
      try {
        common_vendor.index.showLoading({
          title: "\u6B63\u5728\u652F\u4ED8..."
        });
        let res = await pkAppGoods.balancePay({
          password: common_vendor.md5(e),
          order_id: t.form.order_id,
          pay_method: t.form.pay_method
        });
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u652F\u4ED8\u6210\u529F",
          success() {
            setTimeout(function() {
              common_vendor.index.redirectTo({
                url: "/pages/shop/order_detail?id=" + t.form.order_id
              });
            }, 1e3);
          }
        });
      } catch (e2) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e2.errMsg,
          showCancel: false
        });
      }
    },
    toChooseAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/common/address?scene=1"
      });
    },
    getCouponPrice(data) {
      let price = parseFloat(this.form.total_price);
      if (data) {
        this.form.coupon_id = data._id;
        this.form.final_price = parseFloat(price - data.coupon_info.coupon_price).toFixed(2);
      } else {
        this.form.final_price = price.toFixed(2);
      }
    },
    wxPay(data) {
      let t = this;
      common_vendor.index.requestPayment({
        ...data,
        complete(err) {
          console.log(err);
          if (err.errMsg == "requestPayment:fail cancel") {
            common_vendor.index.showModal({
              title: "\u63D0\u793A",
              content: "\u60A8\u5DF2\u53D6\u6D88\u652F\u4ED8",
              showCancel: false,
              success() {
                common_vendor.index.redirectTo({
                  url: "/pages/shop/order_detail?id=" + t.form.order_id
                });
              }
            });
            return;
          }
          if (err.errMsg == "requestPayment:ok") {
            common_vendor.index.showToast({
              title: "\u652F\u4ED8\u6210\u529F",
              success() {
                setTimeout(function() {
                  common_vendor.index.redirectTo({
                    url: "/pages/shop/order_detail?id=" + t.form.order_id
                  });
                }, 1e3);
              }
            });
            return;
          }
          common_vendor.index.showModal({
            title: "\u63D0\u793A",
            content: "\u652F\u4ED8\u5931\u8D25\uFF1A" + JSON.stringify(err.errMsg),
            showCancel: false
          });
        }
      });
    }
  }
};
if (!Array) {
  const _component_goods_coupon = common_vendor.resolveComponent("goods-coupon");
  const _component_pay_method = common_vendor.resolveComponent("pay-method");
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  (_component_goods_coupon + _component_pay_method + _component_fix_footer)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.address
  }, $data.form.address ? {
    b: common_vendor.t($data.form.address.name),
    c: common_vendor.t($data.form.address.mobile),
    d: common_vendor.t($data.form.address.province),
    e: common_vendor.t($data.form.address.city),
    f: common_vendor.t($data.form.address.area),
    g: common_vendor.t($data.form.address.address)
  } : {}, {
    h: common_vendor.o((...args) => $options.toChooseAddress && $options.toChooseAddress(...args)),
    i: common_vendor.f($data.list.goods_detail, (val, ind, i0) => {
      return common_vendor.e({
        a: val.sku ? val.sku.cover : val.cover,
        b: common_vendor.t(val.name),
        c: val.sku
      }, val.sku ? {
        d: common_vendor.t(val.sku.name)
      } : {}, {
        e: common_vendor.t(val.price),
        f: common_vendor.t(val.count),
        g: ind
      });
    }),
    j: $data.couponData.length > 0
  }, $data.couponData.length > 0 ? {
    k: common_vendor.o($options.getCouponPrice),
    l: common_vendor.p({
      couponData: $data.couponData
    })
  } : {}, {
    m: common_vendor.t($data.form.final_price),
    n: $data.form.remark,
    o: common_vendor.o(($event) => $data.form.remark = $event.detail.value),
    p: $data.form.final_price > 0
  }, $data.form.final_price > 0 ? {
    q: common_vendor.sr("pay", "684f2292-1"),
    r: common_vendor.o($options.getPwd),
    s: common_vendor.p({
      money: $data.form.final_price
    })
  } : {}, {
    t: common_vendor.t($data.form.final_price),
    v: $data.payLoading,
    w: common_vendor.o((...args) => $options.createOrder && $options.createOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-684f2292"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/confirm.vue"]]);
wx.createPage(MiniProgramPage);
