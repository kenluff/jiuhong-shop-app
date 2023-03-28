"use strict";
const common_vendor = require("../../common/vendor.js");
const fixFooter = () => "../../components/fix-footer.js";
const refundReason = () => "./components/refund-reason.js";
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  components: {
    fixFooter,
    refundReason
  },
  data() {
    return {
      order_id: "",
      info: null
    };
  },
  onLoad(opt) {
    let t = this;
    common_vendor.index.setNavigationBarColor({
      backgroundColor: "#e4ecf4",
      frontColor: "#000000"
    });
    if (opt.id) {
      t.order_id = opt.id;
      t.getOrderDetail();
    }
  },
  methods: {
    async getOrderDetail() {
      let t = this;
      try {
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..." });
        let res = await pkAppGoods.getOrderDetail(t.order_id);
        t.info = res.data;
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    operaOrder(type, title) {
      let t = this;
      const operaFunc = async function() {
        try {
          if (type == "cancel") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u53D6\u6D88..." });
            let res = await pkAppGoods.cancelOrder(t.info._id);
          }
          if (type == "delete") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u5220\u9664..." });
            let res = await pkAppGoods.deleteOrder(t.info._id);
          }
          if (type == "cancel_refund") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u53D6\u6D88..." });
            let res = await pkAppGoods.cancelRefundOrder(t.info._id);
          }
          if (type == "confirm") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u786E\u8BA4..." });
            let res = await pkAppGoods.confirmOrder(t.info._id);
          }
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u64CD\u4F5C\u6210\u529F",
            success() {
              setTimeout(function() {
                t.getOrderDetail();
              }, 1e3);
            }
          });
        } catch (e) {
          common_vendor.index.showModal({
            title: "\u63D0\u793A",
            content: e.errMsg,
            showCancel: false
          });
        }
      };
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: title,
        success(tips) {
          if (tips.confirm) {
            operaFunc();
          }
        }
      });
    },
    showRefundReason() {
      this.$refs.refund.showReason();
    },
    async applyRefund(data) {
      let t = this;
      try {
        common_vendor.index.showToast({
          title: "\u9000\u6B3E\u7533\u8BF7\u63D0\u4EA4\u4E2D..."
        });
        let res = await pkAppGoods.applyRefundOrder(t.info._id, data);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u64CD\u4F5C\u6210\u529F",
          success() {
            setTimeout(function() {
              t.getOrderDetail();
            }, 1e3);
          }
        });
      } catch (e) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e.errMsg,
          showCancel: false
        });
      }
    },
    toComment() {
      common_vendor.index.navigateTo({
        url: "./comment?order_id=" + this.info._id
      });
    },
    toLogistics() {
      common_vendor.index.navigateTo({
        url: "/pages/common/logistics?order_id=" + this.info._id
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _component_fix_footer = common_vendor.resolveComponent("fix-footer");
  const _component_refund_reason = common_vendor.resolveComponent("refund-reason");
  (_easycom_uni_dateformat2 + _component_fix_footer + _component_refund_reason)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.info
  }, $data.info ? common_vendor.e({
    b: $data.info.order_status == 0
  }, $data.info.order_status == 0 ? {} : {}, {
    c: $data.info.order_status == 1
  }, $data.info.order_status == 1 ? {} : {}, {
    d: $data.info.order_status == 2
  }, $data.info.order_status == 2 ? {} : {}, {
    e: $data.info.order_status == 3
  }, $data.info.order_status == 3 ? {} : {}, {
    f: $data.info.order_status == 4
  }, $data.info.order_status == 4 ? {} : {}, {
    g: $data.info.order_status == 5
  }, $data.info.order_status == 5 ? {} : {}, {
    h: $data.info.order_status == 6
  }, $data.info.order_status == 6 ? {} : {}, {
    i: $data.info.order_status == 0
  }, $data.info.order_status == 0 ? {} : {}, {
    j: $data.info.order_status == 1
  }, $data.info.order_status == 1 ? {} : {}, {
    k: $data.info.order_status == 2
  }, $data.info.order_status == 2 ? {} : {}, {
    l: $data.info.order_status == 3
  }, $data.info.order_status == 3 ? {} : {}, {
    m: $data.info.order_status == 4
  }, $data.info.order_status == 4 ? {} : {}, {
    n: $data.info.order_status == 5
  }, $data.info.order_status == 5 ? {} : {}, {
    o: $data.info.order_status == 6
  }, $data.info.order_status == 6 ? {} : {}, {
    p: common_vendor.t($data.info.address.name),
    q: common_vendor.t($data.info.address.mobile),
    r: common_vendor.t($data.info.address.province),
    s: common_vendor.t($data.info.address.city),
    t: common_vendor.t($data.info.address.area),
    v: common_vendor.t($data.info.address.address),
    w: common_vendor.f($data.info.goods_detail, (val, ind, i0) => {
      return common_vendor.e({
        a: val.cover,
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
    x: $data.info.manager_discount > 0
  }, $data.info.manager_discount > 0 ? {
    y: common_vendor.t($data.info.manager_discount)
  } : {}, {
    z: $data.info.coupon_info
  }, $data.info.coupon_info ? {
    A: common_vendor.t($data.info.coupon_info.coupon_price)
  } : {}, {
    B: common_vendor.t($data.info.total_price),
    C: common_vendor.t($data.info.order_number),
    D: common_vendor.p({
      date: $data.info.create_time
    }),
    E: $data.info.pay_method
  }, $data.info.pay_method ? common_vendor.e({
    F: $data.info.pay_method == "balance_pay"
  }, $data.info.pay_method == "balance_pay" ? {} : {}, {
    G: $data.info.pay_method == "wxpay_mp-weixin"
  }, $data.info.pay_method == "wxpay_mp-weixin" ? {} : {}, {
    H: $data.info.pay_method == "wxpay_app-plus"
  }, $data.info.pay_method == "wxpay_app-plus" ? {} : {}, {
    I: $data.info.pay_method == "wxpay_h5"
  }, $data.info.pay_method == "wxpay_h5" ? {} : {}, {
    J: $data.info.pay_method == "alipay_mp-alipay"
  }, $data.info.pay_method == "alipay_mp-alipay" ? {} : {}, {
    K: $data.info.pay_method == "alipay_app-plus"
  }, $data.info.pay_method == "alipay_app-plus" ? {} : {}, {
    L: $data.info.pay_method == "alipay_h5"
  }, $data.info.pay_method == "alipay_h5" ? {} : {}) : {}, {
    M: $data.info.pay_time
  }, $data.info.pay_time ? {
    N: common_vendor.p({
      date: $data.info.pay_time
    })
  } : {}, {
    O: $data.info.is_refund > 0
  }, $data.info.is_refund > 0 ? common_vendor.e({
    P: common_vendor.p({
      date: $data.info.apply_refund_time
    }),
    Q: $data.info.is_refund == 3
  }, $data.info.is_refund == 3 ? {
    R: common_vendor.p({
      date: $data.info.refund_time
    })
  } : {}) : {}, {
    S: [2, 3].includes($data.info.order_status)
  }, [2, 3].includes($data.info.order_status) ? {
    T: common_vendor.o((...args) => $options.toLogistics && $options.toLogistics(...args))
  } : {}, {
    U: $data.info.order_status == 1
  }, $data.info.order_status == 1 ? {
    V: common_vendor.o((...args) => $options.showRefundReason && $options.showRefundReason(...args))
  } : {}, {
    W: $data.info.order_status == 5
  }, $data.info.order_status == 5 ? {
    X: common_vendor.o(($event) => $options.operaOrder("cancel_refund", "\u786E\u8BA4\u53D6\u6D88\u8BA2\u5355\u9000\u6B3E\u7533\u8BF7\u5417\uFF1F"))
  } : {}, {
    Y: $data.info.order_status == 2
  }, $data.info.order_status == 2 ? {
    Z: common_vendor.o(($event) => $options.operaOrder("confirm", "\u786E\u8BA4\u5DF2\u7ECF\u6536\u5230\u8D27\u4E86\u5417\uFF1F"))
  } : {}, {
    aa: $data.info.order_status == 3 && $data.info.is_comment != 1
  }, $data.info.order_status == 3 && $data.info.is_comment != 1 ? {
    ab: common_vendor.o((...args) => $options.toComment && $options.toComment(...args))
  } : {}, {
    ac: [4, 6].includes($data.info.order_status)
  }, [4, 6].includes($data.info.order_status) ? {
    ad: common_vendor.o(($event) => $options.operaOrder("delete", "\u786E\u8BA4\u5220\u9664\u8BE5\u8BA2\u5355\u5417\uFF1F"))
  } : {}, {
    ae: common_vendor.sr("refund", "c3e61ece-5"),
    af: common_vendor.o($options.applyRefund)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c3e61ece"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/order_detail.vue"]]);
wx.createPage(MiniProgramPage);
