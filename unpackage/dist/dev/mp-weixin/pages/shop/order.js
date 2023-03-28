"use strict";
const common_vendor = require("../../common/vendor.js");
const uTabs = () => "../../components/u-tabs.js";
const payMethod = () => "../../components/pay-method.js";
const refundReason = () => "./components/refund-reason.js";
const pkAppGoods = common_vendor.Es.importObject("pk-app-goods");
const _sfc_main = {
  components: {
    uTabs,
    payMethod,
    refundReason
  },
  data() {
    return {
      nav: [
        { name: "\u5168\u90E8", status: -1 },
        { name: "\u5F85\u652F\u4ED8", status: 0 },
        { name: "\u5F85\u53D1\u8D27", status: 1 },
        { name: "\u5F85\u786E\u8BA4", status: 2 },
        { name: "\u5DF2\u5B8C\u6210", status: 3 }
      ],
      current: 0,
      list: [],
      limit: 12,
      is_content: true,
      payForm: {
        total_price: 0,
        order_id: ""
      }
    };
  },
  onLoad() {
    this.getOrderList(1, this.limit);
  },
  onReachBottom() {
    this.getOrderList(this.page + 1, this.limit);
  },
  methods: {
    async getOrderList(page, limit) {
      let t = this;
      try {
        common_vendor.index.showLoading({
          title: "\u73A9\u547D\u52A0\u8F7D\u4E2D..."
        });
        let res = await pkAppGoods.getOrderList(page, limit, { status: t.nav[t.current].status });
        if (page == 1) {
          t.list = res.data;
        } else {
          t.list = t.list.concat(res.data);
        }
        t.page = page;
        t.is_content = t.list.length != 0;
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
      }
    },
    changeOrder(e) {
      let t = this;
      t.current = e;
      t.getOrderList(1, t.limit);
    },
    toOrderDetail(data) {
      common_vendor.index.navigateTo({
        url: "./order_detail?id=" + data._id
      });
    },
    async payNow(data) {
      let t = this;
      try {
        t.payForm.total_price = data.total_price;
        t.payForm.order_id = data._id;
        common_vendor.index.showLoading({ title: "\u73A9\u547D\u52A0\u8F7D\u4E2D" });
        let res = await pkAppGoods.checkOrderIsPay(data._id);
        t.$refs.pay.showMethodPopop(true);
        common_vendor.index.hideLoading();
      } catch (e) {
        common_vendor.index.hideLoading();
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
        let pay_method = t.$refs.pay.getMethod();
        if (pay_method == "balance_pay") {
          let res = await pkAppGoods.balancePay({
            password: common_vendor.md5(e),
            order_id: t.payForm.order_id,
            pay_method
          });
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u652F\u4ED8\u6210\u529F",
            success() {
              setTimeout(function() {
                common_vendor.index.navigateTo({
                  url: "/pages/shop/order_detail?order_id=" + t.payForm.order_id
                });
              }, 1e3);
            }
          });
        }
      } catch (e2) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: e2.errMsg,
          showCancel: false
        });
      }
    },
    operaOrder(order_id, type, title) {
      let t = this;
      const operaFunc = async function() {
        try {
          if (type == "cancel") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u53D6\u6D88..." });
            let res = await pkAppGoods.cancelOrder(order_id);
          }
          if (type == "delete") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u5220\u9664..." });
            let res = await pkAppGoods.deleteOrder(order_id);
          }
          if (type == "confirm") {
            common_vendor.index.showToast({ title: "\u6B63\u5728\u786E\u8BA4..." });
            let res = await pkAppGoods.confirmOrder(order_id);
          }
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u64CD\u4F5C\u6210\u529F",
            success() {
              setTimeout(function() {
                t.getOrderList(1, t.limit);
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
    showRefundReason(order_id) {
      this.payForm.order_id = order_id;
      this.$refs.refund.showReason();
    },
    async applyRefund(data) {
      let t = this;
      try {
        common_vendor.index.showToast({
          title: "\u9000\u6B3E\u7533\u8BF7\u63D0\u4EA4\u4E2D..."
        });
        let res = await pkAppGoods.applyRefundOrder(t.payForm.order_id, data);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u64CD\u4F5C\u6210\u529F",
          success() {
            setTimeout(function() {
              t.getOrderList(1, t.limit);
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
    toComment(order_id) {
      common_vendor.index.navigateTo({
        url: "./comment?order_id=" + order_id
      });
    },
    toLogistics(id) {
      common_vendor.index.navigateTo({
        url: "/pages/common/logistics?order_id=" + id
      });
    }
  }
};
if (!Array) {
  const _component_u_tabs = common_vendor.resolveComponent("u-tabs");
  const _component_none_content = common_vendor.resolveComponent("none-content");
  const _component_pay_method = common_vendor.resolveComponent("pay-method");
  const _component_refund_reason = common_vendor.resolveComponent("refund-reason");
  (_component_u_tabs + _component_none_content + _component_pay_method + _component_refund_reason)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeOrder),
    b: common_vendor.p({
      list: $data.nav,
      current: $data.current,
      itemWidth: "20%"
    }),
    c: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.order_number),
        b: item.order_status == 0
      }, item.order_status == 0 ? {} : {}, {
        c: item.order_status == 1
      }, item.order_status == 1 ? {} : {}, {
        d: item.order_status == 2
      }, item.order_status == 2 ? {} : {}, {
        e: item.order_status == 3
      }, item.order_status == 3 ? {} : {}, {
        f: item.order_status == 4
      }, item.order_status == 4 ? {} : {}, {
        g: item.order_status == 5
      }, item.order_status == 5 ? {} : {}, {
        h: item.order_status == 6
      }, item.order_status == 6 ? {} : {}, {
        i: common_vendor.o(($event) => $options.toOrderDetail(item), index),
        j: common_vendor.f(item.goods_detail, (val, ind, i1) => {
          return {
            a: val.cover,
            b: common_vendor.t(val.name),
            c: common_vendor.t(val.price),
            d: common_vendor.t(val.count),
            e: ind,
            f: common_vendor.o(($event) => $options.toOrderDetail(item), ind)
          };
        }),
        k: common_vendor.t(item.goods_detail.length),
        l: common_vendor.t(item.total_price),
        m: [4, 5, 6].includes(item.order_status)
      }, [4, 5, 6].includes(item.order_status) ? {
        n: common_vendor.o(($event) => $options.operaOrder(item._id, "delete", "\u786E\u8BA4\u5220\u9664\u8BE5\u8BA2\u5355\u5417"), index)
      } : {}, {
        o: item.order_status == 0
      }, item.order_status == 0 ? {
        p: common_vendor.o(($event) => $options.operaOrder(item._id, "cancel", "\u786E\u8BA4\u53D6\u6D88\u8BE5\u8BA2\u5355\u5417"), index),
        q: common_vendor.o(($event) => $options.payNow(item), index)
      } : {}, {
        r: item.order_status == 1
      }, item.order_status == 1 ? {
        s: common_vendor.o(($event) => $options.showRefundReason(item._id), index)
      } : {}, {
        t: item.order_status == 2
      }, item.order_status == 2 ? {
        v: common_vendor.o(($event) => $options.operaOrder(item._id, "confirm", "\u786E\u8BA4\u8BE5\u8BA2\u5355\u5DF2\u6536\u5230\u8D27\u4E86\u5417"), index)
      } : {}, {
        w: [2, 3].includes(item.order_status)
      }, [2, 3].includes(item.order_status) ? {
        x: common_vendor.o(($event) => $options.toLogistics(item._id), index)
      } : {}, {
        y: item.order_status == 3 && !item.is_comment
      }, item.order_status == 3 && !item.is_comment ? {
        z: common_vendor.o(($event) => $options.toComment(item._id), index)
      } : {}, {
        A: index
      });
    }),
    d: !$data.is_content
  }, !$data.is_content ? {
    e: common_vendor.p({
      top: 150
    })
  } : {}, {
    f: common_vendor.sr("pay", "8e8a4911-2"),
    g: common_vendor.o($options.getPwd),
    h: common_vendor.p({
      custom: "popup",
      money: $data.payForm.total_price
    }),
    i: common_vendor.sr("refund", "8e8a4911-3"),
    j: common_vendor.o($options.applyRefund)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8e8a4911"], ["__file", "E:/uniapp/\u4E5D\u9E3F\u5546\u57CE\u5BA2\u6237\u7AEFuniapp\u7248/pages/shop/order.vue"]]);
wx.createPage(MiniProgramPage);
